"use client"

import { useState, useMemo, useEffect } from "react"
import { Search } from "lucide-react"
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
import { Pagination } from "@/components/ui/pagination"
import { cn } from "@/lib/utils"

export interface Payout {
  id: string
  businessId: string
  businessName: string
  ordersCount: number
  payoutsCount: number
  timer: string // Format: "HH:MM:SS"
  timerColor: "green" | "yellow" | "black" // Color based on time remaining
}

export interface PayoutsTableProps {
  title?: string
  payouts: Payout[]
  onIssuePayout?: (payoutId: string) => void
  onSearch?: (query: string) => void
  onFilterChange?: (filter: string) => void
  className?: string
  currentPage?: number
  limit?: number
}

export function PayoutsTable({
  title = "List of Payouts",
  payouts,
  onIssuePayout,
  onSearch,
  onFilterChange,
  className,
  currentPage: externalCurrentPage,
  limit = 10,
}: PayoutsTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("Lagos")
  const [selectedYear, setSelectedYear] = useState("2025")
  const [selectedMonth, setSelectedMonth] = useState("October")
  const [selectedDay, setSelectedDay] = useState("15th")
  const [internalCurrentPage, setInternalCurrentPage] = useState(1)
  
  // Use external page if provided, otherwise use internal state
  const currentPage = externalCurrentPage || internalCurrentPage
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

  // Filter payouts based on search query
  const filteredPayouts = useMemo(() => {
    return payouts.filter((payout) => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return (
        payout.id.toLowerCase().includes(query) ||
        payout.businessId.toLowerCase().includes(query) ||
        payout.businessName.toLowerCase().includes(query)
      )
    })
  }, [payouts, searchQuery])

  // Calculate pagination
  const totalItems = filteredPayouts.length
  const totalPages = Math.ceil(totalItems / limit)
  const startIndex = (currentPage - 1) * limit
  const endIndex = startIndex + limit
  const paginatedPayouts = filteredPayouts.slice(startIndex, endIndex)

  // Reset to page 1 when filters change
  useEffect(() => {
    if (!externalCurrentPage) {
      setInternalCurrentPage(1)
    }
  }, [searchQuery, selectedLocation, selectedYear, selectedMonth, selectedDay, externalCurrentPage])

  const handlePageChange = (page: number) => {
    if (!externalCurrentPage) {
      setInternalCurrentPage(page)
    }
  }

  const getTimerBorderColor = (color: "green" | "yellow" | "black") => {
    switch (color) {
      case "green":
        return "border-green-500"
      case "yellow":
        return "border-yellow-500"
      case "black":
        return "border-black"
      default:
        return "border-gray-300"
    }
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
              <TableHead className="font-semibold text-gray-700">S/N</TableHead>
              <TableHead className="font-semibold text-gray-700">Business ID</TableHead>
              <TableHead className="font-semibold text-gray-700">Business name</TableHead>
              <TableHead className="font-semibold text-gray-700">No. of Order</TableHead>
              <TableHead className="font-semibold text-gray-700">No. of Payouts</TableHead>
              <TableHead className="font-semibold text-gray-700">Timer</TableHead>
              <TableHead className="font-semibold text-gray-700">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedPayouts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                  No payouts found
                </TableCell>
              </TableRow>
            ) : (
              paginatedPayouts.map((payout, index) => {
                const serialNumber = startIndex + index + 1
                return (
                <TableRow key={payout.id}>
                  <TableCell className="font-medium">{serialNumber}</TableCell>
                  <TableCell className="font-medium">{payout.businessId}</TableCell>
                  <TableCell className="font-medium">{payout.businessName}</TableCell>
                  <TableCell>{payout.ordersCount}</TableCell>
                  <TableCell>{payout.payoutsCount}</TableCell>
                  <TableCell>
                    <div
                      className={cn(
                        "inline-flex items-center justify-center rounded-full border-2 px-4 py-1 text-sm font-medium",
                        getTimerBorderColor(payout.timerColor)
                      )}
                    >
                      {payout.timer}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => onIssuePayout?.(payout.id)}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      Issue Payout
                    </Button>
                  </TableCell>
                </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && !externalCurrentPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={limit}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}

