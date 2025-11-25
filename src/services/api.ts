import axios, { AxiosInstance, AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
// API Configuration
const API_BASE_URL = "http://localhost:4000"; // Change to your backend URL

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Important for cookie-based auth
});

// Request interceptor for adding auth tokens
api.interceptors.request.use(
  async (config) => {
    // If you need to add any custom headers, do it here
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    // Handle 401 Unauthorized - try to refresh token
    if (error.response?.status === 401) {
      try {
        // Try to refresh the token
        await api.post("/auth/refresh");

        // Retry the original request
        if (error.config) {
          return api.request(error.config);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        // You can emit an event here or use navigation
        console.log("Session expired, please login again");
      }
    }

    return Promise.reject(error);
  }
);

export default api;
export { API_BASE_URL };
