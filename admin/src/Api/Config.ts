import type { AxiosInstance, AxiosResponse } from 'axios';
import axios from 'axios';

// Configuration Utility for Admin API
interface AdminApiConfig {
  baseURL: string;
  isProduction: boolean;
}

// Get API Configuration for Admin
const getAdminApiConfig = (): AdminApiConfig => {
  const apiUrl = import.meta.env.VITE_API_URL;

  if (!apiUrl) {
    throw new Error('API_URL is not defined in .env file');
  }

  const isProduction =
    import.meta.env.VITE_APP_ENV === 'production' ||
    import.meta.env.PROD === true;
  return {
    baseURL: `${apiUrl}/api`,
    isProduction,
  };
};

// Create and Export the Configure Axios Instance
const createApiInstance = (): AxiosInstance => {
  // const { baseURL } = getAdminApiConfig();
  const instance = axios.create({
    baseURL: getAdminApiConfig().baseURL,
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true,
    timeout: 90000, // 90 seconds
  });

  // Add Request Interceptors to include Auth Token
  instance.interceptors.request.use(
    (config) => {
      // Get Token from Local Storage ( zustand Persist Stores if There)
      const authData = localStorage.getItem('auth-storage');
      if (authData) {
        try {
          const parsedData = JSON.parse(authData);
          const token = parsedData.state?.token;
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error('Error parsing auth data:', error);
          throw error;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  // Add Response Interceptors to Better Handle Errors
  instance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    (error) => {
      if (error.code === 'ERR_NETWORK') {
        console.error(
          'Network Error: Unable to Connect to the Server, Please Check if the Server is Running',
          error,
        );
      }

      // Handle 401 Unauthorized Error
      if (error.response?.status === 401) {
        // Clear Auth Data and Redirect to Login Page
        localStorage.removeItem('auth-storage');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    },
  );

  return instance;
};

// Add Response Interceptors to Better Error Handling

// Admin API Endpoints
const ADMIN_API_ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',

  // Users

  // Products
  // Categories
} as const;

// Helper Function to Build Query Parameters
const buildAdminQueryParams = (
  params: Record<string, string | number | boolean | undefined>,
): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      searchParams.append(key, String(value));
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `?${queryString}` : '';
};

export {
  ADMIN_API_ENDPOINTS,
  buildAdminQueryParams,
  createApiInstance,
  getAdminApiConfig,
};
