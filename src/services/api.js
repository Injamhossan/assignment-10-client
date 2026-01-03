import axios from 'axios';
import { toast } from '../utils/toastManager';
import { loadingManager } from '../utils/loadingManager';

// Base URLs according to documentation
// Local: http://localhost:5000
// Production: https://assignment-10-server-ivory-eta.vercel.app
const getBaseURL = () => {
  const envURL = import.meta.env.VITE_API_BASE_URL;
  if (envURL) {
    // If env URL is provided, ensure it doesn't have trailing slash
    return envURL.endsWith('/') ? envURL.slice(0, -1) : envURL;
  }
  // Default to production URL
  return 'https://assignment-10-server-ih.vercel.app';
};

const API_BASE_URL = getBaseURL();

// Debug: Check which API URL is being used
console.log('🔍 API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  loadingManager.startLoading(); // Start global loading
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (err) => {
  loadingManager.stopLoading();
  return Promise.reject(err);
});

api.interceptors.response.use(
  (response) => {
    loadingManager.stopLoading(); // Stop global loading on success
    return response;
  },
  (error) => {
    loadingManager.stopLoading(); // Stop global loading on error
    return Promise.reject(error);
  }
);


export const registerUser = async (userData) => {
  try {
    const res = await api.post('/api/auth/register', userData);
    toast.success('Registration successful!');
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.msg || error.message || 'Registration failed';
    console.error('registerUser error:', msg);
    if (!msg.includes('already registered')) toast.error(msg);
    throw error;
  }
};

export const loginUser = async (loginData) => {
  try {
    const res = await api.post('/api/auth/login', loginData);
    toast.success('Login successful!');
    return res.data;
  } catch (error) {
    const msg = error.response?.data?.msg || error.message || 'Login failed';
    console.error('loginUser error:', msg);
    toast.error(msg);
    throw error;
  }
};

export const getMyProfile = async () => {
  try {
    const res = await api.get('/api/auth/me');
    return res.data.user;
  } catch (error) {
    console.error('getMyProfile error:', error.response?.data?.msg || error.message);
    throw error;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const res = await api.put('/api/auth/me', userData);
    toast.success(res.data.msg || 'Profile updated!');
    return res.data.user;
  } catch (error) {
    console.error('updateUserProfile error:', error.response?.data?.msg || error.message);
    toast.error(error.response?.data?.msg || 'Profile update failed');
    throw error;
  }
};

export const deleteMyProfile = async () => {
  try {
    const res = await api.delete('/api/auth/me');
    return res.data;
  } catch (error) {
    console.error('deleteMyProfile error:', error.response?.data?.msg || error.message);
    toast.error(error.response?.data?.msg || 'Failed to delete profile');
    throw error;
  }
};

// --- Partners ---
export const getPartners = async () => {
  try {
    const res = await api.get('/api/partners');
    if (res.data && Array.isArray(res.data.data)) return res.data.data;
    return [];
  } catch (error) {
    console.error('getPartners error:', error.response?.data?.msg || error.message);
    toast.error(error.response?.data?.msg || 'Failed to fetch partners');
    return [];
  }
};

export const createPartner = async (partnerData) => {
  try {
    const res = await api.post('/api/partners', partnerData);
    toast.success(res.data.msg || 'Partner created!');
    return res.data;
  } catch (error) {
    console.error('createPartner error:', error.response?.data?.msg || error.message);
    toast.error(error.response?.data?.msg || 'Failed to create partner');
    throw error;
  }
};

export const updatePartnerProfile = async (partnerId, partnerData) => {
  try {
    const res = await api.put(`/api/partners/${partnerId}`, partnerData);
    toast.success(res.data.msg || 'Partner updated!');
    return res.data;
  } catch (error) {
    console.error('updatePartnerProfile error:', error.response?.data?.msg || error.message);
    toast.error(error.response?.data?.msg || 'Failed to update partner');
    throw error;
  }
};

export const getPartnerById = async (id) => {
  try {
    const res = await api.get(`/api/partners/${id}`);
    return res.data.data;
  } catch (error) {
    console.error('getPartnerById error:', error.response?.data?.msg || error.message);
    toast.error(error.response?.data?.msg || 'Failed to fetch partner');
    throw error;
  }
};

export const sendConnectionRequest = async (partnerId) => {
  try {
    const res = await api.post(`/api/auth/request/send/${partnerId}`);
    toast.success(res.data.msg || 'Request sent!');
    return res.data;
  } catch (error) {
    console.error('sendConnectionRequest error:', error.response?.data?.msg || error.message);
    const errorMsg = error.response?.data?.msg || error.message || 'Failed to send request';
    toast.error(errorMsg);
    throw error;
  }
};

export const cancelConnectionRequest = async (partnerId) => {
  try {
    const res = await api.delete(`/api/auth/request/cancel/${partnerId}`);
    toast.success(res.data.msg || 'Request cancelled successfully');
    return res.data;
  } catch (error) {
    console.error('cancelConnectionRequest error:', error.response?.status, error.response?.data || error.message);
    const errorMsg = error.response?.data?.msg || error.message || 'Failed to cancel request';
    toast.error(errorMsg);
    throw error;
  }
};

// Get all requests (sent & received)
export const getRequests = async (type = 'all') => {
  try {
    const res = await api.get(`/api/auth/requests?type=${type}`);
    return res.data;
  } catch (error) {
    console.error('getRequests error:', error.response?.data?.msg || error.message);
    toast.error(error.response?.data?.msg || 'Failed to fetch requests');
    throw error;
  }
};

export default api;
