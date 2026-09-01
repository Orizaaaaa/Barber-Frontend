import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://barber-ten-teal.vercel.app/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    // Normalize error message from backend
    const data = error.response?.data;
    if (data) {
      // Handle validation errors array
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        const messages = data.errors.map((e: { msg?: string; message?: string }) => e.msg || e.message || 'Validation error');
        error.displayMessage = messages.join(', ');
      } else if (data.message) {
        error.displayMessage = data.message;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
