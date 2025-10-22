import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { getSession, signOut } from 'next-auth/react';

// API Response types
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  success: boolean;
  pagination?: {
    totalUsers?: number;
    currentPage?: number;
    totalPages?: number;
    pageSize?: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
    // Legacy fields for backward compatibility
    page?: number;
    limit?: number;
    total?: number;
  };
}

export interface ApiError {
  message: string;
  status: number;
  errors?: Record<string, string[]>;
}

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add authentication token
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const session = await getSession();
      
      // Check for accessToken in session
      const sessionWithToken = session as { accessToken?: string };
      if (sessionWithToken?.accessToken) {
        config.headers.set('Authorization', `Bearer ${sessionWithToken.accessToken}`);
      }
      // Add request timestamp for debugging
      (config as unknown as Record<string, unknown>).metadata = { startTime: new Date() };
      
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return config;
    }
  },
  (error: AxiosError) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log response time for debugging
    const endTime = new Date();
    const configWithMetadata = response.config as unknown as Record<string, unknown>;
    const startTime = configWithMetadata.metadata as { startTime: Date } | undefined;
    if (startTime?.startTime) {
      const duration = endTime.getTime() - startTime.startTime.getTime();
      console.log(`API Request to ${response.config.url} took ${duration}ms`);
    }
    
    // Response logged for debugging if needed
    
    return response;
  },
  async (error: AxiosError) => {
    console.error('API Error:', error.response?.status, error.config?.url);
    console.error('Error details:', error.response?.data);
    console.error('Error message:', error.message);
    
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Handle 401 Unauthorized - token expired or invalid
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Only attempt sign out if we're in a browser environment
        if (typeof window !== 'undefined') {
          console.log('Token expired, signing out user...');
          await signOut({ redirect: false });
          
          // Redirect to login page
          window.location.href = '/auth/login';
        }
        
        return Promise.reject(error);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        
        // Only attempt sign out if we're in a browser environment
        if (typeof window !== 'undefined') {
          await signOut({ redirect: false });
          window.location.href = '/auth/login';
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    // Handle 403 Forbidden - insufficient permissions
    if (error.response?.status === 403) {
      console.error('Access forbidden - insufficient permissions');
      // You might want to show a toast notification here
    }
    
    // Handle 500 Internal Server Error
    if (error.response && error.response.status >= 500) {
      console.error('Server error:', error.response.data);
      // You might want to show a toast notification here
    }
    
    // Handle network errors
    if (!error.response) {
      console.error('Network error:', error.message);
      // You might want to show a toast notification here
    }
    
    return Promise.reject(error);
  }
);

// API Client methods
export const api = {
  // GET request
  get: async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await apiClient.get<ApiResponse<T>>(url, config);
    return response.data;
  },

  // POST request
  post: async <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await apiClient.post<ApiResponse<T>>(url, data, config);
    return response.data;
  },

  // PUT request
  put: async <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await apiClient.put<ApiResponse<T>>(url, data, config);
    return response.data;
  },

  // PATCH request
  patch: async <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await apiClient.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  },

  // DELETE request
  delete: async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const response = await apiClient.delete<ApiResponse<T>>(url, config);
    return response.data;
  },

  // Upload file
  upload: async <T = unknown>(url: string, file: File, config?: AxiosRequestConfig): Promise<ApiResponse<T>> => {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await apiClient.post<ApiResponse<T>>(url, formData, {
      ...config,
      headers: {
        ...config?.headers,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Download file
  download: async (url: string, filename?: string, config?: AxiosRequestConfig): Promise<void> => {
    const response = await apiClient.get(url, {
      ...config,
      responseType: 'blob',
    });
    
    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  },
};

// Export the axios instance for advanced usage
export { apiClient };

// Export default
export default api;
