import axios from 'axios';

// API Base URL - Using relative URL to leverage Next.js proxy
const API_BASE_URL = '/api'; // Empty string for relative paths

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use((config) => {
  // Only add token in browser environment
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('auth_token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  
  return config;
});

// Response interceptor for handling common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors like 401 Unauthorized
    if (error.response?.status === 401) {
      // Only redirect in browser environment
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_info');
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 