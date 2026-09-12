import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Backend API base URL
// Easily configured via VITE_API_URL or defaults to port 5000
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Storage token key
export const TOKEN_STORAGE_KEY = 'wemezekr_auth_token';
export const USER_STORAGE_KEY = 'wemezekr_auth_user';

// Request interceptor: attach Authorization header if token exists
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export interface ApiErrorMessage {
  status?: number;
  message: string;
  isConnectionError?: boolean;
}

// Format friendly API errors
export function parseApiError(error: unknown): ApiErrorMessage {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string; error?: string }>;
    
    // Check network / unreachable connection
    if (axiosError.code === 'ERR_NETWORK' || !axiosError.response) {
      return {
        message: 'Unable to connect to the Wemezekr server. Please make sure the backend is running on port 5000.',
        isConnectionError: true,
      };
    }

    const status = axiosError.response?.status;
    const serverMessage = axiosError.response?.data?.message || axiosError.response?.data?.error;

    if (serverMessage) {
      return { status, message: serverMessage };
    }

    switch (status) {
      case 401:
        return { status, message: 'Your session has expired or authentication is required. Please log in again.' };
      case 403:
        return { status, message: 'Access forbidden: You do not have permission to perform this heritage administration action.' };
      case 404:
        return { status, message: 'The requested heritage record, manuscript, or resource was not found.' };
      case 500:
      default:
        return { status, message: 'Internal server error occurred on the Wemezekr backend. Please try again shortly.' };
    }
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: 'An unexpected error occurred while communicating with the Wemezekr registry.' };
}
