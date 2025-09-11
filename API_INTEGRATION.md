# API Integration Guide

This guide provides detailed instructions for integrating the Cleanaid Admin Dashboard with your Node.js/Express API.

## 🔧 Environment Setup

### 1. Environment Variables

Create a `.env.local` file in the root directory:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_API_KEY=your-api-key-here

# Authentication
NEXT_PUBLIC_JWT_SECRET=your-jwt-secret
NEXT_PUBLIC_AUTH_COOKIE_NAME=cleanaid-admin-token

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_PAYMENTS=true
NEXT_PUBLIC_DEBUG_MODE=false
```

## 🔐 Authentication Implementation

### 1. Create Auth Context

```typescript
// src/contexts/auth-context.tsx
"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'super-admin'
  permissions: string[]
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check for existing token on mount
    const storedToken = localStorage.getItem('admin-token')
    if (storedToken) {
      setToken(storedToken)
      // Verify token with API
      verifyToken(storedToken)
    } else {
      setIsLoading(false)
    }
  }, [])

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('admin-token')
        setToken(null)
        router.push('/login')
      }
    } catch (error) {
      console.error('Token verification failed:', error)
      localStorage.removeItem('admin-token')
      setToken(null)
      router.push('/login')
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        throw new Error('Login failed')
      }

      const data = await response.json()
      const { token: newToken, user: userData } = data

      localStorage.setItem('admin-token', newToken)
      setToken(newToken)
      setUser(userData)
      router.push('/dashboard')
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('admin-token')
    setToken(null)
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
```

### 2. Protected Route Component

```typescript
// src/components/protected-route.tsx
"use client"

import { useAuth } from '@/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredPermissions?: string[]
}

