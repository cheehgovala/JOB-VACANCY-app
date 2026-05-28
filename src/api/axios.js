import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Global slow-request event — fires if any request takes > 3 seconds
// Components can listen to 'api:slow' on window to show a loading banner
let slowTimer = null;
let activeRequests = 0;

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('talent_mw_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    activeRequests++;
    // If no response within 3s, dispatch a slow event
    if (!slowTimer) {
      slowTimer = setTimeout(() => {
        window.dispatchEvent(new CustomEvent('api:slow', { detail: { slow: true } }));
      }, 3000);
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    activeRequests = Math.max(0, activeRequests - 1);
    if (activeRequests === 0) {
      clearTimeout(slowTimer);
      slowTimer = null;
      window.dispatchEvent(new CustomEvent('api:slow', { detail: { slow: false } }));
    }
    return response;
  },
  (error) => {
    activeRequests = Math.max(0, activeRequests - 1);
    if (activeRequests === 0) {
      clearTimeout(slowTimer);
      slowTimer = null;
      window.dispatchEvent(new CustomEvent('api:slow', { detail: { slow: false } }));
    }
    if (error.response && error.response.status === 401) {
      // Optional: Auto-logout on token expiration
    }
    return Promise.reject(error);
  }
);

export default api;
