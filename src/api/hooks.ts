import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { adminApi, type UserFilters, type BusinessFilters, type OrderFilters, type PaginationParams } from './admin';
import { type ApiResponse } from './api-client';
import { User } from '@/types/user';
import { Business } from '@/types/business';
import { Broadcast, BroadcastFilters, CreateBroadcastPayload } from '@/types/broadcast';

// Re-export types for convenience
export type { UserFilters, BusinessFilters, OrderFilters, PaginationParams, ApiResponse };

// Query Keys
export const queryKeys = {
  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters: UserFilters) => [...queryKeys.users.lists(), filters] as const,
    details: () => [...queryKeys.users.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.users.details(), id] as const,
    stats: () => [...queryKeys.users.all, 'stats'] as const,
  },
  businesses: {
    all: ['businesses'] as const,
    lists: () => [...queryKeys.businesses.all, 'list'] as const,
    list: (filters: BusinessFilters) => [...queryKeys.businesses.lists(), filters] as const,
    details: () => [...queryKeys.businesses.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.businesses.details(), id] as const,
    stats: () => [...queryKeys.businesses.all, 'stats'] as const,
  },
  orders: {
    all: ['orders'] as const,
    lists: () => [...queryKeys.orders.all, 'list'] as const,
    list: (filters: OrderFilters) => [...queryKeys.orders.lists(), filters] as const,
    details: () => [...queryKeys.orders.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.orders.details(), id] as const,
    stats: () => [...queryKeys.orders.all, 'stats'] as const,
  },
  payments: {
    all: ['payments'] as const,
    lists: () => [...queryKeys.payments.all, 'list'] as const,
    list: (filters: PaginationParams) => [...queryKeys.payments.lists(), filters] as const,
    details: () => [...queryKeys.payments.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.payments.details(), id] as const,
    stats: () => [...queryKeys.payments.all, 'stats'] as const,
  },
  payouts: {
    all: ['payouts'] as const,
    lists: () => [...queryKeys.payouts.all, 'list'] as const,
    list: (filters: PaginationParams) => [...queryKeys.payouts.lists(), filters] as const,
    stats: () => [...queryKeys.payouts.all, 'stats'] as const,
  },
  analytics: {
    all: ['analytics'] as const,
    dashboard: () => [...queryKeys.analytics.all, 'dashboard'] as const,
    metrics: () => [...queryKeys.analytics.all, 'metrics'] as const,
    revenue: (period: string) => [...queryKeys.analytics.all, 'revenue', period] as const,
    userGrowth: (period: string) => [...queryKeys.analytics.all, 'userGrowth', period] as const,
  },
  broadcasts: {
    all: ['broadcasts'] as const,
    lists: () => [...queryKeys.broadcasts.all, 'list'] as const,
    list: (filters: BroadcastFilters) => [...queryKeys.broadcasts.lists(), filters] as const,
    details: () => [...queryKeys.broadcasts.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.broadcasts.details(), id] as const,
  },
  admins: {
    all: ['admins'] as const,
    lists: () => [...queryKeys.admins.all, 'list'] as const,
    list: (filters: { page?: number; limit?: number; search?: string; accessLevel?: string; status?: string }) => [...queryKeys.admins.lists(), filters] as const,
    stats: () => [...queryKeys.admins.all, 'stats'] as const,
  },
};

// Users Hooks
export const useUsers = (filters?: UserFilters, options?: UseQueryOptions<ApiResponse<User[]>, Error, ApiResponse<User[]>, readonly unknown[]>) => {
  return useQuery({
    queryKey: queryKeys.users.list(filters || {}),
    queryFn: () => adminApi.users.getAll(filters),
    ...options,
  });
};

export const useUser = (id: string, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: queryKeys.users.detail(id),
    queryFn: () => adminApi.users.getById(id),
    enabled: !!id,
    ...options,
  });
};

export const useUserStats = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: queryKeys.users.stats(),
    queryFn: () => adminApi.users.getStats(),
    ...options,
  });
};

export const useUserMetrics = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: [...queryKeys.users.stats(), 'metrics'],
    queryFn: () => adminApi.users.getMetrics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    ...options,
  });
};

