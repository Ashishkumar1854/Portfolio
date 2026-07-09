import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const useApi = (url, initialData = null) => {
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(url);
      // Handle paginated or direct array responses
      setData(response.data.data !== undefined ? response.data.data : response.data);
      setError(null);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'An error occurred';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refresh().catch(() => {});
  }, [refresh]);

  return { data, loading, error, refresh };
};

export default useApi;
