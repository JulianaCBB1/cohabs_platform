import { useState, useEffect } from 'react';
import api from '../api/axios';

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    async function fetchData() {
      try {
        const res = await api.get<T>(url);
        if (!cancelled) setData(res.data);
      } catch (error: any) {
        if (!cancelled)
          setError(error.response?.data?.error || 'Error fetching data');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchData();

    return () => {
      cancelled = true;
    };
  }, [url]);

  return { data, loading, error };
}
