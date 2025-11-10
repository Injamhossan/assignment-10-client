import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../firebase/firebase.config';
import { toast } from 'react-toastify';
import { registerUser, updateUser } from '../services/api';

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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Fetch user data from MongoDB if available
        try {
          // You can fetch user data from your server here if needed
          setUserData({
            uid: currentUser.uid,
            email: currentUser.email,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL
          });
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
        setUserData(null);
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
      
      // Send user data to MongoDB server
      const userDataToSend = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        name: name,
        displayName: name,
        photoURL: userCredential.user.photoURL || null
      };
      
      await registerUser(userDataToSend);
      
      toast.success('Account created successfully!');
      return userCredential.user;
    } catch (error) {
      const errorMessage = error.message || 'Registration failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Login with email and password
  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Login successful!');
      return userCredential.user;
    } catch (error) {
      const errorMessage = error.message || 'Login failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Google Sign In
  const googleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Send user data to MongoDB server
      const userDataToSend = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        name: userCredential.user.displayName,
        displayName: userCredential.user.displayName,
        photoURL: userCredential.user.photoURL || null
      };
      
      // Try to register user in MongoDB (will handle if user already exists)
      try {
        await registerUser(userDataToSend);
      } catch (error) {
        // User might already exist, which is fine for login
        console.log('User might already exist in database');
      }
      
      toast.success('Google login successful!');
      return userCredential.user;
    } catch (error) {
      const errorMessage = error.message || 'Google login failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUserData(null);
      toast.success('Logged out successfully!');
    } catch (error) {
      const errorMessage = error.message || 'Logout failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  // Update user profile
  const updateUserProfile = async (userData) => {
    try {
      if (auth.currentUser) {
        // Update Firebase profile
        const firebaseUpdate = {};
        if (userData.name) {
          firebaseUpdate.displayName = userData.name;
        }
        if (userData.photoURL !== undefined) {
          firebaseUpdate.photoURL = userData.photoURL;
        }
        
        if (Object.keys(firebaseUpdate).length > 0) {
          await updateProfile(auth.currentUser, firebaseUpdate);
        }
        
        // Update in MongoDB - send all user data
        const userDataToUpdate = {
          uid: auth.currentUser.uid,
          email: auth.currentUser.email,
          name: userData.name || auth.currentUser.displayName,
          displayName: userData.name || auth.currentUser.displayName,
          photoURL: userData.photoURL || auth.currentUser.photoURL || null,
          bio: userData.bio || '',
          phone: userData.phone || '',
          location: userData.location || '',
          interests: userData.interests || '',
          education: userData.education || '',
        };
        
        await updateUser(auth.currentUser.uid, userDataToUpdate);
        
        // Update local state
        setUserData(prev => ({ ...prev, ...userDataToUpdate }));
        
        // Update Firebase user object in state
        const updatedUser = { ...auth.currentUser };
        if (userData.name) {
          updatedUser.displayName = userData.name;
        }
        if (userData.photoURL !== undefined) {
          updatedUser.photoURL = userData.photoURL;
        }
        setUser(updatedUser);
        
        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Profile update failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const value = {
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

