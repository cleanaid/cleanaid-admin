"use client"

import { useState, useMemo } from "react"
import { Users, UserX, RotateCcw } from "lucide-react"
import { useRouter } from "next/navigation"
import { UserStatCard, UsersTable, type TableUser } from "@/components/dashboard"
import { useUsers, useUserMetrics } from "@/api/hooks"
import type { ApiResponse } from "@/api/api-client"

// Backend user response structure
interface BackendUser {
  _id?: string
  fullName: string
  phoneNumber: string
  emailAddress?: string | null
  role: string
  status: string
  lastLogin: string | Date
  isVerified: boolean
  transaction: number
  orderCount: number
}

export default function UsersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch user metrics (active, inactive, returning)
  const { data: metricsResponse, isLoading: metricsLoading } = useUserMetrics()

  // Fetch users list
  const { data: usersResponse, isLoading: usersLoading, error } = useUsers({
    page: 1,
    limit: 100, // Increase limit to show more users
  })

  const isLoading = metricsLoading || usersLoading

  // Extract metrics from API response
  const metrics = useMemo(() => {
    if (!metricsResponse || typeof metricsResponse !== 'object') {
      return { activeUsers: 0, inactiveUsers: 0, returningUsers: 0 }
    }

    // Handle both wrapped and direct responses
    if ('data' in metricsResponse && metricsResponse.data) {
      return metricsResponse.data as { activeUsers: number; inactiveUsers: number; returningUsers: number }
    }
    
    // Direct response structure
    const directData = metricsResponse as {
      activeUsers?: number
      inactiveUsers?: number
      returningUsers?: number
    }
    
    return {
      activeUsers: directData?.activeUsers || 0,
      inactiveUsers: directData?.inactiveUsers || 0,
      returningUsers: directData?.returningUsers || 0,
    }
  }, [metricsResponse])

  // Transform users data for the table
  const tableUsers: TableUser[] = useMemo(() => {
    const usersData = usersResponse as ApiResponse<BackendUser[]> | undefined
    if (!usersData || !usersData.data || !Array.isArray(usersData.data)) return []

    return usersData.data
      .filter((user: BackendUser) => {
        if (!searchQuery) return true
        const query = searchQuery.toLowerCase()
        return (
          user.fullName?.toLowerCase().includes(query) ||
          user.phoneNumber?.toLowerCase().includes(query) ||
          user.emailAddress?.toLowerCase().includes(query) ||
          user._id?.toLowerCase().includes(query)
        )
      })
      .map((user: BackendUser, index: number) => {
        // Format last seen date
        let lastSeen = "N/A"
        if (user.lastLogin) {
          try {
            const date = new Date(user.lastLogin)
            if (!isNaN(date.getTime())) {
              lastSeen = date.toISOString()
            }
          } catch (error) {
            console.error('Error parsing lastLogin:', error)
          }
        }

        return {
          id: user._id || user.phoneNumber || `user-${index}`,
          userNo: user.phoneNumber || user._id || `user-${index}`,
          name: user.fullName || "Unknown",
          ordersCount: user.orderCount || 0,
          spend: user.transaction || 0,
          lastSeen: lastSeen,
        }
      })
  }, [usersResponse, searchQuery])

  // Handle edit user
  const handleEditUser = (userId: string) => {
    // Navigate to user detail/edit page
    router.push(`/dashboard/users/${userId}`)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor all users on the platform.
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading users...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor all users on the platform.
          </p>
        </div>
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-red-800">
            Failed to load users. Please check your connection and try again.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor all users on the platform.
          </p>
        </div>
        {/* Date filters - can be added later if needed */}
        <div className="flex items-center gap-3">
          {/* Placeholder for date filters */}
        </div>
      </div>

      {/* User Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <UserStatCard
          title="Active Users"
          icon={Users}
          iconBgColor="bg-blue-100"
          value={metrics.activeUsers || 0}
        />
        <UserStatCard
          title="Returning Users"
          icon={RotateCcw}
          iconBgColor="bg-green-100"
          value={metrics.returningUsers || 0}
        />
        <UserStatCard
          title="Inactive Users"
          icon={UserX}
          iconBgColor="bg-orange-100"
          value={metrics.inactiveUsers || 0}
        />
      </div>

      {/* Users Table */}
      <UsersTable
        title="List of Users"
        users={tableUsers}
        onEditUser={handleEditUser}
        onSearch={setSearchQuery}
      />
    </div>
  )
}
