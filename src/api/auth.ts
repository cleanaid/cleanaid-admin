import { apiClient } from './api-client';

interface ApiError {
  code?: string;
  message?: string;
  response?: {
    status: number;
    data?: {
      message?: string;
    };
  };
}

export interface LoginCredentials {
  emailAddress: string;
  password: string;
}

export interface SignupCredentials {
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    userId: string;
    fullName: string;
    emailAddress: string;
    role: string;
  };
}

export interface SignupResponse {
  message: string;
  token: string;
  user: {
    userId: string;
    fullName: string;
    emailAddress: string;
    phoneNumber: string;
    role: string;
  };
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: string;
  accessToken: string;
}

/**
 * Authenticate admin user with backend API
 */
export async function authenticateAdmin(credentials: LoginCredentials): Promise<AdminUser | null> {
  try {
    const response = await apiClient.post<LoginResponse>('/admin/auth/login', {
      emailAddress: credentials.emailAddress,
      password: credentials.password
    });

    if (response.data.token && response.data.user) {
      const { token, user } = response.data;
      
      return {
        id: user.userId,
        email: user.emailAddress,
        name: user.fullName,
        role: user.role,
        accessToken: token
      };
    }

    return null;
  } catch (error: unknown) {
    console.error('Admin authentication error:', error);
    
    const apiError = error as ApiError;
    
    // Handle connection refused error - API server not running
    if (apiError?.code === 'ECONNREFUSED' || apiError?.message?.includes('ECONNREFUSED')) {
      console.error('API server is not running. Please start the backend API server.');
      throw new Error('API server is not available. Please check if the backend server is running.');
    }
    
    // Handle network errors
    if (apiError?.message?.includes('Network Error') || !apiError?.response) {
      throw new Error('Network error. Please check your internet connection and API server status.');
    }
    
    // Handle authentication errors
    if (apiError?.response?.status === 401) {
      throw new Error('Invalid credentials. Please check your email and password.');
    }
    
    // Handle other API errors
    if (apiError?.response?.status && apiError.response.status >= 400) {
      throw new Error(`Authentication failed: ${apiError?.response?.data?.message || 'Unknown error'}`);
    }
    
    throw new Error('Authentication failed. Please try again.');
  }
}


/**
 * Get admin profile from backend
 */
export async function getAdminProfile(): Promise<AdminUser | null> {
  try {
    const response = await apiClient.get<{
      success: boolean;
      data?: {
        id: string;
        emailAddress: string;
        name: string;
        role: string;
      };
    }>('/admin/auth/profile');

    if (response.data.success && response.data.data) {
      const user = response.data.data;
      return {
        id: user.id,
        email: user.emailAddress,
        name: user.name,
        role: user.role,
        accessToken: '' // Profile endpoint doesn't return token
      };
    }

    return null;
  } catch (error) {
    console.error('Get admin profile error:', error);
    return null;
  }
}

/**
 * Signup admin user with backend API
 */
export async function signupAdmin(credentials: SignupCredentials): Promise<AdminUser | null> {
  try {
    const response = await apiClient.post<SignupResponse>('/admin/auth/signup', {
      fullName: credentials.fullName,
      emailAddress: credentials.emailAddress,
      phoneNumber: credentials.phoneNumber,
      password: credentials.password
    });

    if (response.data.token && response.data.user) {
      const { token, user } = response.data;
      
      return {
        id: user.userId,
        email: user.emailAddress,
        name: user.fullName,
        role: user.role,
        accessToken: token
      };
    }

    return null;
  } catch (error) {
    console.error('Admin signup error:', error);
    return null;
  }
}

/**
 * Logout admin user
 */
export async function logoutAdmin(): Promise<boolean> {
  try {
    const response = await apiClient.post<{ success: boolean }>('/admin/auth/logout');
    return response.data.success;
  } catch (error) {
    console.error('Admin logout error:', error);
    return false;
  }
}
