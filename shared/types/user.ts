// User Roles from backend
export enum UserRole {
  BUYER = 'BUYER',
  SELLER = 'SELLER',
}

// User interface matching backend AppUser model
export interface User {
  id: string;
  email?: string;
  phoneE164?: string;
  displayName: string;
  avatarUrl?: string;
  ratingAvg?: number;
  ratingCount?: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  roles: UserRole[];
}

// Auth state
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Login credentials (email or phone + password)
export interface LoginCredentials {
  email?: string;
  phoneE164?: string;
  password: string;
}

// Register credentials
export interface RegisterCredentials {
  displayName: string;
  email?: string;
  phoneE164?: string;
  password: string;
}

// API Error response
export interface ApiError {
  message: string;
  statusCode?: number;
  errors?: Record<string, string[]>;
}
