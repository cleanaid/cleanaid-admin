export interface User {
  id: string
  name: string
  email: string
  phone: string
  status: 'active' | 'inactive' | 'suspended'
  role: 'user' | 'vendor' | 'admin'
  createdAt: string
  lastLogin: string
  totalOrders: number
  totalSpent: number
  avatar?: string
}

export interface UserFilters {
  status?: string
  role?: string
  search?: string
}

export interface UserAction {
  type: 'delete' | 'deactivate' | 'activate' | 'suspend'
  userId: string
  reason?: string
}
