
//frontend/src/hooks/useHttpClient.js
import { useState, useCallback } from 'react';
import axiosInstance from '../utils/axiosConfig';
import { toast } from 'react-toastify';

export const useHttpClient = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(
    async (url, method = 'GET', data = null, headers = {}) => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axiosInstance({
          method,
          url,
          data,
          headers,
        });
        
        setLoading(false);
        return response.data;
      } catch (err) {
        setLoading(false);
        const errorMessage = 
          err.response?.data?.message || err.messge || 'Something went wrong, please try again.';
        setError(errorMessage);
        toast.error(errorMessage);
        throw new Error(errorMessage);
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  return { loading, error, sendRequest, clearError };
};
