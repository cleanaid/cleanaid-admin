import { api, apiClient, ApiResponse } from './api-client';
import { User } from '@/types/user';
import { Business } from '@/types/business';
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
      // Backend returns user data directly, not wrapped in ApiResponse
      const response = await apiClient.get<User>(`/admin/users/${id}`);
      return {
        data: response.data,
        success: true,
        message: 'User retrieved successfully'
      };
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

    // Get user metrics (active, inactive, returning)
    getMetrics: async (): Promise<ApiResponse<{
      activeUsers: number;
      inactiveUsers: number;
      returningUsers: number;
    }>> => {
      return api.get('/admin/users/metrics');
    },

    // Get user reward history
    getRewardHistory: async (userId: string, params?: { page?: number; limit?: number }): Promise<ApiResponse<{
      _id: string;
      orderId: string;
      clothesCount: number;
      rewardType: string;
      totalAmount: number;
      amountSaved: number;
      startDate: string | Date;
      endDate: string | Date;
      status: string;
      createdAt: string | Date;
    }[]>> => {
      // Backend returns { pagination, rewards }
      interface RewardHistoryItem {
        _id: string;
        orderId: string;
        clothesCount: number;
        rewardType: string;
        totalAmount: number;
        amountSaved: number;
        startDate: string | Date;
        endDate: string | Date;
        status: string;
        createdAt: string | Date;
      }
      const response = await apiClient.get<{ rewards: RewardHistoryItem[]; pagination: Record<string, unknown> }>(`/admin/users/${userId}/reward-history`, { params });
      // Transform to ApiResponse format
      return {
        data: response.data.rewards,
        pagination: response.data.pagination as ApiResponse<RewardHistoryItem[]>['pagination'],
        success: true,
        message: 'User reward history retrieved successfully'
      };
    },
  },

  // Businesses Management
  businesses: {
    // Get paginated list of laundry businesses
    getAll: async (params?: BusinessFilters): Promise<ApiResponse<Business[]>> => {
      // Make direct axios call to handle the raw API response
      const response = await apiClient.get<{ businesses: Business[]; pagination: Record<string, unknown> }>('/admin/businesses', { params });
      // Transform the response to match expected structure
      return {
        data: response.data.businesses,
        pagination: response.data.pagination,
        success: true,
        message: 'Businesses retrieved successfully'
      };
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

    // Get business metrics (active, inactive, returning)
    getMetrics: async (): Promise<ApiResponse<{
      activeBusinesses: number;
      inactiveBusinesses: number;
      returningBusinesses: number;
    }>> => {
      return api.get('/admin/businesses/metrics');
    },
  },

  // Laundry Orders Management
  orders: {
    // Get all laundry orders
    getAll: async (params?: OrderFilters): Promise<ApiResponse<Order[]>> => {
      // The backend returns { pagination, orders } structure
      interface BackendOrderResponse {
        orderId: string
        customer?: {
          name: string
          phone: string
          email: string
          address?: string
        } | null
        laundryBusiness?: {
          name: string
          email: string
          phone: string
          address?: string
        } | null
        totalAmount: number
        discountAmount: number
        paymentStatus: 'pending' | 'paid' | 'failed'
        progressMilestone: string
        isNewOrder: boolean
        hasExpired: boolean
        deliveryDate: string | Date
        createdAt: string | Date
      }
      const response = await apiClient.get<{ pagination: Record<string, unknown>; orders: BackendOrderResponse[] }>('/admin/laundry-activities', { params });
      // Transform to match expected ApiResponse structure
      return {
        data: response.data.orders as unknown as Order[],
        pagination: response.data.pagination,
        success: true,
        message: 'Orders retrieved successfully'
      };
    },

    // Get order by ID
    getById: async (id: string): Promise<ApiResponse<Order>> => {
      return api.get<Order>(`/admin/orders/${id}`);
    },

    // Get orders by user ID
    getByUserId: async (userId: string, params?: { page?: number; limit?: number }): Promise<ApiResponse<Order[]>> => {
      // Backend returns { pagination, orders } directly
      const response = await apiClient.get<{ orders: Order[]; pagination: Record<string, unknown> }>(`/admin/orders/user/${userId}`, { params });
      // Transform to ApiResponse format
      return {
        data: response.data.orders,
        pagination: response.data.pagination as ApiResponse<Order[]>['pagination'],
        success: true,
        message: 'User orders retrieved successfully'
      };
    },

    // Update order status
    updateStatus: async (id: string, status: string): Promise<ApiResponse<Order>> => {
      return api.patch<Order>(`/admin/laundry-activities/${id}/status`, { status });
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
      return api.get('/admin/laundry-activities/stats');
    },
  },

  // Payments Management (Transactions)
  payments: {
    // Get all transactions
    getAll: async (params?: PaginationParams): Promise<ApiResponse<{ transactions: unknown[]; totalTransactions: number; page: number; totalPages: number }>> => {
      return api.get('/admin/transactions', { params });
    },

    // Get transaction statistics
    getStats: async (): Promise<ApiResponse<{
      totalAmount: number;
      businessAmount: number;
      userAmount: number;
      profit: number;
      refunds: number;
      withdrawals: number;
    }>> => {
      return api.get('/admin/transactions/stats');
    },
  },

  // Payouts Management
  payouts: {
    // Get all payouts
    getAll: async (params?: PaginationParams): Promise<ApiResponse<{ payouts: unknown[]; totalWithdrawals: number; page: number; totalPages: number }>> => {
      return api.get('/admin/payouts', { params });
    },

    // Get payout statistics
    getStats: async (): Promise<ApiResponse<{
      successful: { count: number; amount: number };
      pending: { count: number; amount: number };
      unsuccessful: { count: number; amount: number };
    }>> => {
      return api.get('/admin/payouts/metrics');
    },
  },

  // Analytics and Reports
  analytics: {
    // Get orders analytics
    getOrders: async (year?: number): Promise<ApiResponse<{
      monthlyData: Array<{
        month: string;
        value: number;
        count: number;
        completed: number;
        pending: number;
        cancelled: number;
      }>;
      summary: {
        totalOrders: number;
        completed: number;
        pending: number;
        cancelled: number;
      };
    }>> => {
      // Backend returns direct object, not wrapped in ApiResponse
      const response = await apiClient.get<{
        monthlyData: Array<{
          month: string;
          value: number;
          count: number;
          completed: number;
          pending: number;
          cancelled: number;
        }>;
        summary: {
          totalOrders: number;
          completed: number;
          pending: number;
          cancelled: number;
        };
      }>('/admin/analytics/orders', { params: year ? { year } : {} });
      
      return {
        data: response.data,
        success: true,
        message: 'Orders analytics retrieved successfully'
      };
    },

    // Get users analytics
    getUsers: async (year?: number): Promise<ApiResponse<{
      monthlyData: Array<{
        month: string;
        value: number;
        count: number;
        active: number;
        inactive: number;
      }>;
      summary: {
        totalUsers: number;
        activeUsers: number;
        inactiveUsers: number;
        returnedUsers: number;
      };
    }>> => {
      // Backend returns direct object, not wrapped in ApiResponse
      const response = await apiClient.get<{
        monthlyData: Array<{
          month: string;
          value: number;
          count: number;
          active: number;
          inactive: number;
        }>;
        summary: {
          totalUsers: number;
          activeUsers: number;
          inactiveUsers: number;
          returnedUsers: number;
        };
      }>('/admin/analytics/users', { params: year ? { year } : {} });
      
      return {
        data: response.data,
        success: true,
        message: 'Users analytics retrieved successfully'
      };
    },

    // Get revenue analytics
    getRevenue: async (year?: number): Promise<ApiResponse<{
      monthlyData: Array<{
        month: string;
        value: number;
        revenue: number;
        profit: number;
      }>;
      summary: {
        revenue: number;
        profit: number;
        refunds: number;
      };
    }>> => {
      // Backend returns direct object, not wrapped in ApiResponse
      const response = await apiClient.get<{
        monthlyData: Array<{
          month: string;
          value: number;
          revenue: number;
          profit: number;
        }>;
        summary: {
          revenue: number;
          profit: number;
          refunds: number;
        };
      }>('/admin/analytics/revenue', { params: year ? { year } : {} });
      
      return {
        data: response.data,
        success: true,
        message: 'Revenue analytics retrieved successfully'
      };
    },

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

    // Get user growth analytics (legacy)
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

    // Get platform metrics
    getMetrics: async (): Promise<ApiResponse<{
      users: {
        active: number;
        inactive: number;
        returning: number;
      };
      businesses: {
        active: number;
        inactive: number;
        returning: number;
      };
      laundryOrder: {
        active: number;
        successful: number;
        canceled: number;
      };
    }>> => {
      try {
        console.log('Fetching metrics from API...');
        const result = await api.get<{
          users: {
            active: number;
            inactive: number;
            returning: number;
          };
          businesses: {
            active: number;
            inactive: number;
            returning: number;
          };
          laundryOrder: {
            active: number;
            successful: number;
            canceled: number;
          };
        }>('/admin/metrics');
        console.log('Metrics API response:', result);
        return result;
      } catch (error: unknown) {
        console.error('Metrics API error:', error);
        throw error;
      }
    },
  },
};

export default adminApi;
