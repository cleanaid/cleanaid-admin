"use client"

import { useParams, useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useUserRewardHistory } from "@/api/hooks"
import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
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
import { Pagination } from "@/components/ui/pagination"
import { Eye } from "lucide-react"
import type { ApiResponse } from "@/api/api-client"

interface RewardHistoryItem {
  _id: string
  orderId: string
  clothesCount: number
  rewardType: string
  totalAmount: number
  amountSaved: number
  startDate: string | Date
  endDate: string | Date
  status: string
  createdAt: string | Date
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
      month: "2-digit",
      year: "numeric",
    }).replace(/\//g, ".")
  } catch {
    return "N/A"
  }
}

const getStatusBadge = (status: string | undefined) => {
  const statusValue = status?.toLowerCase() || "pending"
  
  if (statusValue === "complete" || statusValue === "completed") {
    return <Badge className="bg-green-100 text-green-800 border-green-200">Completed</Badge>
  }
  if (statusValue === "in_progress") {
    return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">In Progress</Badge>
  }
  return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Pending</Badge>
}

export default function RewardHistoryPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [yearFilter, setYearFilter] = useState("all")
  const [monthFilter, setMonthFilter] = useState("all")
  const [dayFilter, setDayFilter] = useState("all")
  const limit = 10

  const { data: rewardHistoryResponse, isLoading } = useUserRewardHistory(
    userId,
    { page: currentPage, limit }
  )

  const { rewards, pagination, summary } = useMemo(() => {
    if (!rewardHistoryResponse) {
      return { rewards: [], pagination: undefined, summary: { totalRewards: 0, totalSaved: 0 } }
    }

    const response = rewardHistoryResponse as ApiResponse<RewardHistoryItem[]>
    const rewardsList = response.data || []
    const paginationData = response.pagination as {
      totalRewards?: number
      currentPage?: number
      totalPages?: number
      pageSize?: number
      hasNextPage?: boolean
      hasPrevPage?: boolean
    } | undefined

    // Calculate summary
    const totalRewards = rewardsList.length
    const totalSaved = rewardsList.reduce((sum, reward) => sum + (reward.amountSaved || 0), 0)

    return {
      rewards: Array.isArray(rewardsList) ? rewardsList : [],
      pagination: paginationData,
      summary: {
        totalRewards: paginationData?.totalRewards || totalRewards,
        totalSaved,
      },
    }
  }, [rewardHistoryResponse])

  // Client-side filtering (search only)
  const filteredRewards = useMemo(() => {
    if (!searchQuery) return rewards
    const query = searchQuery.toLowerCase()
    return rewards.filter((reward) => {
      return (
        reward.orderId?.toLowerCase().includes(query) ||
        reward._id?.toLowerCase().includes(query)
      )
    })
  }, [rewards, searchQuery])

  const handleViewOrder = (orderId: string) => {
    router.push(`/dashboard/orders/${orderId}`)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="mt-2 text-muted-foreground">Loading reward history...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="h-10 w-10"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">User Management | Reward History</h1>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Rewards Earned Card */}
        <Card className="bg-blue-50/50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Rewards Earned</p>
                <p className="text-3xl font-bold text-gray-900">{summary.totalRewards}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Amount Saved Card */}
        <Card className="bg-green-50/50 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Amount Saved</p>
                <p className="text-3xl font-bold text-gray-900">{formatAmount(summary.totalSaved)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900">History</h2>

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
                  <TableHead className="font-semibold text-gray-700">No of Cloth</TableHead>
                  <TableHead className="font-semibold text-gray-700">Reward</TableHead>
                  <TableHead className="font-semibold text-gray-700">Total Amount</TableHead>
                  <TableHead className="font-semibold text-gray-700">Amount Saved</TableHead>
                  <TableHead className="font-semibold text-gray-700">Start/End</TableHead>
                  <TableHead className="font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="font-semibold text-gray-700">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRewards.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                      No rewards found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRewards.map((reward) => (
                    <TableRow key={reward._id}>
                      <TableCell className="font-medium">
                        {reward.orderId || reward._id.slice(-6)}
                      </TableCell>
                      <TableCell>{reward.clothesCount || 0}</TableCell>
                      <TableCell>{reward.rewardType}</TableCell>
                      <TableCell className="font-medium">
                        {formatAmount(reward.totalAmount)}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatAmount(reward.amountSaved)}
                      </TableCell>
                      <TableCell>
                        {formatDate(reward.startDate)} - {formatDate(reward.endDate)}
                      </TableCell>
                      <TableCell>{getStatusBadge(reward.status)}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleViewOrder(reward.orderId || reward._id)}
                        >
                          <Eye className="h-4 w-4 text-gray-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages && pagination.totalPages > 1 && (
          <Pagination
            currentPage={pagination.currentPage || currentPage}
            totalPages={pagination.totalPages || 1}
            totalItems={pagination.totalRewards || 0}
            itemsPerPage={pagination.pageSize || limit}
            onPageChange={setCurrentPage}
            isLoading={isLoading}
          />
        )}
      </div>
    </div>
  )
}

