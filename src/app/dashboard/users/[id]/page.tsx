"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUser, useUserOrders } from "@/api/hooks"
import { UserInfoCard } from "@/components/users/UserInfoCard"
import { LaundryHistory } from "@/components/users/LaundryHistory"
import type { ApiResponse } from "@/api/api-client"
import { useMemo, useState } from "react"

interface UserData {
  _id?: string
  id?: string
  fullName?: string
  name?: string
  emailAddress?: string
  email?: string
  phoneNumber?: string
  phone?: string
  avatar?: string
  location?: {
    formattedAddress?: string
  }
  transaction?: number
  orderCount?: number
}

interface Order {
  _id: string
  orderId?: string
  totalAmount?: number
  progressMilestone?: string
  status?: string
  business?: {
    name: string
    address: string
  }
  clothesCount?: number
  deliveryDate?: string | Date
  createdAt?: string | Date
}

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 10

  const { data: userResponse, isLoading: userLoading, error: userError } = useUser(userId)
  const { data: ordersResponse, isLoading: ordersLoading } = useUserOrders(userId, { page: currentPage, limit })

  // Handle both wrapped and direct responses
  const userData = useMemo(() => {
    if (!userResponse) return null
    // Check if it's already wrapped in ApiResponse
    if (userResponse && typeof userResponse === 'object' && 'data' in userResponse && userResponse.data) {
      return userResponse.data as UserData
    }
    // Otherwise, it's the direct user data
    return userResponse as UserData
  }, [userResponse])

  const { orders, pagination } = useMemo(() => {
    if (!ordersResponse) return { orders: [], pagination: undefined }
    // Check if it's already wrapped in ApiResponse
    if (ordersResponse && typeof ordersResponse === 'object' && 'data' in ordersResponse && Array.isArray(ordersResponse.data)) {
      const response = ordersResponse as ApiResponse<Order[]>
      return {
        orders: response.data || [],
        pagination: response.pagination as {
          totalOrders?: number
          currentPage?: number
          totalPages?: number
          pageSize?: number
          hasNextPage?: boolean
          hasPrevPage?: boolean
        } | undefined
      }
    }
    // Otherwise, it's the direct array (fallback for backward compatibility)
    return {
      orders: Array.isArray(ordersResponse) ? ordersResponse as Order[] : [],
      pagination: undefined
    }
  }, [ordersResponse])

  // Calculate order statistics
  const orderStats = useMemo(() => {
    const totalOrders = orders.length
    const totalAmount = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0)
    
    const successfulOrders = orders.filter(
      (order) => order.progressMilestone === "complete" || order.status === "complete"
    )
    const successfulAmount = successfulOrders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    )
    
    const canceledOrders = orders.filter(
      (order) => order.progressMilestone === "canceled" || order.status === "canceled"
    )
    const canceledAmount = canceledOrders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    )

    return {
      totalOrders,
      totalAmount,
      successfulOrders: successfulOrders.length,
      successfulAmount,
      canceledOrders: canceledOrders.length,
      canceledAmount,
    }
  }, [orders])

  // Prepare user info for UserInfoCard
  const userInfo = useMemo(() => {
    if (!userData) return null

    return {
      id: userData._id || userData.id || userId,
      name: userData.fullName || userData.name || "Unknown",
      avatar: userData.avatar,
      email: userData.emailAddress || userData.email || "N/A",
      phone: userData.phoneNumber || userData.phone || "N/A",
      address: userData.location?.formattedAddress || "N/A",
    }
  }, [userData, userId])

  // Mock reward metrics (can be replaced with actual API call)
  const rewardMetrics = useMemo(() => {
    const target = 300600.35
    const amountSpent = orderStats.totalAmount || 70688.35
    return {
      target,
      amountSpent,
      reward: "5% Discount on 5 Orders",
      status: "In Progress",
    }
  }, [orderStats.totalAmount])

  if (userLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="mt-2 text-muted-foreground">Loading user details...</p>
          </div>
        </div>
      </div>
    )
  }

  // Debug logging in development
  if (process.env.NODE_ENV === "development") {
    console.log("User Response:", userResponse)
    console.log("User Data:", userData)
    console.log("User Info:", userInfo)
    console.log("User Error:", userError)
  }

  if (userError) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">
            Error: {userError instanceof Error ? userError.message : "Unknown error"}
          </p>
          {process.env.NODE_ENV === "development" && (
            <p className="text-xs text-gray-400 mt-2">User ID: {userId}</p>
          )}
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  if (!userData || !userInfo) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
          <p className="text-gray-500 mb-2">
            User not found or error loading user details.
          </p>
          {process.env.NODE_ENV === "development" && (
            <div className="text-xs text-gray-400 mt-2 space-y-1">
              <p>User ID: {userId}</p>
              <p>Has userData: {userData ? "Yes" : "No"}</p>
              <p>Has userInfo: {userInfo ? "Yes" : "No"}</p>
            </div>
          )}
          <Button onClick={() => router.back()} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-10 w-10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">User Details</h1>
      </div>

      {/* User Information Section */}
      <UserInfoCard
        user={userInfo}
        orderStats={orderStats}
        rewardMetrics={rewardMetrics}
        onHistoryClick={() => router.push(`/dashboard/users/${userId}/reward-history`)}
      />

      {/* Laundry History Section */}
      <LaundryHistory 
        orders={orders} 
        isLoading={ordersLoading}
        pagination={pagination}
        onPageChange={setCurrentPage}
      />
    </div>
  )
}

