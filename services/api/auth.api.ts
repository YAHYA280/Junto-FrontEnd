import apiClient from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_CONFIG } from './config';

// Request/Response Types
export interface RegisterRequest {
  displayName: string;
  email?: string;
  phoneE164?: string;
  password: string;
}

export interface LoginRequest {
  email?: string;
  phoneE164?: string;
  password: string;
}

export interface RegisterResponse {
  user: {
    id: string;
    displayName: string;
    email?: string;
    phoneE164?: string;
  };
}

export interface LoginResponse {
  user: {
    id: string;
    displayName: string;
    email?: string;
    phoneE164?: string;
    avatarUrl?: string;
  };
}

export interface MeResponse {
  userId: string;
  roles: string[];
}

export interface AddRoleRequest {
  role: 'BUYER' | 'SELLER';
}

export interface UpdateProfileRequest {
  displayName?: string;
  email?: string;
  phoneE164?: string;
  avatarUrl?: string;
}

export interface UpdateProfileResponse {
  user: {
    id: string;
    displayName: string;
    email?: string;
    phoneE164?: string;
    avatarUrl?: string;
  };
}

// Auth API Service
export const authApi = {
  /**
   * Register a new user
   */
  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await apiClient.post<RegisterResponse>('/auth/register', data);

    // Store tokens from response headers or cookies
    const accessToken = response.headers['set-cookie']?.find((c: string) =>
      c.includes(API_CONFIG.COOKIE_NAMES.ACCESS_TOKEN)
    );
    const refreshToken = response.headers['set-cookie']?.find((c: string) =>
      c.includes(API_CONFIG.COOKIE_NAMES.REFRESH_TOKEN)
    );

    // Since we're in React Native, we'll manage tokens manually
    // Backend sends cookies but we'll extract and store them
    if (response.data) {
      // For mobile, we'll trigger a login after successful registration
      // to get the tokens properly
      const loginResponse = await authApi.login({
        email: data.email,
        phoneE164: data.phoneE164,
        password: data.password,
      });

      return response.data;
    }

    return response.data;
  },

  /**
   * Login user
   */
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);

    // Note: In a real mobile app with cookie-based backend,
    // you might need to handle cookies differently
    // For now, we're assuming the backend will send tokens in headers
    // or you'll need to modify the backend to send tokens in response body for mobile

    return response.data;
  },

  /**
   * Get current user information
   */
  me: async (): Promise<MeResponse> => {
    const response = await apiClient.get<MeResponse>('/auth/me');
    return response.data;
  },

  /**
   * Refresh access token
   */
  refresh: async (): Promise<void> => {
    await apiClient.post('/auth/refresh');
  },

  /**
   * Logout user
   */
  logout: async (): Promise<void> => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      // Even if logout fails on server, clear local tokens
      console.error('Logout error:', error);
    } finally {
      // Clear local tokens
      await AsyncStorage.multiRemove([
        API_CONFIG.COOKIE_NAMES.ACCESS_TOKEN,
        API_CONFIG.COOKIE_NAMES.REFRESH_TOKEN,
      ]);
    }
  },

  /**
   * Add role to user
   */
  addRole: async (data: AddRoleRequest): Promise<void> => {
    await apiClient.post('/auth/role', data);
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: UpdateProfileRequest): Promise<UpdateProfileResponse> => {
    const response = await apiClient.put<UpdateProfileResponse>('/users/profile', data);
    return response.data;
  },

  /**
   * Check if user is authenticated by verifying token
   */
  isAuthenticated: async (): Promise<boolean> => {
    const accessToken = await AsyncStorage.getItem(API_CONFIG.COOKIE_NAMES.ACCESS_TOKEN);
    return !!accessToken;
  },
};

export default authApi;
