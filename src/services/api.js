import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = 'https://assignment-10-server-ivory-eta.vercel.app/api/';

// Axios instance toiri kora
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const registerUser = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    toast.success('Registration Successful!');
    return response.data; 
  } catch (error) {
    console.error('Error registering user:', error.response?.data?.msg || error.message);
    toast.error(error.response?.data?.msg || 'Registration failed');
    throw error;
  }
};


export const loginUser = async (loginData) => {
  try {
    const response = await api.post('/auth/login', loginData);
    toast.success('Login Successful!');
    return response.data; 
  } catch (error) {
    console.error('Error logging in:', error.response?.data?.msg || error.message);
    toast.error(error.response?.data?.msg || 'Login failed');
    throw error;
  }
};

export const getMyProfile = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data.user; 
  } catch (error) {
    console.error('Error fetching profile:', error.response?.data?.msg || error.message);
    throw error;
  }
};

// --- Partners Routes ---

export const getPartners = async () => {
  try {
    const response = await api.get('/partners');
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('Error fetching partners:', error.response?.data?.msg || error.message);
    toast.error(error.response?.data?.msg || 'Failed to fetch partners');
    return [];
  }
};

export const createPartner = async (partnerData) => {
  try {
    const response = await api.post('/partners', partnerData);
    toast.success('Partner profile created successfully!');
    return response.data; 
  } catch (error) {
    console.error('Error creating partner:', error.response?.data?.msg || error.message);
    toast.error(error.response?.data?.msg || 'Failed to create partner profile');
    throw error;
  }
};

/**
 * Existing partner profile update
 */
export const updatePartnerProfile = async (partnerId, partnerData) => {
  try {
    const response = await api.put(`/partners/${partnerId}`, partnerData);
    toast.success('Partner profile updated successfully!');
    return response.data; // { success: true, data: {...} } return korbe
  } catch (error) {
    console.error('Error updating partner:', error.response?.data?.msg || error.message);
    toast.error(error.response?.data?.msg || 'Failed to update partner profile');
    throw error;
  }
};


export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('/auth/me', userData); 
    toast.success(response.data.msg || 'Profile updated successfully!');
    return response.data.user; 
  } catch (error) {
    console.error('Error updating profile:', error.response?.data?.msg || error.message);
    toast.error(error.response?.data?.msg || 'Profile update failed');
    throw error;
  }
};

export const deleteMyProfile = async () => {
  try {
    const response = await api.delete('/auth/me');
    return response.data; 
  } catch (error) {
    console.error('Error deleting profile from DB:', error.response?.data?.msg || error.message);
    toast.error(error.response?.data?.msg || 'Failed to delete profile data');
    throw error;
  }
};


export const getPartnerById = async (id) => {
  try {
    const response = await api.get(`/partners/${id}`);
    if (response.data && response.data.data) {
      return response.data.data;
    }
  } catch (error) {
    console.error('Error fetching partner by ID:', error.response?.data?.msg || error.message);
    toast.error(error.response?.data?.msg || 'Failed to fetch partner');
    throw error;
  }
};

export const sendConnectionRequest = async (partnerId) => {
  try {
    const response = await api.post(`/auth/request/send/${partnerId}`);
    toast.success(response.data.msg || 'Request Sent!');
    return response.data;
  } catch (error) {
    console.error('Error sending request:', error.response?.data?.msg || error.message);
    toast.error(error.response?.data?.msg || 'Failed to send request');
    throw error;
  }
};


export const cancelConnectionRequest = async (partnerId) => {
  try {
    const response = await api.post(`/auth/request/cancel/${partnerId}`);
    toast.success(response.data.msg || 'Request Cancelled!');
    return response.data;
  } catch (error) {
    console.error('Error cancelling request:', error.response?.data?.msg || error.message);
    toast.error(error.response?.data?.msg || 'Failed to cancel request');
    throw error;
  }
};

export default api;