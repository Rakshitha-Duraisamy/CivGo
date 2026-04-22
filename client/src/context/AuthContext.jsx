/* eslint-disable */
import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import socket from '../services/socket';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
      
      // Connect socket if authenticated
      if (data.user) {
        socket.auth = { token: localStorage.getItem('civic_token') };
        socket.connect();
      }
    } catch (error) {
      setUser(null);
      localStorage.removeItem('civic_user');
      localStorage.removeItem('civic_token');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    
    return () => {
      socket.disconnect();
    };
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUser(data.user);
    localStorage.setItem('civic_user', JSON.stringify(data.user));
    localStorage.setItem('civic_token', data.token);
    
    socket.auth = { token: data.token };
    socket.connect();
    
    return data.user;
  };

  const register = async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    setUser(data.user);
    localStorage.setItem('civic_user', JSON.stringify(data.user));
    localStorage.setItem('civic_token', data.token);
    
    socket.auth = { token: data.token };
    socket.connect();
    
    return data.user;
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      localStorage.removeItem('civic_user');
      localStorage.removeItem('civic_token');
      socket.disconnect();
    }
  };

  const sendOtp = async (phone) => {
    const { data } = await api.post('/auth/send-otp', { phone });
    return data;
  };

  const verifyOtp = async (phone, otp) => {
    const { data } = await api.post('/auth/verify-otp', { phone, otp });
    setUser(data.user);
    localStorage.setItem('civic_user', JSON.stringify(data.user));
    localStorage.setItem('civic_token', data.token);
    
    socket.auth = { token: data.token };
    socket.connect();
    
    return data.user;
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, sendOtp, verifyOtp, loading, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

