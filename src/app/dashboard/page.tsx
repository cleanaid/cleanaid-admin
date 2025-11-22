"use client"

import { useState, useMemo, useEffect } from "react"
import { Users, Building2, ShoppingCart } from "lucide-react"
import { useRouter } from "next/navigation"
import { MetricCard, OrdersTable, type Order as TableOrder } from "@/components/dashboard"
import { useAdminMetrics, useOrders } from "@/api/hooks"
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
}

/**
 * calculateTrend - Calculates the percentage change and direction between two values
 * 
 * This function compares today's metric value with yesterday's value to determine:
 * - The percentage change (how much it increased or decreased)
 * - The direction (up or down)
 * 
 * Formula: ((currentValue - previousValue) / previousValue) * 100
 * 
 * Examples:
 * - If yesterday had 10 users and today has 12: ((12-10)/10)*100 = 20% up
 * - If yesterday had 10 users and today has 8: ((8-10)/10)*100 = 20% down
 * - If yesterday had 0 users and today has 5: 100% up (special case)
 * 
 * @param currentValue - Today's metric value (e.g., total users today)
 * @param previousValue - Yesterday's metric value (e.g., total users yesterday)
 * @returns Object with percentage (absolute value) and direction ("up" or "down")
 */
const calculateTrend = (
  currentValue: number,
  previousValue: number
): { percentage: number; direction: "up" | "down" } => {
  if (previousValue === 0) {
    // If previous value is 0, any current value is 100% increase
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
  return `metrics_${yesterday.toISOString().split('T')[0]}`
}

// Get today's date key for localStorage
const getTodayKey = () => {
  return `metrics_${new Date().toISOString().split('T')[0]}`
}

export default function DashboardPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch dashboard data
  const { data: metricsData, isLoading: metricsLoading, error: metricsError } = useAdminMetrics()
  const { data: ordersResponse, isLoading: ordersLoading } = useOrders()

  const isLoading = metricsLoading || ordersLoading

  // Debug: Log the metrics data structure
  if (metricsData) {
    console.log('Metrics Data:', metricsData)
    console.log('Metrics Data Type:', typeof metricsData)
    console.log('Has data property:', metricsData && typeof metricsData === 'object' && 'data' in metricsData)
  }
  if (metricsError) {
    console.error('Metrics Error:', metricsError)
  }

  // Transform orders data for the table
  // Backend returns: { orderId, customer: { name, phone, email, address }, laundryBusiness: { name, address, ... }, totalAmount, deliveryDate, paymentStatus, progressMilestone, ... }
  const tableOrders: TableOrder[] = useMemo(() => {
    const ordersData = ordersResponse as ApiResponse<BackendOrder[]> | undefined
    if (!ordersData || !ordersData.data || !Array.isArray(ordersData.data)) return []

    return ordersData.data
      .filter((order: BackendOrder) => {
        if (!searchQuery) return true
        const query = searchQuery.toLowerCase()
        return (
          order.orderId?.toString().toLowerCase().includes(query) ||
          order.customer?.name?.toLowerCase().includes(query) ||
          order.customer?.email?.toLowerCase().includes(query) ||
          order.customer?.phone?.toLowerCase().includes(query) ||
          order.laundryBusiness?.address?.toLowerCase().includes(query) ||
          order.laundryBusiness?.name?.toLowerCase().includes(query) ||
          order.customer?.address?.toLowerCase().includes(query)
        )
      })
      .map((order: BackendOrder) => {
        // Map backend order structure to table format
        const userName = order.customer?.name || "Unknown"
        
        // Location from business address or customer address
        const location = order.laundryBusiness?.address || order.customer?.address || "N/A"
        
        // Format delivery date with proper time
        // Backend returns deliveryDate as Date or ISO string
        let deliveryDate = "N/A"
        if (order.deliveryDate) {
          try {
            const date = new Date(order.deliveryDate)
            // Check if date is valid
            if (!isNaN(date.getTime())) {
              // Format: MM.DD.YYYY - HH.MM AM/PM (matching the design)
              const month = String(date.getMonth() + 1).padStart(2, '0')
              const day = String(date.getDate()).padStart(2, '0')
              const year = date.getFullYear()
              const hours = date.getHours()
              const minutes = String(date.getMinutes()).padStart(2, '0')
              const ampm = hours >= 12 ? 'PM' : 'AM'
              const displayHours = hours % 12 || 12
              deliveryDate = `${month}.${day}.${year} - ${displayHours}.${minutes} ${ampm}`
            }
          } catch (error) {
            console.error('Error parsing delivery date:', error, order.deliveryDate)
          }
        }
        
        // Map paymentStatus and progressMilestone to table status
        let status: "delivered" | "processing" | "canceled" | "pending" = "pending"
        if (order.progressMilestone === "complete" && order.paymentStatus === "paid") {
          status = "delivered"
        } else if (order.hasExpired || order.paymentStatus === "failed") {
          status = "canceled"
        } else if (order.progressMilestone && order.progressMilestone !== "pending" && order.progressMilestone !== "complete") {
          status = "processing"
        } else {
          status = "pending"
        }
        
        // Format amount in naira (backend returns in naira, format with commas)
        const amount = order.totalAmount || 0
        const formattedAmount = new Intl.NumberFormat('en-NG', {
          style: 'currency',
          currency: 'NGN',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(amount)

        return {
          id: order.orderId?.toString() || "N/A",
          user: userName,
          location: location,
          deliveryDate: deliveryDate,
          amount: formattedAmount, // Formatted as currency string
          status: status,
        }
      })
  }, [ordersResponse, searchQuery])

  // Handle view order
  const handleViewOrder = (orderId: string) => {
    router.push(`/dashboard/orders/${orderId}`)
  }

  // Prepare metric cards data from the API response
  // The backend returns data directly: { users: {...}, businesses: {...}, laundryOrder: {...} }
  // But the API client might wrap it in ApiResponse: { data: {...}, success: true }
  // Handle both cases
  let usersData: { active: number; inactive: number; returning: number } | undefined
  let businessesData: { active: number; inactive: number; returning: number } | undefined
  let laundryOrderData: { active: number; successful: number; canceled: number } | undefined

  if (metricsData && typeof metricsData === 'object') {
    // Check if response is wrapped in ApiResponse structure
    if ('data' in metricsData && metricsData.data) {
      // Wrapped response: { data: { users: {...}, ... }, success: true }
      const data = (metricsData as ApiResponse<{
        users: { active: number; inactive: number; returning: number }
        businesses: { active: number; inactive: number; returning: number }
        laundryOrder: { active: number; successful: number; canceled: number }
      }>).data
      usersData = data?.users
      businessesData = data?.businesses
      laundryOrderData = data?.laundryOrder
    } else {
      // Direct response: { users: {...}, businesses: {...}, laundryOrder: {...} }
      const directData = metricsData as {
        users?: { active: number; inactive: number; returning: number }
        businesses?: { active: number; inactive: number; returning: number }
        laundryOrder?: { active: number; successful: number; canceled: number }
      }
      usersData = directData?.users
      businessesData = directData?.businesses
      laundryOrderData = directData?.laundryOrder
    }
  }

  // Calculate totals (sum of all categories, as they represent different states)
  // Note: These categories may overlap (e.g., returning users are also active)
  // But for display purposes, we sum them to show total counts
  const totalUsers =
    (usersData?.active || 0) + (usersData?.inactive || 0) + (usersData?.returning || 0)
  const totalBusinesses =
    (businessesData?.active || 0) +
    (businessesData?.inactive || 0) +
    (businessesData?.returning || 0)
  const totalOrders =
    (laundryOrderData?.active || 0) +
    (laundryOrderData?.successful || 0) +
    (laundryOrderData?.canceled || 0)

  // Store today's metrics and get yesterday's for trend calculation
  useEffect(() => {
    if (metricsData && typeof metricsData === 'object') {
      const todayMetrics = {
        users: usersData,
        businesses: businessesData,
        laundryOrder: laundryOrderData,
      }
      const todayKey = getTodayKey()
      if (typeof window !== 'undefined') {
        localStorage.setItem(todayKey, JSON.stringify(todayMetrics))
      }
    }
  }, [metricsData, usersData, businessesData, laundryOrderData])

  // Get yesterday's metrics from localStorage
  const getYesterdayMetrics = () => {
    if (typeof window === 'undefined') return null
    try {
      const yesterdayKey = getYesterdayKey()
      const stored = localStorage.getItem(yesterdayKey)
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  }

  const yesterdayMetrics = getYesterdayMetrics()

  // Calculate trends
  const usersTrend = useMemo(() => {
    const yesterdayTotal = yesterdayMetrics?.users
      ? (yesterdayMetrics.users.active || 0) + (yesterdayMetrics.users.inactive || 0) + (yesterdayMetrics.users.returning || 0)
      : 0
    return calculateTrend(totalUsers, yesterdayTotal)
  }, [totalUsers, yesterdayMetrics])

  const businessesTrend = useMemo(() => {
    const yesterdayTotal = yesterdayMetrics?.businesses
      ? (yesterdayMetrics.businesses.active || 0) + (yesterdayMetrics.businesses.inactive || 0) + (yesterdayMetrics.businesses.returning || 0)
      : 0
    return calculateTrend(totalBusinesses, yesterdayTotal)
  }, [totalBusinesses, yesterdayMetrics])

  const ordersTrend = useMemo(() => {
    const yesterdayTotal = yesterdayMetrics?.laundryOrder
      ? (yesterdayMetrics.laundryOrder.active || 0) + (yesterdayMetrics.laundryOrder.successful || 0) + (yesterdayMetrics.laundryOrder.canceled || 0)
      : 0
    return calculateTrend(totalOrders, yesterdayTotal)
  }, [totalOrders, yesterdayMetrics])

  const usersCard = {
    title: "No. of Users",
      icon: Users,
    iconColor: "text-blue-500",
    value: totalUsers,
    subMetrics: [
      {
        label: "Active",
        value: usersData?.active || 0,
        color: "green" as const,
      },
      {
        label: "Returning",
        value: usersData?.returning || 0,
        color: "yellow" as const,
      },
      {
        label: "Inactive",
        value: usersData?.inactive || 0,
        color: "pink" as const,
      },
    ],
    trend: usersTrend,
  }

  const businessesCard = {
    title: "No. of Businesses",
    icon: Building2,
    iconColor: "text-yellow-500",
    value: totalBusinesses,
    subMetrics: [
      {
        label: "Active",
        value: businessesData?.active || 0,
        color: "green" as const,
      },
      {
        label: "Returning",
        value: businessesData?.returning || 0,
        color: "yellow" as const,
      },
      {
        label: "Inactive",
        value: businessesData?.inactive || 0,
        color: "pink" as const,
      },
    ],
    trend: businessesTrend,
  }

  const ordersCard = {
    title: "No. of Orders",
    icon: ShoppingCart,
    iconColor: "text-orange-500",
    value: totalOrders,
    subMetrics: [
      {
        label: "Active",
        value: laundryOrderData?.active || 0,
        color: "yellow" as const,
      },
      {
        label: "Successful",
        value: laundryOrderData?.successful || 0,
        color: "green" as const,
      },
      {
        label: "Canceled",
        value: laundryOrderData?.canceled || 0,
        color: "pink" as const,
      },
    ],
    trend: ordersTrend,
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to the Cleanaid Admin Dashboard. Here&apos;s an overview of your platform.
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading dashboard metrics...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the Cleanaid Admin Dashboard. Here&apos;s an overview of your platform.
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard {...usersCard} />
        <MetricCard {...businessesCard} />
        <MetricCard {...ordersCard} />
      </div>

      {/* Orders Table */}
      <OrdersTable
        title="List of orders"
        orders={tableOrders}
        onViewOrder={handleViewOrder}
        onSearch={setSearchQuery}
        onFilterChange={(filter) => {
          // Handle filter change if needed
          console.log("Filter changed:", filter)
        }}
      />
    </div>
  )
}
