import apiClient from './config';
import {
  HotDeal,
  CreateHotDealInput,
  UpdateHotDealInput,
  ListDealsParams,
  ListDealsResponse,
} from '../../shared/types/deal';

// Deals API Service
export const dealsApi = {
  /**
   * List hot deals with pagination
   */
  listHotDeals: async (params?: ListDealsParams): Promise<ListDealsResponse> => {
    const response = await apiClient.get<ListDealsResponse>('/deals/hot', {
      params: {
        skip: params?.skip || 0,
        take: params?.take || 20,
      },
    });
    return response.data;
  },

  /**
   * Get a single hot deal by ID
   */
  getHotDeal: async (id: string): Promise<HotDeal> => {
    const response = await apiClient.get<{ deal: HotDeal }>(`/deals/hot/${id}`);
    return response.data.deal;
  },

  /**
   * Create a new hot deal (requires SELLER role)
   */
  createHotDeal: async (data: CreateHotDealInput): Promise<HotDeal> => {
    const response = await apiClient.post<{ deal: HotDeal }>('/deals/hot', data);
    return response.data.deal;
  },

  /**
   * Update a hot deal (requires SELLER role)
   */
  updateHotDeal: async (id: string, data: UpdateHotDealInput): Promise<HotDeal> => {
    const response = await apiClient.put<{ deal: HotDeal }>(`/deals/hot/${id}`, data);
    return response.data.deal;
  },

  /**
   * Delete a hot deal (requires SELLER role)
   */
  deleteHotDeal: async (id: string): Promise<void> => {
    await apiClient.delete(`/deals/hot/${id}`);
  },
};

export default dealsApi;
