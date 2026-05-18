import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true,
});

// Interceptor to inject Authorization Bearer Token from Zustand Auth Store
api.interceptors.request.use((config) => {
  try {
    const rawAuth = localStorage.getItem('vexo-super-admin-auth');
    if (rawAuth) {
      const parsed = JSON.parse(rawAuth);
      const token = parsed?.state?.accessToken;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
  } catch (error) {
    console.error('Request interceptor auth error:', error);
  }
  return config;
});

export default api;