export function ProtectedRoute({ children, requiredPermissions = [] }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  // Check permissions if required
  if (requiredPermissions.length > 0) {
    const hasPermission = requiredPermissions.every(permission => 
      user.permissions.includes(permission)
    )
    
    if (!hasPermission) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
            <p className="text-muted-foreground">You don't have permission to access this page.</p>
          </div>
        </div>
      )
    }
  }

  return <>{children}</>
}
```

## 📊 API Service Layer

### 1. Create API Client

```typescript
// src/lib/api-client.ts
class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
  }

  setToken(token: string | null) {
    this.token = token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(this.token && { Authorization: `Bearer ${this.token}` }),
        ...options.headers,
      },
      ...options,
    }

    const response = await fetch(url, config)

    if (!response.ok) {
      if (response.status === 401) {
        // Token expired, redirect to login
        localStorage.removeItem('admin-token')
        window.location.href = '/login'
        throw new Error('Unauthorized')
      }
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Users API
  async getUsers(filters?: any) {
    const params = new URLSearchParams(filters)
    return this.request(`/users?${params}`)
  }

  async getUser(id: string) {
    return this.request(`/users/${id}`)
  }

  async updateUser(id: string, data: any) {
    return this.request(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async deleteUser(id: string) {
    return this.request(`/users/${id}`, {
      method: 'DELETE',
    })
  }

  async performUserAction(id: string, action: string, data?: any) {
    return this.request(`/users/${id}/actions`, {
      method: 'POST',
      body: JSON.stringify({ action, ...data }),
    })
  }

  // Businesses API
  async getBusinesses(filters?: any) {
    const params = new URLSearchParams(filters)
    return this.request(`/businesses?${params}`)
  }

  async getBusiness(id: string) {
    return this.request(`/businesses/${id}`)
  }

  async verifyBusiness(id: string, data: any) {
    return this.request(`/businesses/${id}/verify`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async rejectBusiness(id: string, reason: string) {
    return this.request(`/businesses/${id}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    })
  }

  // Payments API
  async getPayments(filters?: any) {
    const params = new URLSearchParams(filters)
    return this.request(`/payments?${params}`)
  }

  async createManualTransaction(data: any) {
    return this.request('/payments/manual', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async processRefund(paymentId: string, data: any) {
    return this.request(`/payments/${paymentId}/refund`, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  // Analytics API
  async getAnalytics(filters?: any) {
    const params = new URLSearchParams(filters)
    return this.request(`/analytics?${params}`)
  }

  async getVendorAnalytics(filters?: any) {
    const params = new URLSearchParams(filters)
    return this.request(`/analytics/vendors?${params}`)
  }

  async getUserAnalytics(filters?: any) {
    const params = new URLSearchParams(filters)
    return this.request(`/analytics/users?${params}`)
  }

  // Settings API
  async getSettings() {
    return this.request('/settings')
  }

  async updateAccessControlSettings(data: any) {
    return this.request('/settings/access-control', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async updateApplicationSettings(data: any) {
    return this.request('/settings/application', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }
}

export const apiClient = new ApiClient()
```

### 2. Update React Query Configuration

```typescript
// src/lib/providers.tsx
"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { useState, useEffect } from "react"
import { apiClient } from "./api-client"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            retry: (failureCount, error: any) => {
              if (error?.status === 401) {
                return false // Don't retry on auth errors
              }
              return failureCount < 3
            },
          },
          mutations: {
            retry: false,
          },
        },
      })
  )

  useEffect(() => {
    // Set token from localStorage
    const token = localStorage.getItem('admin-token')
    if (token) {
      apiClient.setToken(token)
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
```

## 🔄 Replacing Mock Data

### 1. Users Page Integration

```typescript
// src/app/(dashboard)/users/page.tsx
"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"
import { toast } from "sonner" // Install: npm install sonner

export default function UsersPage() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState({})

  // Replace mock data with real API call
  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ['users', filters],
    queryFn: () => apiClient.getUsers(filters),
    enabled: !!apiClient.token, // Only fetch when authenticated
  })

  // User actions mutation
  const userActionMutation = useMutation({
    mutationFn: ({ userId, action, data }: { userId: string, action: string, data?: any }) =>
      apiClient.performUserAction(userId, action, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      toast.success('User action completed successfully')
    },
    onError: (error) => {
      toast.error(`Failed to perform action: ${error.message}`)
    },
  })

  const handleUserAction = (userId: string, action: string, data?: any) => {
    userActionMutation.mutate({ userId, action, data })
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-600">Error Loading Users</h3>
          <p className="text-muted-foreground">{error.message}</p>
        </div>
      </div>
    )
  }

  // Rest of component remains the same...
}
```

### 2. Analytics Integration

```typescript
// src/app/(dashboard)/analytics/page.tsx
"use client"

import { useQuery } from "@tanstack/react-query"
import { apiClient } from "@/lib/api-client"

export default function AnalyticsPage() {
  const [filters, setFilters] = useState({
    dateRange: {
      from: "2024-01-01",
      to: "2024-01-07",
    },
  })

  // Replace mock data with real API calls
  const { data: analyticsData = [], isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ['analytics', filters],
    queryFn: () => apiClient.getAnalytics(filters),
    enabled: !!apiClient.token,
  })

  const { data: vendorAnalytics = [], isLoading: isLoadingVendors } = useQuery({
    queryKey: ['vendor-analytics', filters],
    queryFn: () => apiClient.getVendorAnalytics(filters),
    enabled: !!apiClient.token,
  })

  const { data: userAnalytics = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['user-analytics', filters],
    queryFn: () => apiClient.getUserAnalytics(filters),
    enabled: !!apiClient.token,
  })

  // Rest of component remains the same...
}
```

## 🚨 Error Handling

### 1. Global Error Boundary

```typescript
// src/components/error-boundary.tsx
"use client"

import { Component, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600">Something went wrong</h1>
            <p className="text-muted-foreground mt-2">
              An unexpected error occurred. Please refresh the page.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              Refresh Page
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
```

### 2. Toast Notifications

Install and configure toast notifications:

```bash
npm install sonner
```

```typescript
// src/app/layout.tsx
import { Toaster } from "sonner"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
```

## 🔒 Security Best Practices

### 1. Input Validation

```typescript
// src/lib/validation.ts
import { z } from 'zod'

export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().regex(/^\+?[\d\s-()]+$/, 'Invalid phone number'),
})

export const businessSchema = z.object({
  name: z.string().min(2, 'Business name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  businessType: z.enum(['cleaning', 'maintenance', 'other']),
})
```

### 2. Rate Limiting

Implement rate limiting on the frontend:

```typescript
// src/hooks/use-rate-limit.ts
import { useState, useCallback } from 'react'

export function useRateLimit(maxRequests: number, windowMs: number) {
  const [requests, setRequests] = useState<number[]>([])

  const isAllowed = useCallback(() => {
    const now = Date.now()
    const validRequests = requests.filter(time => now - time < windowMs)
    
    if (validRequests.length >= maxRequests) {
      return false
    }

    setRequests([...validRequests, now])
    return true
  }, [requests, maxRequests, windowMs])

  return { isAllowed }
}
```

## 📱 Mobile Responsiveness

The dashboard is already mobile-responsive, but ensure your API handles mobile-specific requirements:

- Pagination for large datasets
- Optimized image sizes
- Touch-friendly interface elements
- Offline support (optional)

## 🚀 Deployment Checklist

Before deploying to production:

- [ ] Set up environment variables
- [ ] Configure CORS on your API
- [ ] Set up SSL certificates
- [ ] Configure rate limiting
- [ ] Set up monitoring and logging
- [ ] Test all API endpoints
- [ ] Verify authentication flow
- [ ] Test error handling
- [ ] Optimize bundle size
- [ ] Set up CI/CD pipeline

## 📞 Support

For API integration support:
- Check the API documentation
- Review the error logs
- Test endpoints with Postman/Insomnia
- Contact the backend development team

---

This integration guide provides a comprehensive foundation for connecting your Cleanaid Admin Dashboard with your Node.js/Express API. Follow these steps to ensure a smooth integration process.
