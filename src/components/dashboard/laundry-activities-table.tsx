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

export interface LaundryActivity {
  id: string
  businessName: string
  address: string
  clothesCount: number
  price: string | number
  startDelivery: string // Format: "MM.DD.YYYY - MM.DD.YYYY"
  status: "picked_up" | "in_progress" | "ready" | "delivered" | "complain" | "canceled"
}

export interface LaundryActivitiesTableProps {
  title?: string
  activities: LaundryActivity[]
  onViewActivity?: (activityId: string) => void
  onSearch?: (query: string) => void
  onFilterChange?: (filter: string) => void
  className?: string
}

const statusColors = {
  picked_up: "bg-yellow-100 text-yellow-800",
  in_progress: "bg-orange-100 text-orange-800",
  ready: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  complain: "bg-red-100 text-red-800",
  canceled: "bg-pink-100 text-pink-800",
}

const statusLabels = {
  picked_up: "Picked Up",
  in_progress: "In Progress",
  ready: "Ready",
  delivered: "Delivered",
  complain: "Complain",
  canceled: "Canceled",
}

export function LaundryActivitiesTable({
  title = "Laundry Activities",
  activities,
  onViewActivity,
  onSearch,
  onFilterChange,
  className,
}: LaundryActivitiesTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("Lagos")
  const [selectedYear, setSelectedYear] = useState("2025")
  const [selectedMonth, setSelectedMonth] = useState("October")
  const [selectedDay, setSelectedDay] = useState("15th")

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    onSearch?.(value)
  }

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value)
    onFilterChange?.(value)
  }

  const handleYearChange = (value: string) => {
    setSelectedYear(value)
  }

  const handleMonthChange = (value: string) => {
    setSelectedMonth(value)
  }

  const handleDayChange = (value: string) => {
    setSelectedDay(value)
  }

  const formatAmount = (amount: string | number) => {
    if (typeof amount === "string") {
      return amount
    }
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Filter activities based on search query
  const filteredActivities = activities.filter((activity) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      activity.id.toLowerCase().includes(query) ||
      activity.businessName.toLowerCase().includes(query) ||
      activity.address.toLowerCase().includes(query)
    )
  })

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

          {/* Filter Dropdowns */}
          <Select value={selectedLocation} onValueChange={handleLocationChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Lagos">Lagos</SelectItem>
              <SelectItem value="Abuja">Abuja</SelectItem>
              <SelectItem value="Port Harcourt">Port Harcourt</SelectItem>
              <SelectItem value="Kano">Kano</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedYear} onValueChange={handleYearChange}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2025">2025</SelectItem>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedMonth} onValueChange={handleMonthChange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="January">January</SelectItem>
              <SelectItem value="February">February</SelectItem>
              <SelectItem value="March">March</SelectItem>
              <SelectItem value="April">April</SelectItem>
              <SelectItem value="May">May</SelectItem>
              <SelectItem value="June">June</SelectItem>
              <SelectItem value="July">July</SelectItem>
              <SelectItem value="August">August</SelectItem>
              <SelectItem value="September">September</SelectItem>
              <SelectItem value="October">October</SelectItem>
              <SelectItem value="November">November</SelectItem>
              <SelectItem value="December">December</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedDay} onValueChange={handleDayChange}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                <SelectItem key={day} value={`${day}th`}>
                  {day}th
                </SelectItem>
              ))}
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
              <TableHead className="font-semibold text-gray-700">Business name</TableHead>
              <TableHead className="font-semibold text-gray-700">Address</TableHead>
              <TableHead className="font-semibold text-gray-700">No. of cloth</TableHead>
              <TableHead className="font-semibold text-gray-700">Price</TableHead>
              <TableHead className="font-semibold text-gray-700">Start/Delivery</TableHead>
              <TableHead className="font-semibold text-gray-700">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredActivities.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No activities found
                </TableCell>
              </TableRow>
            ) : (
              filteredActivities.map((activity) => (
                <TableRow key={activity.id}>
                  <TableCell className="font-medium">{activity.id}</TableCell>
                  <TableCell className="font-medium">{activity.businessName}</TableCell>
                  <TableCell>{activity.address}</TableCell>
                  <TableCell>{activity.clothesCount}</TableCell>
                  <TableCell className="font-medium">
                    {formatAmount(activity.price)}
                  </TableCell>
                  <TableCell>{activity.startDelivery}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={cn(
                          "rounded-full px-3 py-1 text-xs font-medium",
                          statusColors[activity.status]
                        )}
                      >
                        {statusLabels[activity.status]}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onViewActivity?.(activity.id)}
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

