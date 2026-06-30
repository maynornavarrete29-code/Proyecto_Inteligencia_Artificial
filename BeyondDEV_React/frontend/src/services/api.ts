/**
 * API Service - Axios instance and API calls
 */
import axios from 'axios';
import { TokenResponse, User, FaceDescriptor } from '@/types';

const API_BASE = 'http://localhost:8000/api';
const TOKEN_KEY = 'beyonddev_token';
const USER_KEY = 'beyonddev_user';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  register: async (name: string, email: string, password: string) => {
    const response = await apiClient.post<TokenResponse>('/auth/register', {
      name,
      email,
      password,
    });
    if (response.data.access_token) {
      localStorage.setItem(TOKEN_KEY, response.data.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    }
    return response.data;
  },

  login: async (email: string, password: string) => {
    const response = await apiClient.post<TokenResponse>('/auth/login', {
      email,
      password,
    });
    if (response.data.access_token) {
      localStorage.setItem(TOKEN_KEY, response.data.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    }
    return response.data;
  },

  verify: async (email: string, token: string) => {
    const response = await apiClient.get<TokenResponse>(
      `/auth/verify?email=${encodeURIComponent(email)}&token=${token}`
    );
    if (response.data.access_token) {
      localStorage.setItem(TOKEN_KEY, response.data.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.data.user));
    }
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  isAuthenticated: () => !!localStorage.getItem(TOKEN_KEY),

  getToken: () => localStorage.getItem(TOKEN_KEY),

  getStoredUser: () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  },
};

export const faceIDService = {
  checkEmail: async (email: string) => {
    const response = await apiClient.post('/faceid/check-email', { email });
    return response.data;
  },

  register: async (email: string, descriptors: FaceDescriptor[]) => {
    const response = await apiClient.post('/faceid/register', {
      email,
      descriptors,
    });
    return response.data;
  },

  verify: async (email: string, descriptor: number[]) => {
    const response = await apiClient.post('/faceid/verify', {
      email,
      descriptor,
    });
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/faceid/profile');
    return response.data;
  },

  deleteProfile: async () => {
    const response = await apiClient.delete('/faceid/profile');
    return response.data;
  },
};

export const emailService = {
  getEmails: async () => {
    const response = await apiClient.get('/emails');
    return response.data;
  },

  clearEmails: async () => {
    const response = await apiClient.delete('/emails');
    return response.data;
  },
};

export default apiClient;
