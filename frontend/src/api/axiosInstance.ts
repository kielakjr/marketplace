import axios from 'axios';
import { store } from '../store';
import { logoutThunk } from '../store/slices/authSlice';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  xsrfCookieName: 'marketplace_csrf',
  xsrfHeaderName: 'X-CSRF-Token',
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
