import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserLoggedIn = async () => {
      try {
        const { data } = await api.get('/api/auth/profile');
        setUser(data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUserLoggedIn();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      setUser(data);
      toast.success('Logged in successfully');
      return data; // return user object for role-based redirect
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      return false;
    }
  };

  const register = async (name, email, password, extraData = {}) => {
    try {
      const { data } = await api.post('/api/auth/register', { name, email, password, ...extraData });
      setUser(data);
      toast.success('Registered successfully');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Registration failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
      setUser(null);
      toast.success('Logged out successfully');
    } catch {
      toast.error('Logout failed');
    }
  };

  const forgotPassword = async (email) => {
    try {
      const { data } = await api.post('/api/auth/forgot-password', { email });
      toast.success(data.message || 'Password reset link sent to your email');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to request password reset');
      return false;
    }
  };

  const resetPassword = async (token, password) => {
    try {
      const { data } = await api.post(`/api/auth/reset-password/${token}`, { password });
      toast.success(data.message || 'Password reset successfully');
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password');
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, forgotPassword, resetPassword, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
