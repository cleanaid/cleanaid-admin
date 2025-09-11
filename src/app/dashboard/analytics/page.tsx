"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Calendar, TrendingUp, Users, Building2, ShoppingCart, DollarSign, Download } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AnalyticsData, VendorAnalytics, UserAnalytics, AnalyticsFilters } from "@/types/analytics"
import { formatCurrency } from "@/lib/utils"

// Mock data - will be replaced with real API calls
const mockAnalyticsData: AnalyticsData[] = [
  { date: "2024-01-01", users: 120, businesses: 45, orders: 89, revenue: 4450 },
  { date: "2024-01-02", users: 135, businesses: 47, orders: 95, revenue: 4750 },
  { date: "2024-01-03", users: 142, businesses: 49, orders: 102, revenue: 5100 },
  { date: "2024-01-04", users: 158, businesses: 52, orders: 118, revenue: 5900 },
  { date: "2024-01-05", users: 165, businesses: 54, orders: 125, revenue: 6250 },
  { date: "2024-01-06", users: 172, businesses: 56, orders: 132, revenue: 6600 },
  { date: "2024-01-07", users: 180, businesses: 58, orders: 140, revenue: 7000 },
]

const mockVendorAnalytics: VendorAnalytics[] = [
  {
    businessId: "1",
    businessName: "Sparkle Clean Services",
    totalOrders: 45,
    totalRevenue: 2250,
    averageRating: 4.8,
    completionRate: 98,
  },
  {
    businessId: "2",
    businessName: "Pro Maintenance Co",
    totalOrders: 32,
    totalRevenue: 1600,
    averageRating: 4.6,
    completionRate: 95,
  },
  {
    businessId: "3",
    businessName: "Elite Cleaning Solutions",
    totalOrders: 28,
    totalRevenue: 1400,
    averageRating: 4.4,
    completionRate: 92,
  },
  {
    businessId: "4",
    businessName: "Quick Fix Services",
    totalOrders: 22,
    totalRevenue: 1100,
    averageRating: 4.2,
    completionRate: 88,
  },
]

const mockUserAnalytics: UserAnalytics[] = [
  {
    userId: "1",
    userName: "John Doe",
    totalOrders: 12,
    totalSpent: 450,
    averageOrderValue: 37.5,
    lastOrderDate: "2024-01-20",
  },
  {
    userId: "2",
    userName: "Jane Smith",
    totalOrders: 8,
    totalSpent: 320,
    averageOrderValue: 40,
    lastOrderDate: "2024-01-19",
  },
  {
    userId: "3",
    userName: "Mike Johnson",
    totalOrders: 15,
    totalSpent: 600,
    averageOrderValue: 40,
    lastOrderDate: "2024-01-18",
  },
  {
    userId: "4",
    userName: "Sarah Wilson",
    totalOrders: 6,
    totalSpent: 240,
    averageOrderValue: 40,
    lastOrderDate: "2024-01-17",
  },
]


