import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { adminApi, type UserFilters, type BusinessFilters, type OrderFilters, type PaginationParams } from './admin';
import { type ApiResponse } from './api-client';
import { User } from '@/types/user';
import { Business } from '@/types/business';

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
  analytics: {
    all: ['analytics'] as const,
    dashboard: () => [...queryKeys.analytics.all, 'dashboard'] as const,
    revenue: (period: string) => [...queryKeys.analytics.all, 'revenue', period] as const,
    userGrowth: (period: string) => [...queryKeys.analytics.all, 'userGrowth', period] as const,
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

export const usePayment = (id: string, options?: UseQueryOptions) => {
  return useQuery({
    queryKey: queryKeys.payments.detail(id),
    queryFn: () => adminApi.payments.getById(id),
    enabled: !!id,
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

export const useUpdatePaymentStatus = (options?: UseMutationOptions<unknown, Error, { id: string; status: string }>) => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => 
      adminApi.payments.updateStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
    },
    ...options,
  });
};

// Analytics Hooks
export const useDashboardAnalytics = (options?: UseQueryOptions) => {
  return useQuery({
    queryKey: queryKeys.analytics.dashboard(),
    queryFn: () => adminApi.analytics.getDashboard(),
    ...options,
  });
};

export const useRevenueAnalytics = (period: '7d' | '30d' | '90d' | '1y', options?: UseQueryOptions) => {
  return useQuery({
    queryKey: queryKeys.analytics.revenue(period),
    queryFn: () => adminApi.analytics.getRevenue(period),
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