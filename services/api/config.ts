import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Get configuration from expo constants (loaded from .env via app.config.js)
const expoConfig = Constants.expoConfig?.extra || {};

// API Configuration
export const API_CONFIG = {
  BASE_URL: expoConfig.apiBaseUrl || 'http://localhost:4000',
  TIMEOUT: expoConfig.apiTimeout || 30000,
  COOKIE_NAMES: {
    ACCESS_TOKEN: expoConfig.cookieNameAccess || 'jg_at',
    REFRESH_TOKEN: expoConfig.cookieNameRefresh || 'jg_rt',
  },
};

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies
});

// Request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    // Get access token from storage
    const accessToken = await AsyncStorage.getItem(API_CONFIG.COOKIE_NAMES.ACCESS_TOKEN);

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh
apiClient.interceptors.response.use(
  (response) => {
    // Store tokens if present in response
    const accessToken = response.headers['x-access-token'];
    const refreshToken = response.headers['x-refresh-token'];

    if (accessToken) {
      AsyncStorage.setItem(API_CONFIG.COOKIE_NAMES.ACCESS_TOKEN, accessToken);
    }

    if (refreshToken) {
      AsyncStorage.setItem(API_CONFIG.COOKIE_NAMES.REFRESH_TOKEN, refreshToken);
    }

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Try to refresh the token
        const refreshToken = await AsyncStorage.getItem(API_CONFIG.COOKIE_NAMES.REFRESH_TOKEN);

        if (refreshToken) {
          const response = await axios.post(
            `${API_CONFIG.BASE_URL}/auth/refresh`,
            {},
            {
              headers: {
                Authorization: `Bearer ${refreshToken}`,
              },
            }
          );

          const newAccessToken = response.headers['x-access-token'];

          if (newAccessToken) {
            await AsyncStorage.setItem(API_CONFIG.COOKIE_NAMES.ACCESS_TOKEN, newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        // Refresh failed, clear tokens
        await AsyncStorage.multiRemove([
          API_CONFIG.COOKIE_NAMES.ACCESS_TOKEN,
          API_CONFIG.COOKIE_NAMES.REFRESH_TOKEN,
        ]);

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
