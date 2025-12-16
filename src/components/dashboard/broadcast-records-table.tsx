"use client"

import { useState, useMemo, useEffect } from "react"
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
import { cn } from "@/lib/utils"
import { Broadcast } from "@/types/broadcast"

export interface BroadcastRecordsTableProps {
  title?: string
  broadcasts: Broadcast[]
  onViewBroadcast?: (broadcastId: string) => void
  onSearch?: (query: string) => void
  onFilterChange?: (filter: string) => void
  className?: string
  currentPage?: number
  limit?: number
  pagination?: {
    currentPage: number
    totalPages: number
    totalItems: number
    pageSize: number
  }
  onPageChange?: (page: number) => void
  isLoading?: boolean
}

const formatDate = (date: string | Date | undefined): string => {
  if (!date) return "N/A"
  try {
    const d = new Date(date)
    if (isNaN(d.getTime())) return "N/A"
    const day = d.getDate()
    const month = d.toLocaleDateString("en-US", { month: "short" })
    const year = d.getFullYear()
    const hours = d.getHours()
    const minutes = String(d.getMinutes()).padStart(2, "0")
    const ampm = hours >= 12 ? "PM" : "AM"
    const displayHours = hours % 12 || 12
    return `${day}th ${month} ${year} | ${displayHours}:${minutes}${ampm}`
  } catch {
    return "N/A"
  }
}

const getStatusBadge = (status: string) => {
  switch (status) {
    case "delivered":
      return (
        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
          Delivered
        </Badge>
      )
    case "pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
          Pending
        </Badge>
      )
    case "failed":
      return (
        <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
          Failed
        </Badge>
      )
    default:
      return (
        <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">
          {status}
        </Badge>
      )
  }
}

const formatDeliveryChannels = (channels: string[]): string => {
  return channels
    .map((ch) => {
      switch (ch) {
        case "email":
          return "Email"
        case "sms":
          return "SMS"
        case "in_app":
          return "In-App"
        case "lock_screen":
          return "Lock Screen"
        default:
          return ch
      }
    })
    .join(", ")
}

export function BroadcastRecordsTable({
  title = "Records of Broadcast",
  broadcasts,
  onViewBroadcast,
  onSearch,
  onFilterChange,
  className,
  currentPage: externalCurrentPage,
  limit = 10,
  pagination,
  onPageChange,
  isLoading = false,
}: BroadcastRecordsTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("Lagos")
  const [selectedYear, setSelectedYear] = useState("2025")
  const [selectedMonth, setSelectedMonth] = useState("October")
  const [selectedDay, setSelectedDay] = useState("15th")
  const [internalCurrentPage, setInternalCurrentPage] = useState(1)

  // Use external page if provided, otherwise use internal state
  const currentPage = externalCurrentPage || internalCurrentPage || pagination?.currentPage || 1
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const setCurrentPage = externalCurrentPage ? () => {} : setInternalCurrentPage

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

  // Filter broadcasts based on search query
  const filteredBroadcasts = useMemo(() => {
    return broadcasts.filter((broadcast) => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return (
        broadcast.title?.toLowerCase().includes(query) ||
        broadcast.content?.toLowerCase().includes(query) ||
        broadcast._id?.toLowerCase().includes(query)
      )
    })
  }, [broadcasts, searchQuery])

  // Calculate pagination if not provided externally
  const totalItems = pagination?.totalItems || filteredBroadcasts.length
  const totalPages = pagination?.totalPages || Math.ceil(totalItems / limit)
  const startIndex = (currentPage - 1) * limit
  const endIndex = startIndex + limit
  const paginatedBroadcasts = pagination
    ? filteredBroadcasts
    : filteredBroadcasts.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  useEffect(() => {
    if (!externalCurrentPage && !pagination) {
      setInternalCurrentPage(1)
    }
  }, [searchQuery, selectedLocation, selectedYear, selectedMonth, selectedDay, externalCurrentPage, pagination])

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page)
    } else if (!externalCurrentPage && !pagination) {
      setInternalCurrentPage(page)
    }
  }

  const handleViewBroadcast = (broadcastId: string) => {
    onViewBroadcast?.(broadcastId)
  }

  return (
    <div className={cn("space-y-4", className)}>
      <h2 className="text-xl font-semibold text-gray-900">{title}</h2>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>

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

      {/* Table */}
      <div className="rounded-lg bg-white border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="font-semibold text-gray-700">S/N</TableHead>
                <TableHead className="font-semibold text-gray-700">Date</TableHead>
                <TableHead className="font-semibold text-gray-700">Receiver Type</TableHead>
                <TableHead className="font-semibold text-gray-700">Title</TableHead>
                <TableHead className="font-semibold text-gray-700">Location</TableHead>
                <TableHead className="font-semibold text-gray-700">Delivery Status</TableHead>
                <TableHead className="font-semibold text-gray-700">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedBroadcasts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                    No broadcasts found
                  </TableCell>
                </TableRow>
              ) : (
                paginatedBroadcasts.map((broadcast, index) => {
                  const serialNumber = pagination
                    ? (pagination.currentPage - 1) * pagination.pageSize + index + 1
                    : startIndex + index + 1
                  return (
                    <TableRow key={broadcast._id}>
                      <TableCell className="font-medium">{serialNumber}</TableCell>
                      <TableCell>{formatDate(broadcast.scheduledDate || broadcast.createdAt)}</TableCell>
                      <TableCell>
                        {broadcast.receiverType === "specific_user"
                          ? "Specific user"
                          : "General"}
                      </TableCell>
                      <TableCell>{broadcast.title}</TableCell>
                      <TableCell>
                        {formatDeliveryChannels(broadcast.deliveryChannels)}
                      </TableCell>
                      <TableCell>{getStatusBadge(broadcast.status)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleViewBroadcast(broadcast._id)}
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
          itemsPerPage={limit}
          onPageChange={handlePageChange}
          isLoading={isLoading}
        />
      )}
    </div>
  )
}

