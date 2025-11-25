import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Deal, dealsService } from '../services';
import { DealCategory } from '../components';

interface DealsContextType {
  deals: Deal[];
  loading: boolean;
  error: Error | null;
  activeCategory: DealCategory;
  setActiveCategory: (category: DealCategory) => void;
  fetchDeals: (category?: DealCategory) => Promise<void>;
  refreshDeals: () => Promise<void>;
  filteredDeals: Deal[];
}

const DealsContext = createContext<DealsContextType | undefined>(undefined);

export const useDeals = () => {
  const context = useContext(DealsContext);
  if (!context) {
    throw new Error('useDeals must be used within DealsProvider');
  }
  return context;
};

interface DealsProviderProps {
  children: ReactNode;
}

export const DealsProvider: React.FC<DealsProviderProps> = ({ children }) => {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [activeCategory, setActiveCategory] = useState<DealCategory>('HOT');

  const fetchDeals = useCallback(async (category: DealCategory = activeCategory) => {
    try {
      setLoading(true);
      setError(null);

      // For now, only HOT deals are implemented in backend
      if (category === 'HOT') {
        const fetchedDeals = await dealsService.listHotDeals(0, 50);
        setDeals(fetchedDeals);
      } else {
        // Transport and Real Estate not yet implemented in backend
        setDeals([]);
      }
    } catch (err) {
      setError(err as Error);
      console.error('Fetch deals error:', err);
    } finally {
      setLoading(false);
    }
  }, [activeCategory]);

  const refreshDeals = useCallback(async () => {
    await fetchDeals(activeCategory);
  }, [activeCategory, fetchDeals]);

  const handleCategoryChange = useCallback((category: DealCategory) => {
    setActiveCategory(category);
    fetchDeals(category);
  }, [fetchDeals]);

  // Filter deals by active status and not expired
  const filteredDeals = deals.filter((deal) => {
    const isActive = deal.status === 'ACTIVE';
    const notExpired = new Date(deal.expiresAt) > new Date();
    const hasStock = deal.quantityLeft > 0;
    return isActive && notExpired && hasStock;
  });

  const value: DealsContextType = {
    deals: filteredDeals,
    loading,
    error,
    activeCategory,
    setActiveCategory: handleCategoryChange,
    fetchDeals,
    refreshDeals,
    filteredDeals,
  };

  return <DealsContext.Provider value={value}>{children}</DealsContext.Provider>;
};
