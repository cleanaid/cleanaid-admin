"use client"

import { useState, useMemo } from "react"
import { Building2, RotateCcw, Ban } from "lucide-react"
import { useRouter } from "next/navigation"
import { UserStatCard, BusinessesTable, type TableBusiness } from "@/components/dashboard"
import { useBusinesses, useBusinessMetrics } from "@/api/hooks"
import type { ApiResponse } from "@/api/api-client"

// Backend business response structure
interface BackendBusiness {
  _id?: string
  businessName: string
  owner?: {
    fullName?: string
    isVerified?: boolean
  }
  location?: string
  address?: string
  earnings: number
  totalOrders: number
  createdAt: string | Date
}

export default function BusinessesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch business metrics (active, inactive, returning)
  const { data: metricsResponse, isLoading: metricsLoading } = useBusinessMetrics()

  // Fetch businesses list
  const { data: businessesResponse, isLoading: businessesLoading, error } = useBusinesses({
    page: 1,
    limit: 100, // Increase limit to show more businesses
  })

  const isLoading = metricsLoading || businessesLoading

  // Extract metrics from API response
  const metrics = useMemo(() => {
    if (!metricsResponse || typeof metricsResponse !== 'object') {
      return { activeBusinesses: 0, inactiveBusinesses: 0, returningBusinesses: 0 }
    }

    // Handle both wrapped and direct responses
    if ('data' in metricsResponse && metricsResponse.data) {
      return metricsResponse.data as { activeBusinesses: number; inactiveBusinesses: number; returningBusinesses: number }
    }
    
    // Direct response structure
    const directData = metricsResponse as {
      activeBusinesses?: number
      inactiveBusinesses?: number
      returningBusinesses?: number
    }
    
    return {
      activeBusinesses: directData?.activeBusinesses || 0,
      inactiveBusinesses: directData?.inactiveBusinesses || 0,
      returningBusinesses: directData?.returningBusinesses || 0,
    }
  }, [metricsResponse])

  // Transform businesses data for the table
  const tableBusinesses: TableBusiness[] = useMemo(() => {
    const businessesData = businessesResponse as ApiResponse<BackendBusiness[]> | undefined
    if (!businessesData || !businessesData.data || !Array.isArray(businessesData.data)) return []

    return businessesData.data
      .filter((business: BackendBusiness) => {
        if (!searchQuery) return true
        const query = searchQuery.toLowerCase()
        return (
          business.businessName?.toLowerCase().includes(query) ||
          business.owner?.fullName?.toLowerCase().includes(query) ||
          business.address?.toLowerCase().includes(query) ||
          business._id?.toLowerCase().includes(query)
        )
      })
      .map((business: BackendBusiness, index: number) => {
        return {
          id: business._id || `business-${index}`,
          businessNo: business._id || `business-${index}`,
          businessName: business.businessName || "Unknown",
          ownerName: business.owner?.fullName || "Unknown",
          ordersCount: business.totalOrders || 0,
          earnings: business.earnings || 0,
          isVerified: business.owner?.isVerified || false,
        }
      })
  }, [businessesResponse, searchQuery])

  // Handle edit business
  const handleEditBusiness = (businessId: string) => {
    // Navigate to business detail/edit page
    router.push(`/dashboard/businesses/${businessId}`)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor all businesses on the platform.
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading businesses...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Business Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor all businesses on the platform.
          </p>
        </div>
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-red-800">
            Failed to load businesses. Please check your connection and try again.
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
          <h1 className="text-3xl font-bold tracking-tight">Business Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor all businesses on the platform.
          </p>
        </div>
        {/* Date filters - can be added later if needed */}
        <div className="flex items-center gap-3">
          {/* Placeholder for date filters */}
        </div>
      </div>

      {/* Business Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <UserStatCard
          title="Active Business"
          icon={Building2}
          iconBgColor="bg-blue-100"
          value={metrics.activeBusinesses || 0}
        />
        <UserStatCard
          title="Returning Business"
          icon={RotateCcw}
          iconBgColor="bg-green-100"
          value={metrics.returningBusinesses || 0}
        />
        <UserStatCard
          title="Inactive Business"
          icon={Ban}
          iconBgColor="bg-orange-100"
          value={metrics.inactiveBusinesses || 0}
        />
      </div>

      {/* Businesses Table */}
      <BusinessesTable
        title="List of Users"
        businesses={tableBusinesses}
        onEditBusiness={handleEditBusiness}
        onSearch={setSearchQuery}
      />
    </div>
  )
}
