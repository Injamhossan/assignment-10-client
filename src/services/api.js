import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Register user in MongoDB
export const registerUser = async (userData) => {
  try {
    const response = await api.post('/users/register', userData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 409) {
      // User already exists, which is fine
      return { message: 'User already exists' };
    }
    throw error;
  }
};

// Update user in MongoDB
export const updateUser = async (uid, userData) => {
  try {
    const response = await api.put(`/users/${uid}`, userData);
    // Handle different response formats
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  } catch (error) {
    // If user doesn't exist, try to create/register them
    if (error.response?.status === 404) {
      try {
        const registerResponse = await registerUser({ uid, ...userData });
        return registerResponse;
      } catch (registerError) {
        console.error('Error creating user during update:', registerError);
        throw registerError;
      }
    }
    console.error('Error updating user:', error);
    throw error;
  }
};

// Get user data from MongoDB
export const getUser = async (uid) => {
  try {
    const response = await api.get(`/users/${uid}`);
    // Handle different response formats
    if (response.data.data) {
      return response.data.data;
    }
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      // User not found in database
      return null;
    }
    console.error('Error fetching user:', error);
    throw error;
  }
};

// Get all partners
export const getPartners = async () => {
  try {
    const response = await api.get('/partners');
    // Handle different response formats
    if (response.data && response.data.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    if (Array.isArray(response.data)) {
      return response.data;
    }
    // If response.data is an object with a partners array
    if (response.data && Array.isArray(response.data.partners)) {
      return response.data.partners;
    }
    // Return empty array if no valid data structure
    return [];
  } catch (error) {
    console.error('Error fetching partners:', error);
    // If server is not running or network error, return empty array
    if (!error.response || error.response?.status === 404) {
      console.warn('Partners endpoint not available or no partners found');
      return [];
    }
    // Only show toast for actual errors (not 404)
    if (error.response?.status !== 404) {
      toast.error('Failed to fetch partners. Please try again later.');
    }
    return [];
  }
};

// Create partner profile
export const createPartner = async (partnerData) => {
  try {
    const response = await api.post('/partners', partnerData);
    toast.success('Partner profile created successfully!');
    return response.data;
  } catch (error) {
    console.error('Error creating partner:', error);
    toast.error('Failed to create partner profile');
    throw error;
  }
};

export default api;