export default function AnalyticsPage() {
  const [filters, setFilters] = useState<AnalyticsFilters>({
    dateRange: {
      from: "2024-01-01",
      to: "2024-01-07",
    },
  })

  // Mock API calls - will be replaced with real useQuery
  const { data: analyticsData = [], isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ['analytics', filters],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return mockAnalyticsData
    },
  })

  const { data: vendorAnalytics = [], isLoading: isLoadingVendors } = useQuery({
    queryKey: ['vendor-analytics', filters],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return mockVendorAnalytics
    },
  })

  const { data: userAnalytics = [], isLoading: isLoadingUsers } = useQuery({
    queryKey: ['user-analytics', filters],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return mockUserAnalytics
    },
  })

  const isLoading = isLoadingAnalytics || isLoadingVendors || isLoadingUsers

  const handleExportData = () => {
    // Export functionality would be implemented here
    console.log("Exporting analytics data...")
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground">
            View detailed analytics and insights for your platform.
          </p>
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
          <p className="text-muted-foreground">
            View detailed analytics and insights for your platform.
          </p>
        </div>
        <Button onClick={handleExportData} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Date Range Filter */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>Date Range Filter</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="space-y-2">
              <Label htmlFor="from-date">From Date</Label>
              <Input
                id="from-date"
                type="date"
                value={filters.dateRange.from}
                onChange={(e) => setFilters({
                  ...filters,
                  dateRange: { ...filters.dateRange, from: e.target.value }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="to-date">To Date</Label>
              <Input
                id="to-date"
                type="date"
                value={filters.dateRange.to}
                onChange={(e) => setFilters({
                  ...filters,
                  dateRange: { ...filters.dateRange, to: e.target.value }
                })}
              />
            </div>
            <div className="space-y-2">
              <Label>Business Type</Label>
              <Select
                value={filters.businessType || "all"}
                onValueChange={(value) => setFilters({
                  ...filters,
                  businessType: value === "all" ? undefined : value
                })}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="cleaning">Cleaning</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData[analyticsData.length - 1]?.users || 0}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData[analyticsData.length - 1]?.businesses || 0}</div>
            <p className="text-xs text-muted-foreground">
              +5.2% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsData[analyticsData.length - 1]?.orders || 0}</div>
            <p className="text-xs text-muted-foreground">
              +12.3% from last period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(analyticsData[analyticsData.length - 1]?.revenue || 0)}
            </div>
            <p className="text-xs text-muted-foreground">
              +18.2% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">General Analytics</TabsTrigger>
          <TabsTrigger value="vendors">Vendor Analytics</TabsTrigger>
          <TabsTrigger value="users">User Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          {/* Revenue Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Revenue Trend</span>
              </CardTitle>
              <CardDescription>
                Daily revenue over the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={analyticsData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Revenue']} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#12a87e"
                    fill="#12a87e"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Orders and Users Chart */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Orders Trend</CardTitle>
                <CardDescription>
                  Daily orders over the selected period
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="orders"
                      stroke="#12a87e"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Users & Businesses</CardTitle>
                <CardDescription>
                  User and business growth over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={analyticsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="users"
                      stroke="#12a87e"
                      strokeWidth={2}
                      name="Users"
                    />
                    <Line
                      type="monotone"
                      dataKey="businesses"
                      stroke="#059669"
                      strokeWidth={2}
                      name="Businesses"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="vendors" className="space-y-4">
          {/* Top Vendors Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Vendors</CardTitle>
              <CardDescription>
                Revenue by vendor for the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={vendorAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="businessName" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Revenue']} />
                  <Bar dataKey="totalRevenue" fill="#12a87e" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Vendor Performance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Vendor Performance Details</CardTitle>
              <CardDescription>
                Detailed performance metrics for each vendor
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium">Vendor</th>
                        <th className="text-left p-4 font-medium">Orders</th>
                        <th className="text-left p-4 font-medium">Revenue</th>
                        <th className="text-left p-4 font-medium">Rating</th>
                        <th className="text-left p-4 font-medium">Completion Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendorAnalytics.map((vendor) => (
                        <tr key={vendor.businessId} className="border-b">
                          <td className="p-4 font-medium">{vendor.businessName}</td>
                          <td className="p-4">{vendor.totalOrders}</td>
                          <td className="p-4">{formatCurrency(vendor.totalRevenue)}</td>
                          <td className="p-4">{vendor.averageRating.toFixed(1)} ⭐</td>
                          <td className="p-4">{vendor.completionRate}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          {/* User Spending Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Top Spending Users</CardTitle>
              <CardDescription>
                Total spending by user for the selected period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={userAnalytics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="userName" />
                  <YAxis />
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Total Spent']} />
                  <Bar dataKey="totalSpent" fill="#12a87e" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* User Analytics Table */}
          <Card>
            <CardHeader>
              <CardTitle>User Analytics Details</CardTitle>
              <CardDescription>
                Detailed analytics for each user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-medium">User</th>
                        <th className="text-left p-4 font-medium">Orders</th>
                        <th className="text-left p-4 font-medium">Total Spent</th>
                        <th className="text-left p-4 font-medium">Avg Order Value</th>
                        <th className="text-left p-4 font-medium">Last Order</th>
                      </tr>
                    </thead>
                    <tbody>
                      {userAnalytics.map((user) => (
                        <tr key={user.userId} className="border-b">
                          <td className="p-4 font-medium">{user.userName}</td>
                          <td className="p-4">{user.totalOrders}</td>
                          <td className="p-4">{formatCurrency(user.totalSpent)}</td>
                          <td className="p-4">{formatCurrency(user.averageOrderValue)}</td>
                          <td className="p-4">{user.lastOrderDate}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
