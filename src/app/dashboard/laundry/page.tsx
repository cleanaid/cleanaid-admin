"use client"

import { useState, useMemo } from "react"
import { ShoppingCart, CheckCircle, XCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { UserStatCard, LaundryActivitiesTable, type LaundryActivity } from "@/components/dashboard"
import { useOrders, useOrderStats } from "@/api/hooks"
import { Button } from "@/components/ui/button"
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

export default function LaundryPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 10

  // Fetch order statistics
  const { data: statsResponse, isLoading: statsLoading } = useOrderStats()
  
  // Fetch orders list with pagination
  const { data: ordersResponse, isLoading: ordersLoading } = useOrders({
    page: currentPage,
    limit: limit,
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

  // Extract pagination info from API response
  const { orders, totalPages, totalOrders } = useMemo(() => {
    if (!ordersResponse) {
      return { orders: [], totalPages: 0, totalOrders: 0 }
    }

    const ordersData = ordersResponse as ApiResponse<BackendOrder[]>
    const ordersList = ordersData.data || []
    const pagination = ordersData.pagination as {
      totalOrders?: number
      currentPage?: number
      totalPages?: number
      pageSize?: number
      hasNextPage?: boolean
      hasPrevPage?: boolean
    } | undefined

    return {
      orders: Array.isArray(ordersList) ? ordersList : [],
      totalPages: pagination?.totalPages || 0,
      totalOrders: pagination?.totalOrders || 0,
    }
  }, [ordersResponse])

  // Transform orders data for the Laundry Activities table
  const tableActivities: LaundryActivity[] = useMemo(() => {
    if (!orders || orders.length === 0) return []

    return orders
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
  }, [orders, searchQuery])

  // Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

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

      {/* Pagination Controls */}
      {totalPages > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-sm text-gray-700">
            Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalOrders)} of {totalOrders} orders
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1 || isLoading}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    disabled={isLoading}
                    className="min-w-[40px]"
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages || isLoading}
              className="flex items-center gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

