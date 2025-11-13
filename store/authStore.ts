import { create } from 'zustand';
import {
  AuthState,
  LoginCredentials,
  RegisterCredentials,
  User,
  UserRole,
} from '../shared/types/user';
import authApi from '../services/api/auth.api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from '../services/api/config';

interface AuthStore extends AuthState {
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  addRole: (role: UserRole) => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  /**
   * Login user with email/phone and password
   */
  login: async (credentials: LoginCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.login(credentials);

      // Get user details with roles
      const meResponse = await authApi.me();

      const user: User = {
        id: response.user.id,
        displayName: response.user.displayName,
        email: response.user.email,
        phoneE164: response.user.phoneE164,
        avatarUrl: response.user.avatarUrl,
        isVerified: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        roles: meResponse.roles as UserRole[],
      };

      set({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Login failed. Please try again.';

      set({
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
        user: null,
      });

      throw new Error(errorMessage);
    }
  },

  /**
   * Register new user
   */
  register: async (credentials: RegisterCredentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authApi.register(credentials);

      // After registration, login to get tokens
      await get().login({
        email: credentials.email,
        phoneE164: credentials.phoneE164,
        password: credentials.password,
      });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Registration failed. Please try again.';

      set({
        isLoading: false,
        error: errorMessage,
      });

      throw new Error(errorMessage);
    }
  },

  /**
   * Logout user
   */
  logout: async () => {
    set({ isLoading: true });
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  /**
   * Refresh user data from backend
   */
  refreshUser: async () => {
    try {
      const meResponse = await authApi.me();

      const currentUser = get().user;
      if (currentUser) {
        set({
          user: {
            ...currentUser,
            roles: meResponse.roles as UserRole[],
          },
        });
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // If refresh fails, might be unauthorized
      set({
        user: null,
        isAuthenticated: false,
      });
    }
  },

  /**
   * Add role to user (BUYER or SELLER)
   */
  addRole: async (role: UserRole) => {
    set({ isLoading: true, error: null });
    try {
      await authApi.addRole({ role });
      await get().refreshUser();

      set({ isLoading: false });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to add role.';

      set({
        isLoading: false,
        error: errorMessage,
      });

      throw new Error(errorMessage);
    }
  },

  /**
   * Check authentication status on app startup
   */
  checkAuth: async () => {
    try {
      const isAuth = await authApi.isAuthenticated();

      if (isAuth) {
        // Try to get user info
        try {
          const meResponse = await authApi.me();

          set({
            isAuthenticated: true,
            user: {
              id: meResponse.userId,
              displayName: 'User', // We don't have displayName from /me endpoint
              isVerified: false,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              roles: meResponse.roles as UserRole[],
            },
          });
        } catch (error) {
          // Token invalid, clear auth
          set({
            isAuthenticated: false,
            user: null,
          });
        }
      } else {
        set({
          isAuthenticated: false,
          user: null,
        });
      }
    } catch (error) {
      console.error('Auth check error:', error);
      set({
        isAuthenticated: false,
        user: null,
      });
    }
  },

  /**
   * Clear error message
   */
  clearError: () => {
    set({ error: null });
  },
}));
