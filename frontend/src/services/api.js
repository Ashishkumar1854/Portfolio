import axios from 'axios';

const getBaseURL = () => {
  const configuredUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5002';

  if (typeof window === 'undefined') {
    return configuredUrl;
  }

  try {
    const apiUrl = new URL(configuredUrl);
    const pageHost = window.location.hostname;
    const apiHostIsLocal = apiUrl.hostname === 'localhost' || apiUrl.hostname === '127.0.0.1';
    const pageHostIsLocal = pageHost === 'localhost' || pageHost === '127.0.0.1';

    if (apiHostIsLocal && !pageHostIsLocal) {
      apiUrl.hostname = pageHost;
      return apiUrl.toString().replace(/\/$/, '');
    }
  } catch (error) {
    return configuredUrl;
  }

  return configuredUrl;
};

const api = axios.create({
  baseURL: getBaseURL(),
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
