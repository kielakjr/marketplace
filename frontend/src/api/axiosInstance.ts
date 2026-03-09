import axios from 'axios';
import { store } from '../store';
import { logoutThunk } from '../store/slices/authSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}` : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (window.location.pathname !== '/login') {
        store.dispatch(logoutThunk());
      }
    }
    return Promise.reject(error);
  }
);

export default api;
