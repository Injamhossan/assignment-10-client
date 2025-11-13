import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://assignment-10-server-ivory-eta.vercel.app/api/';

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
}, (err) => Promise.reject(err));


export const registerUser = async (userData) => {
  try {
    const res = await api.post('/auth/register', userData);
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
    const res = await api.post('/auth/login', loginData);
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
    const res = await api.get('/auth/me');
    return res.data.user;
  } catch (error) {
    console.error('getMyProfile error:', error.response?.data?.msg || error.message);
    throw error;
  }
};

export const updateUserProfile = async (userData) => {
  try {
    const res = await api.put('/auth/me', userData);
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
    const res = await api.delete('/auth/me');
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
    const res = await api.get('/partners');
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
    const res = await api.post('/partners', partnerData);
    toast.success('Partner created!');
    return res.data;
  } catch (error) {
    console.error('createPartner error:', error.response?.data?.msg || error.message);
    toast.error(error.response?.data?.msg || 'Failed to create partner');
    throw error;
  }
};

export const updatePartnerProfile = async (partnerId, partnerData) => {
  try {
    const res = await api.put(`/partners/${partnerId}`, partnerData);
    toast.success('Partner updated!');
    return res.data;
  } catch (error) {
    console.error('updatePartnerProfile error:', error.response?.data?.msg || error.message);
    toast.error(error.response?.data?.msg || 'Failed to update partner');
    throw error;
  }
};

export const getPartnerById = async (id) => {
  try {
    const res = await api.get(`/partners/${id}`);
    return res.data.data;
  } catch (error) {
    console.error('getPartnerById error:', error.response?.data?.msg || error.message);
    toast.error(error.response?.data?.msg || 'Failed to fetch partner');
    throw error;
  }
};

export const sendConnectionRequest = async (partnerId) => {
  try {
    const res = await api.post(`/auth/request/send/${partnerId}`);
    toast.success(res.data.msg || 'Request sent!');
    return res.data;
  } catch (error) {
    console.error('sendConnectionRequest error:', error.response?.data?.msg || error.message);
    toast.error(error.response?.data?.msg || 'Failed to send request');
    throw error;
  }
};

export const cancelConnectionRequest = async (partnerId) => {
  try {
    const res = await api.delete(`/auth/request/cancel/${partnerId}`);
        return res.data;
  } catch (error) {
    console.error('cancelConnectionRequest error:', error.response?.status, error.response?.data || error.message);
    
    throw error;
  }
};

export default api;
