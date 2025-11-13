// src/context/AuthContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
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
// Shob proyojonio function import korun
import { 
  registerUser, 
  loginUser, 
  getMyProfile, 
  updateUserProfile as apiUpdateUserProfile,
  deleteMyProfile,
  sendConnectionRequest, 
  cancelConnectionRequest,
  getPartners
} from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null); 
  const [partnerData, setPartnerData] = useState(null); 

  const checkAndSetPartnerData = async (email) => {
    if (!email) {
      setPartnerData(null);
      return;
    }
    try {
      const allPartners = await getPartners();
      const myPartnerProfile = allPartners.find(p => p.email === email);
      if (myPartnerProfile) {
        setPartnerData(myPartnerProfile);
      } else {
        setPartnerData(null);
      }
    } catch (err) {
      console.error("Failed to fetch partner profile", err);
      setPartnerData(null);
    }
  };


  const handleAuthResponse = async (data) => {
    if (data.token) {
      localStorage.setItem('token', data.token); 
    }
    if (data.user) {
      setUserData(data.user); 
      await checkAndSetPartnerData(data.user.email); 
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser); 
        
        try {
          const firebaseToken = await getIdToken(currentUser, true);
          
          const loginData = { 
            email: currentUser.email,
            firebaseToken: firebaseToken 
          };
          
          const data = await loginUser(loginData); 
          await handleAuthResponse(data); 
          
        } catch (error) {
          console.error('onAuthStateChanged error (maybe user not in DB yet):', error.message);
          if (error.response && error.response.status === 404) {
             console.log("User not in DB. Google Sign In will handle registration.");
          } else {
            console.error('Failed to auto-login to server, logging out.');
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

    return () => unsubscribe();
  }, []);

  // Register with email and password
  const register = async (email, password, name) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      const firebaseToken = await getIdToken(userCredential.user);

      const userDataToSend = {
        name: name,
        email: email,
        password: password, 
        firebaseToken: firebaseToken
      };
      
      const data = await registerUser(userDataToSend); 
      await handleAuthResponse(data); 
      
      // --- PORIBORTON: Duplicate toast remove kora hoyeche ---
      // toast.success('Account created successfully!'); 
      
      return userCredential.user;
    } catch (error) {
      const errorMessage = error.response?.data?.msg || error.message || 'Registration failed';
      // --- PORIBORTON: Shudhu error toast-ti rakha hoyeche (jodi api.js fafail kore) ---
      if (!error.response) {
        toast.error(errorMessage);
      }
      throw error;
    }
  };

  // Login with email and password
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      const firebaseToken = await getIdToken(userCredential.user);

      const loginData = {
        email: email,
        password: password, 
        firebaseToken: firebaseToken
      };

      const data = await loginUser(loginData); 
      await handleAuthResponse(data); 
      
      // --- PORIBORTON: Duplicate toast remove kora hoyeche ---
      // toast.success('Login successful!'); 

      return userCredential.user;
    } catch (error) {
      const errorMessage = error.response?.data?.msg || error.message || 'Login failed';
      // --- PORIBORTON: Shudhu error toast-ti rakha hoyeche ---
       if (!error.response) {
        toast.error(errorMessage);
      }
      throw error;
    }
  };

  // Google Sign In
  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      const firebaseToken = await getIdToken(userCredential.user);
      
      const userDataToSend = {
        name: userCredential.user.displayName,
        email: userCredential.user.email,
        firebaseToken: firebaseToken
      };
      
      try {
        const data = await registerUser(userDataToSend);
        await handleAuthResponse(data); 
      } catch (error) {
        if (error.response && (error.response.status === 400 || error.response.status === 409)) {
          console.log('User already in DB, logging in...');
          const loginData = {
            email: userCredential.user.email,
            firebaseToken: firebaseToken
          };
          const data = await loginUser(loginData);
          await handleAuthResponse(data); 
        } else {
          throw error; 
        }
      }
      
      // --- PORIBORTON: Duplicate toast remove kora hoyeche ---
      // toast.success('Google login successful!'); 
      
      return userCredential.user;
    } catch (error) {
      const errorMessage = error.response?.data?.msg || error.message || 'Google login failed';
      // --- PORIBORTON: Shudhu error toast-ti rakha hoyeche ---
       if (!error.response) {
        toast.error(errorMessage);
      }
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUserData(null);
      setPartnerData(null); 
      localStorage.removeItem('token'); 
      toast.success('Logged out successfully!'); // Eti rakha thik ache
    } catch (error) {
      const errorMessage = error.message || 'Logout failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (userDataFromForm) => {
    try {
      if (auth.currentUser) {
        // Update Firebase profile
        const firebaseUpdate = {};
        if (userDataFromForm.name) {
          firebaseUpdate.displayName = userDataFromForm.name;
        }
        if (userDataFromForm.photoURL !== undefined) {
          firebaseUpdate.photoURL = userDataFromForm.photoURL;
        }
        
        if (Object.keys(firebaseUpdate).length > 0) {
          await updateProfile(auth.currentUser, firebaseUpdate);
        }
        
        // Update in MongoDB
        const updatedMongoUser = await apiUpdateUserProfile(userDataFromForm); 
        
        // Update local state
        setUserData(updatedMongoUser); 
        
        // Update Firebase user object in state
        const updatedFirebaseUser = { ...auth.currentUser };
        if (userDataFromForm.name) updatedFirebaseUser.displayName = userDataFromForm.name;
        if (userDataFromForm.photoURL !== undefined) updatedFirebaseUser.photoURL = userDataFromForm.photoURL;
        setUser(updatedFirebaseUser);
        
        // --- PORIBORTON: Duplicate toast remove kora hoyeche ---
        // toast.success('Profile updated successfully!'); 
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Profile update failed';
      // --- PORIBORTON: Shudhu error toast-ti rakha hoyeche ---
       if (!error.response) {
        toast.error(errorMessage);
      }
      throw error;
    }
  };

  // Delete user account
  const deleteAccount = async () => {
    try {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('No user is currently logged in.');
      }

      await deleteMyProfile(); 
      await deleteUser(currentUser);

      // Eti rakha thik ache, karon api.js success toast dey na
      toast.success('Account deleted successfully.');

    } catch (error) {
      console.error('Error deleting account:', error);
      
      let errorMessage = error.response?.data?.msg || error.message || 'Failed to delete account.';

      if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'This is a sensitive operation. Please log out and log back in before deleting your account.';
      }

      // --- PORIBORTON: Shudhu error toast-ti rakha hoyeche ---
       if (!error.response) {
         toast.error(errorMessage);
       }
      throw error; 
    }
  };

  const sendRequest = async (partnerId) => {
    try {
      await sendConnectionRequest(partnerId);
      setUserData(prevData => ({
        ...prevData,
        sentRequests: [...(prevData.sentRequests || []), partnerId]
      }));
    } catch (error) {
      // api.js theke toast ashbe
    }
  };

  const cancelRequest = async (partnerId) => {
    try {
      await cancelConnectionRequest(partnerId);
      setUserData(prevData => ({
        ...prevData,
        sentRequests: (prevData.sentRequests || []).filter(id => id !== partnerId)
      }));
    } catch (error) {
      console.log (error);
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