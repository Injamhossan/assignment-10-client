// context/AuthContext.jsx

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
  sendConnectionRequest, // <-- Notun import
  cancelConnectionRequest // <-- Notun import
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
  const [userData, setUserData] = useState(null); // Ei state apnar MongoDB data rakhbe

  // Login ba registration er por JWT token save kore
  const handleAuthResponse = (data) => {
    if (data.token) {
      localStorage.setItem('token', data.token); 
    }
    if (data.user) {
      setUserData(data.user); // MongoDB theke আসা user data set kora
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Firebase user set kora
        
        try {
          const firebaseToken = await getIdToken(currentUser, true);
          
          const loginData = { 
            email: currentUser.email,
            firebaseToken: firebaseToken 
          };
          
          const data = await loginUser(loginData); // api.js theke
          handleAuthResponse(data); // Token save hobe, user data set hobe
          
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
        localStorage.removeItem('token'); // Logout hole token remove
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
      handleAuthResponse(data); 
      
      toast.success('Account created successfully!');
      return userCredential.user;
    } catch (error) {
      const errorMessage = error.response?.data?.msg || error.message || 'Registration failed';
      toast.error(errorMessage);
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
      handleAuthResponse(data); 
      
      toast.success('Login successful!');
      return userCredential.user;
    } catch (error) {
      const errorMessage = error.response?.data?.msg || error.message || 'Login failed';
      toast.error(errorMessage);
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
        handleAuthResponse(data); 
      } catch (error) {
        if (error.response && (error.response.status === 400 || error.response.status === 409)) {
          console.log('User already in DB, logging in...');
          const loginData = {
            email: userCredential.user.email,
            firebaseToken: firebaseToken
          };
          const data = await loginUser(loginData);
          handleAuthResponse(data); 
        } else {
          throw error; 
        }
      }
      
      toast.success('Google login successful!');
      return userCredential.user;
    } catch (error) {
      const errorMessage = error.response?.data?.msg || error.message || 'Google login failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUserData(null);
      localStorage.removeItem('token'); 
      toast.success('Logged out successfully!');
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
        setUserData(updatedMongoUser); // Server theke asha notun data diye state update
        
        // Update Firebase user object in state
        const updatedFirebaseUser = { ...auth.currentUser };
        if (userDataFromForm.name) updatedFirebaseUser.displayName = userDataFromForm.name;
        if (userDataFromForm.photoURL !== undefined) updatedFirebaseUser.photoURL = userDataFromForm.photoURL;
        setUser(updatedFirebaseUser);
        
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Profile update failed';
      toast.error(errorMessage);
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

      // Step 1: Delete user data from MongoDB
      await deleteMyProfile(); // api.js theke

      // Step 2: Delete user from Firebase
      await deleteUser(currentUser);

      toast.success('Account deleted successfully.');

    } catch (error) {
      console.error('Error deleting account:', error);
      
      let errorMessage = error.response?.data?.msg || error.message || 'Failed to delete account.';

      if (error.code === 'auth/requires-recent-login') {
        errorMessage = 'This is a sensitive operation. Please log out and log back in before deleting your account.';
      }

      toast.error(errorMessage);
      throw error; 
    }
  };

  // --- NOTUN FUNCTION (START) ---
  const sendRequest = async (partnerId) => {
    try {
      await sendConnectionRequest(partnerId);
      // Local state update kora jate UI instant update hoy
      setUserData(prevData => ({
        ...prevData,
        sentRequests: [...(prevData.sentRequests || []), partnerId]
      }));
    } catch (error) {
      // toast.error(...) api.js thekei handle kora hocche
    }
  };

  const cancelRequest = async (partnerId) => {
    try {
      await cancelConnectionRequest(partnerId);
      // Local state update kora
      setUserData(prevData => ({
        ...prevData,
        sentRequests: (prevData.sentRequests || []).filter(id => id !== partnerId)
      }));
    } catch (error) {
      // toast.error(...) api.js thekei handle kora hocche
    }
  };
  // --- NOTUN FUNCTION (END) ---

  const value = {
    user,
    userData,
    loading,
    register,
    login,
    googleSignIn,
    logout,
    updateUserProfile,
    deleteAccount,
    sendRequest, // <-- Notun export
    cancelRequest // <-- Notun export
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};