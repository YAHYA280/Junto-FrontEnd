import { useState, useEffect, useCallback } from 'react';
import { dealsService, Deal } from '../services';

interface UseFetchDealsResult {
  deals: Deal[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  fetchMore: () => Promise<void>;
  hasMore: boolean;
}

export const useFetchDeals = (
  type: 'HOT' | 'TRANSPORT' | 'REAL_ESTATE' = 'HOT',
  pageSize: number = 20
): UseFetchDealsResult => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const fetchDeals = useCallback(
    async (reset: boolean = false) => {
      try {
        setLoading(true);
        setError(null);

        const skip = reset ? 0 : page * pageSize;
        const newDeals = await dealsService.listHotDeals(skip, pageSize);

        if (reset) {
          setDeals(newDeals);
          setPage(1);
        } else {
          setDeals((prev) => [...prev, ...newDeals]);
          setPage((prev) => prev + 1);
        }

        setHasMore(newDeals.length === pageSize);
      } catch (err) {
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    },
    [page, pageSize]
  );

  const refetch = useCallback(async () => {
    setPage(0);
    await fetchDeals(true);
  }, [fetchDeals]);

  const fetchMore = useCallback(async () => {
    if (!loading && hasMore) {
      await fetchDeals(false);
    }
  }, [loading, hasMore, fetchDeals]);

  useEffect(() => {
    fetchDeals(true);
  }, []);

  return {
    deals,
    loading,
    error,
    refetch,
    fetchMore,
    hasMore,
  };
};
