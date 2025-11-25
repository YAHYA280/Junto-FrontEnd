import api from './api';

export type DealType = 'HOT' | 'TRANSPORT' | 'REAL_ESTATE';
export type DealStatus = 'DRAFT' | 'ACTIVE' | 'EXPIRED' | 'REMOVED';

export interface Deal {
  id: string;
  type: DealType;
  status: DealStatus;
  sellerId: string;
  title: string;
  description?: string;
  currency: string;
  priceOriginal?: string;
  priceDeal?: string;
  quantityTotal: number;
  quantityLeft: number;
  startsAt: string;
  expiresAt: string;
  locationId?: number;
  externalLink?: string;
  attrs?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  hot?: HotDeal;
  transport?: TransportDeal;
  realEstate?: RealEstateDeal;
}

export interface HotDeal {
  dealId: string;
  merchantName?: string;
  redemptionNotes?: string;
}

export interface TransportDeal {
  dealId: string;
  tripDate: string;
  departTime: string;
  arrivalTime?: string;
  originPlaceId: number;
  destPlaceId: number;
  seatsTotal: number;
  seatsLeft: number;
  vehicleType: string;
  isCompany: boolean;
  driverVerified: boolean;
}

export interface RealEstateDeal {
  dealId: string;
  propertyType: string;
  rooms?: number;
  beds?: number;
  bathrooms?: string;
  sizeM2?: number;
  amenities: string[];
  availableFrom?: string;
  availableTo?: string;
}

export interface CreateHotDealData {
  title: string;
  description?: string;
  currency: string;
  priceOriginal?: string;
  priceDeal?: string;
  quantityTotal?: number;
  startsAt?: string;
  expiresAt?: string;
  locationId?: number;
  externalLink?: string;
  attrs?: Record<string, any>;
  hot?: {
    merchantName?: string;
    redemptionNotes?: string;
  };
}

export interface UpdateHotDealData extends Partial<CreateHotDealData> {}

export interface DealsListResponse {
  deals: Deal[];
}

export interface DealResponse {
  deal: Deal;
}

class DealsService {
  // Hot Deals
  async listHotDeals(skip: number = 0, take: number = 20): Promise<Deal[]> {
    try {
      const response = await api.get<DealsListResponse>('/deals/hot', {
        params: { skip, take },
      });
      return response.data.deals;
    } catch (error) {
      console.error('List hot deals error:', error);
      throw error;
    }
  }

  async getHotDeal(id: string): Promise<Deal> {
    try {
      const response = await api.get<DealResponse>(`/deals/hot/${id}`);
      return response.data.deal;
    } catch (error) {
      console.error('Get hot deal error:', error);
      throw error;
    }
  }

  async createHotDeal(data: CreateHotDealData): Promise<Deal> {
    try {
      const response = await api.post<DealResponse>('/deals/hot', data);
      return response.data.deal;
    } catch (error) {
      console.error('Create hot deal error:', error);
      throw error;
    }
  }

  async updateHotDeal(id: string, data: UpdateHotDealData): Promise<Deal> {
    try {
      const response = await api.put<DealResponse>(`/deals/hot/${id}`, data);
      return response.data.deal;
    } catch (error) {
      console.error('Update hot deal error:', error);
      throw error;
    }
  }

  async deleteHotDeal(id: string): Promise<void> {
    try {
      await api.delete(`/deals/hot/${id}`);
    } catch (error) {
      console.error('Delete hot deal error:', error);
      throw error;
    }
  }

  // Utility methods
  filterActiveDeals(deals: Deal[]): Deal[] {
    const now = new Date();
    return deals.filter(
      (deal) =>
        deal.status === 'ACTIVE' &&
        new Date(deal.expiresAt) > now &&
        deal.quantityLeft > 0
    );
  }

  sortByExpiry(deals: Deal[]): Deal[] {
    return [...deals].sort(
      (a, b) =>
        new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime()
    );
  }

  calculateDiscount(original: string, deal: string): number {
    const originalPrice = parseFloat(original);
    const dealPrice = parseFloat(deal);
    if (isNaN(originalPrice) || isNaN(dealPrice) || originalPrice === 0) {
      return 0;
    }
    return Math.round(((originalPrice - dealPrice) / originalPrice) * 100);
  }
}

export default new DealsService();
