export interface User {
  id?: string
  fullName: string
  name?: string // For backward compatibility
  emailAddress?: string | null
  email?: string // For backward compatibility
  phoneNumber: string
  phone?: string // For backward compatibility
  status?: 'active' | 'inactive' | 'suspended'
  isVerified?: boolean
  role: 'admin' | 'service_provider' | 'customer' | 'user' | 'vendor' // Updated to match API
  createdAt?: string
  lastLogin: string
  transaction: number
  totalOrders?: number // For backward compatibility
  totalSpent?: number // For backward compatibility
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