export const useUserRewardHistory = (userId: string, params?: { page?: number; limit?: number }, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: [...queryKeys.users.detail(userId), 'reward-history', params],
    queryFn: () => adminApi.users.getRewardHistory(userId, params),
    enabled: !!userId,
    ...options,
  });
};

export const useCreateUser = (options?: UseMutationOptions<unknown, Error, Partial<User>>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (userData: Partial<User>) => adminApi.users.create(userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
    ...options,
  });
};

export const useUpdateUser = (options?: UseMutationOptions<unknown, Error, { id: string; userData: Partial<User> }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, userData }: { id: string; userData: Partial<User> }) => 
      adminApi.users.update(id, userData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
    ...options,
  });
};

export const useDeleteUser = (options?: UseMutationOptions<unknown, Error, string>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => adminApi.users.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
    ...options,
  });
};

export const useToggleUserStatus = (options?: UseMutationOptions<unknown, Error, { id: string; status: 'active' | 'suspended' }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'active' | 'suspended' }) => 
      adminApi.users.toggleStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
    ...options,
  });
};

// Businesses Hooks
export const useBusinesses = (filters?: BusinessFilters, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: queryKeys.businesses.list(filters || {}),
    queryFn: () => adminApi.businesses.getAll(filters),
    ...options,
  });
};

export const useBusiness = (id: string, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: queryKeys.businesses.detail(id),
    queryFn: () => adminApi.businesses.getById(id),
    enabled: !!id,
    ...options,
  });
};

export const useBusinessStats = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: queryKeys.businesses.stats(),
    queryFn: () => adminApi.businesses.getStats(),
    ...options,
  });
};

export const useBusinessMetrics = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: [...queryKeys.businesses.stats(), 'metrics'],
    queryFn: () => adminApi.businesses.getMetrics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    ...options,
  });
};

export const useCreateBusiness = (options?: UseMutationOptions<unknown, Error, Partial<Business>>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (businessData: Partial<Business>) => adminApi.businesses.create(businessData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.businesses.all });
    },
    ...options,
  });
};

export const useUpdateBusiness = (options?: UseMutationOptions<unknown, Error, { id: string; businessData: Partial<Business> }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, businessData }: { id: string; businessData: Partial<Business> }) => 
      adminApi.businesses.update(id, businessData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.businesses.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.businesses.all });
    },
    ...options,
  });
};

export const useDeleteBusiness = (options?: UseMutationOptions<unknown, Error, string>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => adminApi.businesses.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.businesses.all });
    },
    ...options,
  });
};

export const useUpdateBusinessStatus = (options?: UseMutationOptions<unknown, Error, { id: string; status: 'pending' | 'approved' | 'rejected' | 'suspended' }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'pending' | 'approved' | 'rejected' | 'suspended' }) => 
      adminApi.businesses.updateStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.businesses.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.businesses.all });
    },
    ...options,
  });
};

// Orders Hooks
export const useOrders = (filters?: OrderFilters, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: queryKeys.orders.list(filters || {}),
    queryFn: () => adminApi.orders.getAll(filters),
    ...options,
  });
};

export const useOrder = (id: string, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: queryKeys.orders.detail(id),
    queryFn: () => adminApi.orders.getById(id),
    enabled: !!id,
    ...options,
  });
};

export const useUserOrders = (userId: string, params?: { page?: number; limit?: number }, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: [...queryKeys.orders.all, 'user', userId, params],
    queryFn: () => adminApi.orders.getByUserId(userId, params),
    enabled: !!userId,
    ...options,
  });
};

export const useOrderStats = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: queryKeys.orders.stats(),
    queryFn: () => adminApi.orders.getStats(),
    ...options,
  });
};

export const useUpdateOrderStatus = (options?: UseMutationOptions<unknown, Error, { id: string; status: string }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      adminApi.orders.updateStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
    ...options,
  });
};

// Payments Hooks
export const usePayments = (filters?: PaginationParams, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: queryKeys.payments.list(filters || {}),
    queryFn: () => adminApi.payments.getAll(filters),
    ...options,
  });
};


