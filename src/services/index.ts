export { default as api } from './api';
export { default as authService } from './authService';
export { default as dealsService } from './dealsService';

export type { RegisterData, LoginData, User, AuthResponse, MeResponse } from './authService';
export type {
  Deal,
  DealType,
  DealStatus,
  HotDeal,
  TransportDeal,
  RealEstateDeal,
  CreateHotDealData,
  UpdateHotDealData,
} from './dealsService';
