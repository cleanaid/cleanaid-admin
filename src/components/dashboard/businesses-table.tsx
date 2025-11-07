"use client"

import { useState } from "react"
import { Search, Pencil } from "lucide-react"
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

export interface Business {
  id?: string
  businessNo?: string
  businessName: string
  ownerName: string
  ordersCount: number
  earnings: number
  isVerified: boolean
}

export interface BusinessesTableProps {
  title?: string
  businesses: Business[]
  onEditBusiness?: (businessId: string) => void
  onSearch?: (query: string) => void
  onFilterChange?: (filter: string) => void
  className?: string
}

export function BusinessesTable({
  title = "List of Users",
  businesses,
  onEditBusiness,
  onSearch,
  onFilterChange,
  className,
}: BusinessesTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [locationFilter, setLocationFilter] = useState("")
  const [yearFilter, setYearFilter] = useState("")
  const [monthFilter, setMonthFilter] = useState("")
  const [dayFilter, setDayFilter] = useState("")

  const handleSearch = (value: string) => {
    setSearchQuery(value)
    onSearch?.(value)
  }

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  // Filter businesses based on search query
  const filteredBusinesses = businesses.filter((business) => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      business.businessName?.toLowerCase().includes(query) ||
      business.ownerName?.toLowerCase().includes(query) ||
      business.businessNo?.toLowerCase().includes(query) ||
      business.id?.toLowerCase().includes(query)
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
        <div className="flex items-center gap-3">
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
          <Select value={locationFilter} onValueChange={(value) => {
            setLocationFilter(value)
            onFilterChange?.(value)
          }}>
            <SelectTrigger className="w-32">
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
            <SelectTrigger className="w-24">
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
            <SelectTrigger className="w-32">
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
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Day" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {Array.from({ length: 31 }, (_, i) => (
                <SelectItem key={i + 1} value={String(i + 1)}>
                  {i + 1}
                  {i === 0 ? 'st' : i === 1 ? 'nd' : i === 2 ? 'rd' : 'th'}
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
            <TableRow className="bg-gray-50">
              <TableHead className="font-semibold text-gray-700">S/N</TableHead>
              <TableHead className="font-semibold text-gray-700">Business No.</TableHead>
              <TableHead className="font-semibold text-gray-700">Business Name</TableHead>
              <TableHead className="font-semibold text-gray-700">Owner&apos;s Name</TableHead>
              <TableHead className="font-semibold text-gray-700">No. of orders</TableHead>
              <TableHead className="font-semibold text-gray-700">Earnings</TableHead>
              <TableHead className="font-semibold text-gray-700">Verify</TableHead>
              <TableHead className="font-semibold text-gray-700">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBusinesses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  No businesses found
                </TableCell>
              </TableRow>
            ) : (
              filteredBusinesses.map((business, index) => (
                <TableRow key={business.id || index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell>{business.businessNo || business.id || "N/A"}</TableCell>
                  <TableCell className="font-medium">{business.businessName}</TableCell>
                  <TableCell>{business.ownerName}</TableCell>
                  <TableCell>{business.ordersCount}</TableCell>
                  <TableCell className="font-medium">
                    {formatAmount(business.earnings)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={cn(
                        "rounded-full px-3 py-1 text-xs font-medium",
                        business.isVerified
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      )}
                    >
                      {business.isVerified ? "Verified" : "Unverified"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 rounded-full bg-gray-100 hover:bg-gray-200"
                      onClick={() => business.id && onEditBusiness?.(business.id)}
                    >
                      <Pencil className="h-4 w-4 text-gray-600" />
                    </Button>
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