export const usePaymentStats = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: queryKeys.payments.stats(),
    queryFn: () => adminApi.payments.getStats(),
    ...options,
  });
};

// Note: updateStatus method not implemented in adminApi.payments
// If needed, add it to admin.ts first
// export const useUpdatePaymentStatus = (options?: UseMutationOptions<unknown, Error, { id: string; status: string }>) => {
//   const queryClient = useQueryClient();
//   
//   return useMutation({
//     mutationFn: ({ id, status }: { id: string; status: string }) => 
//       adminApi.payments.updateStatus(id, status),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
//     },
//     ...options,
//   });
// };

// Analytics Hooks
export const useOrdersAnalytics = (year?: number, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: [...queryKeys.analytics.all, 'orders', year || new Date().getFullYear()],
    queryFn: () => adminApi.analytics.getOrders(year),
    ...options,
  });
};

export const useUsersAnalytics = (year?: number, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: [...queryKeys.analytics.all, 'users', year || new Date().getFullYear()],
    queryFn: () => adminApi.analytics.getUsers(year),
    ...options,
  });
};

export const useRevenueAnalytics = (year?: number, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: [...queryKeys.analytics.all, 'revenue', year || new Date().getFullYear()],
    queryFn: () => adminApi.analytics.getRevenue(year),
    ...options,
  });
};

export const useDashboardAnalytics = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: queryKeys.analytics.dashboard(),
    queryFn: () => adminApi.analytics.getDashboard(),
    ...options,
  });
};

export const useUserGrowthAnalytics = (period: '7d' | '30d' | '90d' | '1y', options?: UseQueryOptions) => {
  return useQuery({
    queryKey: queryKeys.analytics.userGrowth(period),
    queryFn: () => adminApi.analytics.getUserGrowth(period),
    ...options,
  });
};

export const useAdminMetrics = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: queryKeys.analytics.metrics(),
    queryFn: () => adminApi.analytics.getMetrics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    ...options,
  });
};

// Payouts Hooks
export const usePayouts = (filters?: PaginationParams, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: queryKeys.payouts.list(filters || {}),
    queryFn: () => adminApi.payouts.getAll(filters),
    ...options,
  });
};

export const usePayoutStats = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: queryKeys.payouts.stats(),
    queryFn: () => adminApi.payouts.getStats(),
    ...options,
  });
};

// Broadcast Hooks
export const useBroadcasts = (filters?: BroadcastFilters, options?: UseQueryOptions<ApiResponse<Broadcast[]>>) => {
  return useQuery<ApiResponse<Broadcast[]>>({
    queryKey: queryKeys.broadcasts.list(filters || {}),
    queryFn: () => adminApi.broadcast.getAll(filters),
    ...options,
  });
};

export const useBroadcast = (id: string, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: queryKeys.broadcasts.detail(id),
    queryFn: () => adminApi.broadcast.getById(id),
    enabled: !!id,
    ...options,
  });
};

export const useCreateBroadcast = (options?: UseMutationOptions<ApiResponse<Broadcast>, Error, CreateBroadcastPayload>) => {
  const queryClient = useQueryClient();
  const userOnSuccess = options?.onSuccess;
  
  return useMutation({
    mutationFn: (payload: CreateBroadcastPayload) => adminApi.broadcast.create(payload),
    onSuccess: (data, variables, context) => {
      // Invalidate all broadcast queries to refetch the list
      queryClient.invalidateQueries({ queryKey: queryKeys.broadcasts.all });
      // Call the user's onSuccess if provided (after invalidation)
      if (userOnSuccess) {
        userOnSuccess(data, variables, context);
      }
    },
    // Spread other options but preserve our onSuccess
    ...(options ? Object.fromEntries(
      Object.entries(options).filter(([key]) => key !== 'onSuccess')
    ) : {}),
  });
};

// Admin Management Hooks
export const useAdmins = (filters?: { page?: number; limit?: number; search?: string; accessLevel?: string; status?: string }, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: queryKeys.admins.list(filters || {}),
    queryFn: () => adminApi.admins.getAll(filters),
    ...options,
  });
};

export const useAdminStats = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: queryKeys.admins.stats(),
    queryFn: () => adminApi.admins.getStats(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};