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
import { Pagination } from "@/components/ui/pagination"
import { cn } from "@/lib/utils"

export interface Transaction {
  id: string
  transactionId: string
  description: string
  type: "credit" | "debit" | "refund"
  amount: string | number
}

export interface TransactionsTableProps {
  title?: string
  transactions: Transaction[]
  onViewTransaction?: (transactionId: string) => void
  onSearch?: (query: string) => void
  onFilterChange?: (filter: string) => void
  className?: string
  currentPage?: number
  limit?: number
}

export function TransactionsTable({
  title = "List of Transactions",
  transactions,
  onViewTransaction,
  onSearch,
  onFilterChange,
  className,
  currentPage: externalCurrentPage,
  limit = 10,
}: TransactionsTableProps) {
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

  const getTypeColor = (type: "credit" | "debit" | "refund") => {
    switch (type) {
      case "credit":
        return "text-blue-600"
      case "debit":
        return "text-blue-600"
      case "refund":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  // Filter transactions based on search query
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return (
        transaction.transactionId.toLowerCase().includes(query) ||
        transaction.description.toLowerCase().includes(query) ||
        transaction.type.toLowerCase().includes(query)
      )
    })
  }, [transactions, searchQuery])

  // Calculate pagination
  const totalItems = filteredTransactions.length
  const totalPages = Math.ceil(totalItems / limit)
  const startIndex = (currentPage - 1) * limit
  const endIndex = startIndex + limit
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex)

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
              <TableHead className="font-semibold text-gray-700">Transaction ID</TableHead>
              <TableHead className="font-semibold text-gray-700">Desc.</TableHead>
              <TableHead className="font-semibold text-gray-700">Type</TableHead>
              <TableHead className="font-semibold text-gray-700">Amount</TableHead>
              <TableHead className="font-semibold text-gray-700">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedTransactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                  No transactions found
                </TableCell>
              </TableRow>
            ) : (
              paginatedTransactions.map((transaction, index) => {
                const serialNumber = startIndex + index + 1
                return (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{serialNumber}</TableCell>
                  <TableCell className="font-medium">{transaction.transactionId}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>
                    <span className={cn("font-medium capitalize", getTypeColor(transaction.type))}>
                      {transaction.type}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatAmount(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => onViewTransaction?.(transaction.transactionId)}
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

