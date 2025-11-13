// Hot Deal Types matching backend schema

export interface HotDeal {
  id: string;
  title: string;
  description?: string;
  currency: string;
  priceOriginal?: string;
  priceDeal?: string;
  quantityTotal: number;
  quantitySold?: number;
  startsAt?: string;
  expiresAt?: string;
  locationId?: number;
  externalLink?: string;
  attrs?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
  sellerId: string;
  seller?: {
    id: string;
    displayName: string;
    avatarUrl?: string;
  };
  hot?: {
    merchantName?: string;
    redemptionNotes?: string;
  };
}

export interface CreateHotDealInput {
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

export interface UpdateHotDealInput extends Partial<CreateHotDealInput> {}

export interface ListDealsParams {
  skip?: number;
  take?: number;
}

export interface ListDealsResponse {
  deals: HotDeal[];
  total?: number;
  hasMore?: boolean;
}
