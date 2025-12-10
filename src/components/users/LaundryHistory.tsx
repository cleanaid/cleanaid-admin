"use client"

import { useState, useMemo } from "react"
import { Search, Eye } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pagination } from "@/components/ui/pagination"
import { useRouter } from "next/navigation"

interface Order {
  _id: string
  orderId?: string
  business?: {
    name: string
    address: string
  }
  clothesCount?: number
  totalAmount?: number
  deliveryDate?: string | Date
  createdAt?: string | Date
  progressMilestone?: string
  status?: string
}

interface LaundryHistoryProps {
  orders: Order[]
  isLoading?: boolean
  pagination?: {
    totalOrders?: number
    currentPage?: number
    totalPages?: number
    pageSize?: number
    hasNextPage?: boolean
    hasPrevPage?: boolean
  }
  onPageChange?: (page: number) => void
}

const formatAmount = (amount: number | undefined): string => {
  if (!amount) return "₦0"
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (date: string | Date | undefined): string => {
  if (!date) return "N/A"
  try {
    const d = new Date(date)
    if (isNaN(d.getTime())) return "N/A"
    return d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    })
  } catch {
    return "N/A"
  }
}

const getStatusBadge = (status: string | undefined, milestone: string | undefined) => {
  const statusValue = status || milestone || "pending"
  
  if (statusValue === "complete" || statusValue === "delivered") {
    return <Badge className="bg-green-100 text-green-800 border-green-200">Delivered</Badge>
  }
  if (statusValue === "cloth_pickup" || statusValue === "picked_up") {
    return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Picked Up</Badge>
  }
  if (statusValue === "cloth_washed" || statusValue === "in_progress") {
    return <Badge className="bg-orange-100 text-orange-800 border-orange-200">In Progress</Badge>
  }
  if (statusValue === "canceled" || statusValue === "cancelled") {
    return <Badge className="bg-red-100 text-red-800 border-red-200">Canceled</Badge>
  }
  return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Pending</Badge>
}

export function LaundryHistory({ orders, isLoading, pagination, onPageChange }: LaundryHistoryProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [yearFilter, setYearFilter] = useState("all")
  const [monthFilter, setMonthFilter] = useState("all")
  const [dayFilter, setDayFilter] = useState("all")

  // Client-side filtering (search only, other filters should be backend)
  const filteredOrders = useMemo(() => {
    if (!searchQuery) return orders
    const query = searchQuery.toLowerCase()
    return orders.filter((order) => {
      return (
        order.orderId?.toLowerCase().includes(query) ||
        order.business?.name?.toLowerCase().includes(query) ||
        order._id?.toLowerCase().includes(query)
      )
    })
  }, [orders, searchQuery])

  // Extract pagination info
  const currentPage = pagination?.currentPage || 1
  const totalPages = pagination?.totalPages || 0
  const totalItems = pagination?.totalOrders || filteredOrders.length
  const itemsPerPage = pagination?.pageSize || 10

  const handlePageChange = (page: number) => {
    onPageChange?.(page)
  }

  const handleViewOrder = (orderId: string) => {
    router.push(`/dashboard/orders/${orderId}`)
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">Laundry History</h2>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading orders...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900">Laundry History</h2>
      
      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={locationFilter} onValueChange={setLocationFilter}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="lagos">Lagos</SelectItem>
            <SelectItem value="abuja">Abuja</SelectItem>
            <SelectItem value="port-harcourt">Port Harcourt</SelectItem>
          </SelectContent>
        </Select>

        <Select value={yearFilter} onValueChange={setYearFilter}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2024">2024</SelectItem>
            <SelectItem value="2023">2023</SelectItem>
          </SelectContent>
        </Select>

        <Select value={monthFilter} onValueChange={setMonthFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="january">January</SelectItem>
            <SelectItem value="february">February</SelectItem>
            <SelectItem value="march">March</SelectItem>
            <SelectItem value="april">April</SelectItem>
            <SelectItem value="may">May</SelectItem>
            <SelectItem value="june">June</SelectItem>
            <SelectItem value="july">July</SelectItem>
            <SelectItem value="august">August</SelectItem>
            <SelectItem value="september">September</SelectItem>
            <SelectItem value="october">October</SelectItem>
            <SelectItem value="november">November</SelectItem>
            <SelectItem value="december">December</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dayFilter} onValueChange={setDayFilter}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Day" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            {Array.from({ length: 31 }, (_, i) => (
              <SelectItem key={i + 1} value={String(i + 1)}>
                {i + 1}
                {i === 0 ? "st" : i === 1 ? "nd" : i === 2 ? "rd" : "th"}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="rounded-lg bg-white border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">I.D</TableHead>
                <TableHead className="font-semibold text-gray-700">Business name</TableHead>
                <TableHead className="font-semibold text-gray-700">Address</TableHead>
                <TableHead className="font-semibold text-gray-700">No. of cloth</TableHead>
                <TableHead className="font-semibold text-gray-700">Price</TableHead>
                <TableHead className="font-semibold text-gray-700">Start/Delivery</TableHead>
                <TableHead className="font-semibold text-gray-700">Status</TableHead>
                <TableHead className="font-semibold text-gray-700">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => {
                  return (
                    <TableRow key={order._id}>
                      <TableCell className="font-medium">
                        {order.orderId || order._id.slice(-6)}
                      </TableCell>
                      <TableCell>{order.business?.name || "N/A"}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {order.business?.address || "N/A"}
                      </TableCell>
                      <TableCell>{order.clothesCount || 0}</TableCell>
                      <TableCell className="font-medium">
                        {formatAmount(order.totalAmount)}
                      </TableCell>
                      <TableCell>
                        {formatDate(order.createdAt)} / {formatDate(order.deliveryDate)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(order.status, order.progressMilestone)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleViewOrder(order._id)}
                        >
                          <Eye className="h-4 w-4 text-gray-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}

