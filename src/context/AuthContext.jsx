// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  getIdToken,
  deleteUser
} from 'firebase/auth';
import { auth } from '../firebase/firebase.config';
import { toast } from 'react-toastify';
import {
  registerUser,
  loginUser,
  updateUserProfile as apiUpdateUserProfile,
  deleteMyProfile,
  sendConnectionRequest,
  cancelConnectionRequest,
  getPartners
} from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // firebase user
  const [userData, setUserData] = useState(null); // app user from server (contains sentRequests etc)
  const [partnerData, setPartnerData] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAndSetPartnerData = async (email) => {
    if (!email) return setPartnerData(null);
    try {
      const all = await getPartners();
      const me = all.find(p => p.email === email) || null;
      setPartnerData(me);
    } catch (err) {
      console.error('checkAndSetPartnerData error:', err);
      setPartnerData(null);
    }
  };

  const handleAuthResponse = useCallback(async (data) => {
    if (data?.token) localStorage.setItem('token', data.token);
    if (data?.user) {
      setUserData(data.user);
      await checkAndSetPartnerData(data.user.email);
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const firebaseToken = await getIdToken(currentUser, true);
          const data = await loginUser({ email: currentUser.email, firebaseToken });
          await handleAuthResponse(data);
        } catch (err) {
          console.error('onAuthStateChanged loginUser error:', err?.message || err);
          if (err.response?.status === 404) {
            // user not in DB yet — may be created on Google sign-in etc.
            console.log('User not in DB yet.');
          } else {
            await signOut(auth);
          }
        }
      } else {
        setUser(null);
        setUserData(null);
        setPartnerData(null);
        localStorage.removeItem('token');
      }
      setLoading(false);
    });

    return () => unsub();
  }, [handleAuthResponse]);

  // register/login/logout/update/delete omitted for brevity but expected to be same as earlier
  // I'll include register/login/logout/updateUserProfile/deleteAccount/sendRequest/cancelRequest

  const register = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      const firebaseToken = await getIdToken(userCredential.user);
      const data = await registerUser({ name, email, password, firebaseToken });
      await handleAuthResponse(data);
      return userCredential.user;
    } catch (error) {
      const msg = error.response?.data?.msg || error.message || 'Registration failed';
      if (!error.response) toast.error(msg);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseToken = await getIdToken(userCredential.user);
      const data = await loginUser({ email, password, firebaseToken });
      await handleAuthResponse(data);
      return userCredential.user;
    } catch (error) {
      const msg = error.response?.data?.msg || error.message || 'Login failed';
      if (!error.response) toast.error(msg);
      throw error;
    }
  };

  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const firebaseToken = await getIdToken(userCredential.user);
      const payload = {
        name: userCredential.user.displayName,
        email: userCredential.user.email,
        firebaseToken
      };
      try {
        const data = await registerUser(payload);
        await handleAuthResponse(data);
      } catch (err) {
        if (err.response && (err.response.status === 400 || err.response.status === 409)) {
          const data = await loginUser({ email: payload.email, firebaseToken });
          await handleAuthResponse(data);
        } else {
          throw err;
        }
      }
      return userCredential.user;
    } catch (error) {
      const msg = error.response?.data?.msg || error.message || 'Google login failed';
      if (!error.response) toast.error(msg);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUserData(null);
      setPartnerData(null);
      localStorage.removeItem('token');
      toast.success('Logged out');
    } catch (err) {
      toast.error(err.message || 'Logout failed');
      throw err;
    }
  };

  const updateUserProfile = async (formData) => {
    try {
      if (auth.currentUser) {
        const firebaseUpdate = {};
        if (formData.name) firebaseUpdate.displayName = formData.name;
        if (formData.photoURL !== undefined) firebaseUpdate.photoURL = formData.photoURL;
        if (Object.keys(firebaseUpdate).length > 0) {
          await updateProfile(auth.currentUser, firebaseUpdate);
        }
        const updated = await apiUpdateUserProfile(formData);
        setUserData(updated);
        const updatedFirebaseUser = { ...auth.currentUser };
        if (formData.name) updatedFirebaseUser.displayName = formData.name;
        if (formData.photoURL !== undefined) updatedFirebaseUser.photoURL = formData.photoURL;
        setUser(updatedFirebaseUser);
      }
    } catch (err) {
      const msg = err.response?.data?.msg || err.message || 'Profile update failed';
      if (!err.response) toast.error(msg);
      throw err;
    }
  };

  const deleteAccount = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error('No user logged in');
      await deleteMyProfile();
      await deleteUser(currentUser);
      toast.success('Account deleted');
    } catch (err) {
      console.error('deleteAccount error:', err);
      const msg = err.response?.data?.msg || err.message || 'Failed to delete account';
      if (err.code === 'auth/requires-recent-login') {
        toast.error('Please re-login before deleting account (recent login required).');
      } else {
        toast.error(msg);
      }
      throw err;
    }
  };

  const sendRequest = async (partnerId) => {
    try {
      await sendConnectionRequest(partnerId);
      setUserData(prev => ({
        ...prev,
        sentRequests: [...(prev?.sentRequests || []), partnerId]
      }));
    } catch (err) {
      console.error('sendRequest error:', err);
      throw err;
    }
  };

  // CANCEL: optimistic update + rollback (matches server route DELETE /auth/request/cancel/:partnerId)
  const cancelRequest = async (partnerId) => {
    if (!partnerId) throw new Error('partnerId required');

    const prevSent = userData?.sentRequests ? [...userData.sentRequests] : [];

    // optimistic update
    setUserData(prev => {
      if (!prev) return prev;
      return { ...prev, sentRequests: (prev.sentRequests || []).filter(id => id !== partnerId) };
    });

    try {
      await cancelConnectionRequest(partnerId); // hits DELETE /auth/request/cancel/:partnerId
      toast.success('Cancelled request');
    } catch (err) {
      console.error('cancelRequest error, rolling back:', err);
      // rollback
      setUserData(prev => ({ ...prev, sentRequests: prevSent }));
      const serverMsg = err.response?.data?.msg || err.message || 'Failed to cancel request';
      toast.error(serverMsg);
      throw err;
    }
  };

  const value = {
    user,
    userData,
    partnerData,
    loading,
    register,
    login,
    googleSignIn,
    logout,
    updateUserProfile,
    deleteAccount,
    sendRequest,
    cancelRequest,
    checkAndSetPartnerData
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
