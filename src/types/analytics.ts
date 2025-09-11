export interface AnalyticsData {
  date: string
  users: number
  businesses: number
  orders: number
  revenue: number
}

export interface VendorAnalytics {
  businessId: string
  businessName: string
  totalOrders: number
  totalRevenue: number
  averageRating: number
  completionRate: number
}

export interface UserAnalytics {
  userId: string
  userName: string
  totalOrders: number
  totalSpent: number
  averageOrderValue: number
  lastOrderDate: string
}

export interface AnalyticsFilters {
  dateRange: {
    from: string
    to: string
  }
  businessType?: string
  region?: string
}

export interface ChartData {
  name: string
  value: number
  color?: string
}
