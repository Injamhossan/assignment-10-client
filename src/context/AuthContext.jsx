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
  getIdToken // <-- Notun import
} from 'firebase/auth';
import { auth } from '../firebase/firebase.config';
import { toast } from 'react-toastify';
// Shob proyojonio function import korun
import { 
  registerUser, 
  loginUser, 
  getMyProfile, 
  updateUserProfile as apiUpdateUserProfile // 'updateUserProfile' naam-e conflict er jonno alias
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
      localStorage.setItem('token', data.token); // <-- SHOBCHEYE GURUTTWOPURNO KAJ
    }
    if (data.user) {
      setUserData(data.user); // MongoDB theke আসা user data set kora
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser); // Firebase user set kora
        
        // currentUser login korar shathe shathe server theke data load korar cheshta
        try {
          // Firebase token (JWT noy) refresh kora
          const firebaseToken = await getIdToken(currentUser, true);
          
          // Ebar server e login kore JWT token ebong MongoDB data ana
          const loginData = { 
            email: currentUser.email,
            firebaseToken: firebaseToken 
          };
          
          const data = await loginUser(loginData); // api.js theke
          handleAuthResponse(data); // Token save hobe, user data set hobe
          
        } catch (error) {
          // Jemon user MongoDB te nei, kintu Firebase e ache (Google Sign In)
          console.error('onAuthStateChanged error (maybe user not in DB yet):', error.message);
          if (error.response && error.response.status === 404) {
             // User Firebase e ache kintu amader DB te nei. Register korte hobe.
             // Google Sign In er flow-e eta normal
             console.log("User not in DB. Google Sign In will handle registration.");
          } else {
            // Onno kono error hole logout
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
      // Step 1: Firebase e user create
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      // Step 2: Firebase theke token ber kora
      const firebaseToken = await getIdToken(userCredential.user);

      // Step 3: MongoDB server e register kora
      const userDataToSend = {
        name: name,
        email: email,
        password: password, // Server password chay tai pathano hocche
        firebaseToken: firebaseToken
      };
      
      const data = await registerUser(userDataToSend); // api.js theke
      handleAuthResponse(data); // <-- Token save hobe
      
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
      // Step 1: Firebase e Sign in
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Step 2: Firebase theke token ber kora
      const firebaseToken = await getIdToken(userCredential.user);

      // Step 3: MongoDB server e login kora
      const loginData = {
        email: email,
        password: password, // Server password chay tai pathano hocche
        firebaseToken: firebaseToken
      };

      const data = await loginUser(loginData); // api.js theke
      handleAuthResponse(data); // <-- Token save hobe
      
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
      
      // Step 2: Firebase theke token ber kora
      const firebaseToken = await getIdToken(userCredential.user);
      
      // Step 3: MongoDB server e register kora
      const userDataToSend = {
        name: userCredential.user.displayName,
        email: userCredential.user.email,
        // Password pathano hocche na (server code eta handle korbe)
        firebaseToken: firebaseToken
      };
      
      // Ebar amra register korar cheshta korbo
      try {
        const data = await registerUser(userDataToSend);
        handleAuthResponse(data); // Token save hobe
      } catch (error) {
        // Jodi user agei register thake (400/409 error), tahole login korbo
        if (error.response && (error.response.status === 400 || error.response.status === 409)) {
          console.log('User already in DB, logging in...');
          const loginData = {
            email: userCredential.user.email,
            firebaseToken: firebaseToken
            // Password dorkar nei, karon server logic eta handle korbe
          };
          const data = await loginUser(loginData);
          handleAuthResponse(data); // Token save hobe
        } else {
          throw error; // Onno error hole show korbe
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
      localStorage.removeItem('token'); // <-- Token remove kora
      toast.success('Logged out successfully!');
    } catch (error) {
      // Ei block-ti "..." diye replace hoyechilo
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
        // token thekei server bujhte parbe kon user
        const updatedMongoUser = await apiUpdateUserProfile(userDataFromForm); // api.js theke
        
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
      // Ei block-ti "..." diye replace hoyechilo
      const errorMessage = error.response?.data?.message || error.message || 'Profile update failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const value = {
    // Ei object-ti "..." diye replace hoyechilo
    user,
    userData,
    loading,
    register,
    login,
    googleSignIn,
    logout,
    updateUserProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};