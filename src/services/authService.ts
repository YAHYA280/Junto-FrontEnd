import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface RegisterData {
  displayName: string;
  email?: string;
  phoneE164?: string;
  password: string;
}

export interface LoginData {
  email?: string;
  phoneE164?: string;
  password: string;
}

export interface User {
  id: string;
  displayName: string;
  email?: string;
  phoneE164?: string;
  avatarUrl?: string;
  ratingAvg: string;
  ratingCount: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
}

export interface MeResponse {
  userId: string;
  roles: string[];
}

class AuthService {
  private readonly AUTH_STORAGE_KEY = '@nextrip_auth';

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', data);
      return response.data;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  async login(data: LoginData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', data);
      // Store user info locally
      await this.storeUserLocally(response.data.user);
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await api.post('/auth/logout');
      await this.clearUserLocally();
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local data even if API call fails
      await this.clearUserLocally();
      throw error;
    }
  }

  async me(): Promise<MeResponse> {
    try {
      const response = await api.get<MeResponse>('/auth/me');
      return response.data;
    } catch (error) {
      console.error('Me error:', error);
      throw error;
    }
  }

  async addRole(role: 'BUYER' | 'SELLER'): Promise<void> {
    try {
      await api.post('/auth/role', { role });
    } catch (error) {
      console.error('Add role error:', error);
      throw error;
    }
  }

  async refresh(): Promise<void> {
    try {
      await api.post('/auth/refresh');
    } catch (error) {
      console.error('Refresh error:', error);
      throw error;
    }
  }

  // Local storage helpers
  private async storeUserLocally(user: User): Promise<void> {
    try {
      await AsyncStorage.setItem(this.AUTH_STORAGE_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Store user error:', error);
    }
  }

  async getUserLocally(): Promise<User | null> {
    try {
      const userJson = await AsyncStorage.getItem(this.AUTH_STORAGE_KEY);
      return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
      console.error('Get user error:', error);
      return null;
    }
  }

  private async clearUserLocally(): Promise<void> {
    try {
      await AsyncStorage.removeItem(this.AUTH_STORAGE_KEY);
    } catch (error) {
      console.error('Clear user error:', error);
    }
  }
}

export default new AuthService();
