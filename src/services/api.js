import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = 'https://assignment-10-server-ivory-eta.vercel.app/api/';


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
    
    const errorMsg = error.response?.data?.msg || error.message;
    console.error('Error registering user:', errorMsg);

    if (errorMsg && (errorMsg.includes('Email already registered') || errorMsg.includes('already registered'))) {
      // Kono toast dekhano hobe na
    } else {
      // Onno shob registration error-er jonno toast dekhano hobe
      toast.error(errorMsg || 'Registration failed');
    }
    
    // --- PORIBORTON END ---

    throw error; // Error-ti pass kora hocche jate AuthContext eta catch korte pare
  }
};


export const loginUser = async (loginData) => {
  try {
    const response = await api.post('/auth/login', loginData);
    toast.success('Login Successful!');
    return response.data; // { token, user } return korbe
  } catch (error) {
    console.error('Error logging in:', error.response?.data?.msg || error.message);
    toast.error(error.response?.data?.msg || 'Login failed');
    throw error;
  }
};

/**
 * Logged in user er profile data token er maddhome ber kore.
 * Server e '/api/auth/me' route ache, '/api/users/:uid' nei.
 */
export const getMyProfile = async () => {
  try {
    const response = await api.get('/auth/me');
    return response.data.user; // { user: {...} } return kore
  } catch (error) {
    console.error('Error fetching profile:', error.response?.data?.msg || error.message);
    // Token expire hole ba kono problem hole error debe
    throw error;
  }
};

// --- Partners Routes (Server er shathe match kora) ---

/**
 * Shob partners der list ber kore
 */
export const getPartners = async () => {
  try {
    const response = await api.get('/partners');
    // Server er response structure onujayi data access
    if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    }
    return []; // No data found
  } catch (error) {
    console.error('Error fetching partners:', error.response?.data?.msg || error.message);
    toast.error(error.response?.data?.msg || 'Failed to fetch partners');
    return [];
  }
};

/**
 * Notun partner profile toiri kore
 */
export const createPartner = async (partnerData) => {
  try {
    const response = await api.post('/partners', partnerData);
    toast.success('Partner profile created successfully!');
    return response.data; // { success: true, data: {...} } return korbe
  } catch (error) {
    console.error('Error creating partner:', error.response?.data?.msg || error.message);
    toast.error(error.response?.data?.msg || 'Failed to create partner profile');
    throw error;
  }
};

// --- NOTUN FUNCTION (START) ---
/**
 * Existing partner profile update kore
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
// --- NOTUN FUNCTION (END) ---

export const updateUserProfile = async (userData) => {
  try {
    // userData object-e name, password, bio, etc. thakte pare
    const response = await api.put('/auth/me', userData);
    
    toast.success(response.data.msg || 'Profile updated successfully!');
    return response.data.user; // updated user object return korbe
  } catch (error) {
    console.error('Error updating profile:', error.response?.data?.msg || error.message);
    toast.error(error.response?.data?.msg || 'Profile update failed');
    throw error;
  }
};

/**
 * Logged in user er profile MongoDB theke delete kore.
 * Server e '/api/auth/me' route e DELETE request pathay.
 */
export const deleteMyProfile = async () => {
  try {
    const response = await api.delete('/auth/me');
    return response.data; // { msg: 'User deleted' } return korbe
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
      return response.data.data; // Server 'data' object-er moddhe partner object-ti pathay
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

/**
 * Pathano request cancel kore
 */
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