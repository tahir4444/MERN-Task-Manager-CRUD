import axios from 'axios';
import { API_BASE_URL } from '../config';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', {
      email,
      password
    });
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const getMe = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get('/auth/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Get me error:', error);
    throw error;
  }
};

export const logout = async () => {
  try {
    const token = localStorage.getItem('token');
    await api.post('/auth/logout', {}, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post('/auth/reset-password', {
      token,
      newPassword
    });
    return response.data;
  } catch (error) {
    console.error('Reset password error:', error);
    throw error;
  }
};

const authService = {
  login,
  register,
  getMe,
  logout,
  resetPassword
};

export default authService;