"use client"

import { useState } from "react"
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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface Order {
  id: string
  user: string
  location: string
  deliveryDate: string
  amount: string | number
  status: "delivered" | "processing" | "canceled" | "pending"
}

export interface OrdersTableProps {
  title?: string
  orders: Order[]
  onViewOrder?: (orderId: string) => void
  onSearch?: (query: string) => void
  onFilterChange?: (filter: string) => void
  className?: string
}

const statusColors = {
  delivered: "bg-green-100 text-green-800",
  processing: "bg-yellow-100 text-yellow-800",
  canceled: "bg-red-100 text-red-800",
  pending: "bg-gray-100 text-gray-800",
}

const statusLabels = {
  delivered: "Delivered",
  processing: "Processing",
  canceled: "Canceled",
  pending: "Pending",
}

export function OrdersTable({
  title = "List of orders",
  orders,
  onViewOrder,
  onSearch,
  onFilterChange,
  className,
}: OrdersTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("October")

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    onSearch?.(value)
  }

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value)
    onFilterChange?.(value)
  }

  const formatAmount = (amount: string | number) => {
    // If it's already a formatted string (from dashboard), return as is
    if (typeof amount === "string") {
      return amount
    }
    // If it's a number, format as NGN (Nigerian Naira)
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div
      className={cn(
        "rounded-lg bg-white border border-gray-200 p-6",
        className
      )}
    >
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        <div className="flex md:flex-row flex-col items-center gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-9 w-64"
            />
          </div>

          {/* Filter Dropdown */}
          <Select value={selectedFilter} onValueChange={handleFilterChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="October">October</SelectItem>
              <SelectItem value="November">November</SelectItem>
              <SelectItem value="December">December</SelectItem>
              <SelectItem value="January">January</SelectItem>
              <SelectItem value="February">February</SelectItem>
              <SelectItem value="March">March</SelectItem>
              <SelectItem value="April">April</SelectItem>
              <SelectItem value="May">May</SelectItem>
              <SelectItem value="June">June</SelectItem>
              <SelectItem value="July">July</SelectItem>
              <SelectItem value="August">August</SelectItem>
              <SelectItem value="September">September</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold text-gray-700">I.D</TableHead>
              <TableHead className="font-semibold text-gray-700">User</TableHead>
              <TableHead className="font-semibold text-gray-700">
                Location
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Delivery Date
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Amount
              </TableHead>
              <TableHead className="font-semibold text-gray-700">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.user}</TableCell>
                  <TableCell>{order.location}</TableCell>
                  <TableCell>{order.deliveryDate}</TableCell>
                  <TableCell className="font-medium">
                    {formatAmount(order.amount)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-medium",
                          statusColors[order.status]
                        )}
                      >
                        {statusLabels[order.status]}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onViewOrder?.(order.id)}
                      >
                        <Eye className="h-4 w-4 text-gray-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

