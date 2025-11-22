"use client"

import { useState } from "react"
import { useOrdersAnalytics, useUsersAnalytics, useRevenueAnalytics } from "@/api/hooks"
import { OrdersChart } from "@/components/analytics/orders-chart"
import { UsersChart } from "@/components/analytics/users-chart"
import { RevenueChart } from "@/components/analytics/revenue-chart"

export default function AnalyticsPage() {
  // Independent state for each chart
  const [ordersYear, setOrdersYear] = useState(new Date().getFullYear())
  const [usersYear, setUsersYear] = useState(new Date().getFullYear())
  const [usersLocation, setUsersLocation] = useState<string>("all")
  const [revenueYear, setRevenueYear] = useState(new Date().getFullYear())
  const [revenueLocation, setRevenueLocation] = useState<string>("all")

  // Fetch analytics data with independent filters
  const { data: ordersData, isLoading: ordersLoading } = useOrdersAnalytics(ordersYear)
  const { data: usersData, isLoading: usersLoading } = useUsersAnalytics(usersYear)
  const { data: revenueData, isLoading: revenueLoading } = useRevenueAnalytics(revenueYear)

  const isLoading = ordersLoading || usersLoading || revenueLoading

  // Extract data from API responses
  const ordersResponse = ordersData?.data || null
  const usersResponse = usersData?.data || null
  const revenueResponse = revenueData?.data || null

  // Generate year options (current year and previous 2 years)
  const yearOptions = Array.from({ length: 3 }, (_, i) => {
    const year = new Date().getFullYear() - i
    return year
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading analytics...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        </div>
      </div>

      {/* Total Orders Chart */}
      <OrdersChart
        data={ordersResponse?.monthlyData || []}
        summary={ordersResponse?.summary}
        year={ordersYear}
        onYearChange={setOrdersYear}
      />

      {/* Users Chart */}
      <UsersChart
        data={usersResponse?.monthlyData || []}
        summary={usersResponse?.summary}
        year={usersYear}
        location={usersLocation}
        onYearChange={setUsersYear}
        onLocationChange={setUsersLocation}
      />

      {/* Revenue Chart */}
      <RevenueChart
        data={revenueResponse?.monthlyData || []}
        summary={revenueResponse?.summary}
        year={revenueYear}
        location={revenueLocation}
        onYearChange={setRevenueYear}
        onLocationChange={setRevenueLocation}
      />
    </div>
  )
}
