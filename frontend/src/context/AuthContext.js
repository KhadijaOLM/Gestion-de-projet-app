
//frontend/src/context/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import axios from '../utils/axiosConfig';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        // Configuration du header Authorization pour la requête
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get('/api/users/me');
        setUser(response.data);
        setIsAuthenticated(true);
      } catch (err) {
        handleAuthError(err);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, [token]);

  const handleAuthError = (err) => {
    localStorage.removeItem('token');
    setToken(null);
    setError(err.response?.data?.message || 'Erreur d\'authentification');
  };

  const login = async (credentials) => {
    setLoading(true);
    setError(null);
  
    try {
      const responseData = await axios.post('/api/auth/login', {
        email: credentials.email.trim(),
        password: credentials.password
      });

      localStorage.setItem('token', responseData.data.token);

      localStorage.setItem('token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setToken(token);
      setUser(user);
      setIsAuthenticated(true);
  
      return user;
    } catch (err) {
        const errorMessage = err.response?.data?.message || 'Échec de la connexion';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
  };
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post('/api/auth/register', userData);
      const { token: newToken, user } = response.data;
      
      localStorage.setItem('token', newToken);
      setToken(newToken); 
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      setUser(user);
      setIsAuthenticated(true);
      return user;
    } catch (err) {
      setError(err.response?.data?.message || 'Échec de l\'inscription');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUserProfile = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.put('/api/users/profile', userData);
      setUser(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || 'Échec de la mise à jour du profil');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        error,
        token, 
        login,
        register,
        logout,
        updateUserProfile,
        setError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
