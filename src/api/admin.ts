import { api, apiClient, ApiResponse } from './api-client';
import { User } from '@/types/user';
import { Business } from '@/types/business';
import { Payment } from '@/types/payment';
import { Order } from '@/types/order';
import { authenticateAdmin, getAdminProfile, logoutAdmin, signupAdmin } from './auth';

// Query parameters for pagination and filtering
export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface UserFilters extends PaginationParams {
  status?: 'active' | 'inactive' | 'suspended';
  role?: 'user' | 'admin' | 'business_owner';
  dateFrom?: string;
  dateTo?: string;
}

export interface BusinessFilters extends PaginationParams {
  status?: 'active' | 'inactive' | 'pending' | 'suspended';
  category?: string;
  location?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface OrderFilters extends PaginationParams {
  status?: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
  businessId?: string;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
}

// Admin API Services
export const adminApi = {
  // Authentication
  auth: {
    // Admin login
    login: async (credentials: { emailAddress: string; password: string }) => {
      return await authenticateAdmin(credentials);
    },

    // Admin signup
    signup: async (credentials: { fullName: string; emailAddress: string; phoneNumber: string; password: string }) => {
      return await signupAdmin(credentials);
    },

    // Admin logout
    logout: async () => {
      return await logoutAdmin();
    },

    // Get current admin profile
    getProfile: async () => {
      return await getAdminProfile();
    },
  },
  // Users Management
  users: {
    // Get paginated list of users
    getAll: async (params?: UserFilters): Promise<ApiResponse<User[]>> => {
      // Make direct axios call to handle the raw API response
      const response = await apiClient.get<{ users: User[]; pagination: Record<string, unknown> }>('/admin/users', { params });
      // Transform the response to match expected structure
      return {
        data: response.data.users,
        pagination: response.data.pagination,
        success: true,
        message: 'Users retrieved successfully'
      };
    },

    // Get user by ID
    getById: async (id: string): Promise<ApiResponse<User>> => {
      return api.get<User>(`/admin/users/${id}`);
    },

    // Create new user
    create: async (userData: Partial<User>): Promise<ApiResponse<User>> => {
      return api.post<User>('/admin/users', userData);
    },

    // Update user
    update: async (id: string, userData: Partial<User>): Promise<ApiResponse<User>> => {
      return api.put<User>(`/admin/users/${id}`, userData);
    },

    // Delete user
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return api.delete<void>(`/admin/users/${id}`);
    },

    // Suspend/activate user
    toggleStatus: async (id: string, status: 'active' | 'suspended'): Promise<ApiResponse<User>> => {
      return api.patch<User>(`/admin/users/${id}/status`, { status });
    },

    // Get user statistics
    getStats: async (): Promise<ApiResponse<{
      total: number;
      active: number;
      inactive: number;
      suspended: number;
      newThisMonth: number;
    }>> => {
      return api.get('/admin/users/stats');
    },
  },

  // Businesses Management
  businesses: {
    // Get paginated list of laundry businesses
    getAll: async (params?: BusinessFilters): Promise<ApiResponse<Business[]>> => {
      return api.get<Business[]>('/admin/businesses', { params });
    },

    // Get business by ID
    getById: async (id: string): Promise<ApiResponse<Business>> => {
      return api.get<Business>(`/admin/businesses/${id}`);
    },

    // Create new business
    create: async (businessData: Partial<Business>): Promise<ApiResponse<Business>> => {
      return api.post<Business>('/admin/businesses', businessData);
    },

    // Update business
    update: async (id: string, businessData: Partial<Business>): Promise<ApiResponse<Business>> => {
      return api.put<Business>(`/admin/businesses/${id}`, businessData);
    },

    // Delete business
    delete: async (id: string): Promise<ApiResponse<void>> => {
      return api.delete<void>(`/admin/businesses/${id}`);
    },

    // Approve/reject business
    updateStatus: async (id: string, status: 'pending' | 'approved' | 'rejected' | 'suspended'): Promise<ApiResponse<Business>> => {
      return api.patch<Business>(`/admin/businesses/${id}/status`, { status });
    },

    // Get business statistics
    getStats: async (): Promise<ApiResponse<{
      total: number;
      active: number;
      pending: number;
      suspended: number;
      newThisMonth: number;
    }>> => {
      return api.get('/admin/businesses/stats');
    },
  },

  // Laundry Orders Management
  orders: {
    // Get all laundry orders
    getAll: async (params?: OrderFilters): Promise<ApiResponse<Order[]>> => {
      return api.get<Order[]>('/admin/laundry-orders', { params });
    },

    // Get order by ID
    getById: async (id: string): Promise<ApiResponse<Order>> => {
      return api.get<Order>(`/admin/laundry-orders/${id}`);
    },

    // Update order status
    updateStatus: async (id: string, status: string): Promise<ApiResponse<Order>> => {
      return api.patch<Order>(`/admin/laundry-orders/${id}/status`, { status });
    },

    // Get order statistics
    getStats: async (): Promise<ApiResponse<{
      total: number;
      pending: number;
      inProgress: number;
      completed: number;
      cancelled: number;
      revenue: number;
    }>> => {
      return api.get('/admin/laundry-orders/stats');
    },
  },

  // Payments Management
  payments: {
    // Get all payments
    getAll: async (params?: PaginationParams): Promise<ApiResponse<Payment[]>> => {
      return api.get<Payment[]>('/admin/payments', { params });
    },

    // Get payment by ID
    getById: async (id: string): Promise<ApiResponse<Payment>> => {
      return api.get<Payment>(`/admin/payments/${id}`);
    },

    // Update payment status
    updateStatus: async (id: string, status: string): Promise<ApiResponse<Payment>> => {
      return api.patch<Payment>(`/admin/payments/${id}/status`, { status });
    },

    // Get payment statistics
    getStats: async (): Promise<ApiResponse<{
      total: number;
      successful: number;
      failed: number;
      pending: number;
      totalAmount: number;
      thisMonth: number;
    }>> => {
      return api.get('/admin/payments/stats');
    },
  },

  // Analytics and Reports
  analytics: {
    // Get dashboard analytics
    getDashboard: async (): Promise<ApiResponse<{
      users: {
        total: number;
        growth: number;
        active: number;
      };
      businesses: {
        total: number;
        growth: number;
        active: number;
      };
      orders: {
        total: number;
        growth: number;
        revenue: number;
      };
      payments: {
        total: number;
        successful: number;
        failed: number;
      };
    }>> => {
      return api.get('/admin/analytics/dashboard');
    },

    // Get revenue analytics
    getRevenue: async (period: '7d' | '30d' | '90d' | '1y'): Promise<ApiResponse<{
      period: string;
      data: Array<{
        date: string;
        revenue: number;
        orders: number;
      }>;
    }>> => {
      return api.get('/admin/analytics/revenue', { params: { period } });
    },

    // Get user growth analytics
    getUserGrowth: async (period: '7d' | '30d' | '90d' | '1y'): Promise<ApiResponse<{
      period: string;
      data: Array<{
        date: string;
        users: number;
        businesses: number;
      }>;
    }>> => {
      return api.get('/admin/analytics/user-growth', { params: { period } });
    },
  },
};

export default adminApi;
