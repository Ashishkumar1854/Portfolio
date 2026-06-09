import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
