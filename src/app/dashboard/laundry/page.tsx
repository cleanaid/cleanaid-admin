"use client"

import { useState, useMemo } from "react"
import { ShoppingCart, CheckCircle, XCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { UserStatCard, LaundryActivitiesTable, type LaundryActivity } from "@/components/dashboard"
import { useOrders, useOrderStats } from "@/api/hooks"
import type { ApiResponse } from "@/api/api-client"

// Backend order response structure
interface BackendOrder {
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
  progressMilestone: 'pending' | 'accept_offer' | 'validate_info' | 'cloth_pickup' | 'cloth_washed' | 'complete'
  isNewOrder: boolean
  hasExpired: boolean
  deliveryDate: string | Date
  createdAt: string | Date
  clothesCount?: number
  pickupDate?: string | Date
}

/**
 * calculateTrend - Calculates the percentage change and direction between two values
 */
const calculateTrend = (
  currentValue: number,
  previousValue: number
): { percentage: number; direction: "up" | "down" } => {
  if (previousValue === 0) {
    return { percentage: currentValue > 0 ? 100 : 0, direction: currentValue > 0 ? "up" : "down" }
  }
  
  const change = ((currentValue - previousValue) / previousValue) * 100
  const percentage = Math.abs(change)
  const direction = change >= 0 ? "up" : "down"
  
  return { percentage: Math.round(percentage * 10) / 10, direction }
}

// Get yesterday's date key for localStorage
const getYesterdayKey = () => {
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  return `laundry_metrics_${yesterday.toISOString().split('T')[0]}`
}

// Get today's date key for localStorage
const getTodayKey = () => {
  return `laundry_metrics_${new Date().toISOString().split('T')[0]}`
}

export default function LaundryPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch order statistics
  const { data: statsResponse, isLoading: statsLoading } = useOrderStats()
  
  // Fetch orders list - using the same endpoint as dashboard
  const { data: ordersResponse, isLoading: ordersLoading } = useOrders({
    page: 1,
    limit: 100,
  })

  const isLoading = statsLoading || ordersLoading

  // Extract stats from API response
  const stats = useMemo(() => {
    if (!statsResponse || typeof statsResponse !== 'object') {
      return { 
        total: 0, 
        pending: 0, 
        inProgress: 0, 
        completed: 0, 
        cancelled: 0, 
        revenue: 0 
      }
    }

    // Handle both wrapped and direct responses
    if ('data' in statsResponse && statsResponse.data) {
      return statsResponse.data as {
        total: number
        pending: number
        inProgress: number
        completed: number
        cancelled: number
        revenue: number
      }
    }
    
    // Direct response structure
    return statsResponse as {
      total: number
      pending: number
      inProgress: number
      completed: number
      cancelled: number
      revenue: number
    }
  }, [statsResponse])

  // Transform orders data for the Laundry Activities table
  const tableActivities: LaundryActivity[] = useMemo(() => {
    const ordersData = ordersResponse as ApiResponse<BackendOrder[]> | undefined
    if (!ordersData || !ordersData.data || !Array.isArray(ordersData.data)) return []

    return ordersData.data
      .filter((order: BackendOrder) => {
        if (!searchQuery) return true
        const query = searchQuery.toLowerCase()
        return (
          order.orderId?.toString().toLowerCase().includes(query) ||
          order.laundryBusiness?.name?.toLowerCase().includes(query) ||
          order.laundryBusiness?.address?.toLowerCase().includes(query) ||
          order.customer?.address?.toLowerCase().includes(query)
        )
      })
      .map((order: BackendOrder) => {
        const businessName = order.laundryBusiness?.name || "Unknown"
        const address = order.laundryBusiness?.address || order.customer?.address || "N/A"
        
        // Format Start/Delivery date range
        // Use pickupDate for start and deliveryDate for delivery
        let startDelivery = "N/A"
        const startDate = order.pickupDate || order.createdAt
        const endDate = order.deliveryDate
        
        if (startDate && endDate) {
          try {
            const start = new Date(startDate)
            const end = new Date(endDate)
            if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
              const formatDate = (date: Date) => {
                const month = String(date.getMonth() + 1).padStart(2, '0')
                const day = String(date.getDate()).padStart(2, '0')
                const year = date.getFullYear()
                return `${month}.${day}.${year}`
              }
              startDelivery = `${formatDate(start)} - ${formatDate(end)}`
            }
          } catch (error) {
            console.error('Error parsing dates:', error)
          }
        } else if (endDate) {
          // Fallback to deliveryDate only if pickupDate is not available
          try {
            const date = new Date(endDate)
            if (!isNaN(date.getTime())) {
              const month = String(date.getMonth() + 1).padStart(2, '0')
              const day = String(date.getDate()).padStart(2, '0')
              const year = date.getFullYear()
              startDelivery = `${month}.${day}.${year} - ${month}.${day}.${year}`
            }
          } catch (error) {
            console.error('Error parsing delivery date:', error, order.deliveryDate)
          }
        }
        
        // Map progressMilestone to laundry activity status
        let status: "picked_up" | "in_progress" | "ready" | "delivered" | "complain" | "canceled" = "in_progress"
        if (order.progressMilestone === "complete" && order.paymentStatus === "paid") {
          status = "delivered"
        } else if (order.hasExpired || order.paymentStatus === "failed") {
          status = "canceled"
        } else if (order.progressMilestone === "cloth_pickup") {
          status = "picked_up"
        } else if (order.progressMilestone === "cloth_washed") {
          status = "ready"
        } else if (order.progressMilestone === "validate_info" || order.progressMilestone === "accept_offer") {
          status = "in_progress"
        }
        // Note: "complain" status would need to be determined from order complaints data
        
        const amount = order.totalAmount || 0
        const formattedAmount = new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(amount)

        return {
          id: order.orderId?.toString() || "N/A",
          businessName: businessName,
          address: address,
          clothesCount: order.clothesCount || 0,
          price: formattedAmount,
          startDelivery: startDelivery,
          status: status,
        }
      })
  }, [ordersResponse, searchQuery])

  // Handle view activity
  const handleViewActivity = (activityId: string) => {
    router.push(`/dashboard/orders/${activityId}`)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Laundry Orders</h1>
          <p className="text-muted-foreground">
            Manage and monitor all laundry orders in the system.
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading laundry orders...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Laundry</h1>
        </div>
        {/* Date filters - can be added later if needed */}
        <div className="flex items-center gap-3">
          {/* Placeholder for date filters */}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <UserStatCard
          title="Total Wash"
          icon={ShoppingCart}
          iconBgColor="bg-blue-100"
          value={stats.total}
        />
        <UserStatCard
          title="Successful Wash"
          icon={CheckCircle}
          iconBgColor="bg-green-100"
          value={stats.completed}
        />
        <UserStatCard
          title="Unsuccessful Wash"
          icon={XCircle}
          iconBgColor="bg-orange-100"
          value={stats.cancelled}
        />
      </div>

      {/* Laundry Activities Table */}
      <LaundryActivitiesTable
        title="Laundry Activities"
        activities={tableActivities}
        onViewActivity={handleViewActivity}
        onSearch={setSearchQuery}
        onFilterChange={(filter) => {
          console.log("Filter changed:", filter)
        }}
      />
    </div>
  )
}

