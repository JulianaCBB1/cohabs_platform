import { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';

export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(
    async (isCancelled: () => boolean) => {
      setLoading(true);
      setError(null);

      try {
        const res = await api.get<T>(url);
        if (!isCancelled()) {
          setData(res.data);
        }
      } catch (err: any) {
        if (!isCancelled()) {
          setError(err.response?.data?.error || 'Error fetching data');
        }
      } finally {
        if (!isCancelled()) {
          setLoading(false);
        }
      }
    },
    [url]
  );

  useEffect(() => {
    let isCancelled = false;

    fetchData(() => isCancelled);

    return () => {
      isCancelled = true;
    };
  }, [url]);

  const refetch = useCallback(() => fetchData(() => false), [fetchData]);

  return { data, loading, error, refetch };
}
