"use client"

import { useState, useMemo } from "react"
import { CheckCircle, Clock, XCircle } from "lucide-react"
import { UserStatCard, PayoutsTable, type Payout } from "@/components/dashboard"
import { usePayouts, usePayoutStats } from "@/api/hooks"
import type { ApiResponse } from "@/api/api-client"

// Backend payout response structure
interface BackendPayout {
  id: string
  businessId: string
  businessName: string
  ordersCount: number
  payoutsCount: number
  timer: string
  timerColor: "green" | "yellow" | "black"
  withdrawals?: Array<{
    _id: string
    amount: number
    status: string
    requestDate: string
    countDownTimer: string | null
  }>
}

export default function PayoutsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch payout statistics
  const { data: statsResponse, isLoading: statsLoading } = usePayoutStats()
  
  // Fetch payouts list
  const { data: payoutsResponse, isLoading: payoutsLoading } = usePayouts({
    page: 1,
    limit: 100,
  })

  const isLoading = statsLoading || payoutsLoading

  // Extract stats from API response
  const stats = useMemo(() => {
    if (!statsResponse || typeof statsResponse !== 'object') {
      return { 
        successful: { count: 0, amount: 0 },
        pending: { count: 0, amount: 0 },
        unsuccessful: { count: 0, amount: 0 },
      }
    }

    // Handle both wrapped and direct responses
    if ('data' in statsResponse && statsResponse.data) {
      return statsResponse.data as {
        successful: { count: number; amount: number }
        pending: { count: number; amount: number }
        unsuccessful: { count: number; amount: number }
      }
    }
    
    // Direct response structure
    return statsResponse as {
      successful: { count: number; amount: number }
      pending: { count: number; amount: number }
      unsuccessful: { count: number; amount: number }
    }
  }, [statsResponse])

  // Transform payouts data for the table
  const tablePayouts: Payout[] = useMemo(() => {
    const payoutsData = payoutsResponse as ApiResponse<{ payouts: BackendPayout[] }> | undefined
    if (!payoutsData || !payoutsData.data || !('payouts' in payoutsData.data)) return []

    const payouts = payoutsData.data.payouts || []
    
    return payouts
      .filter((payout: BackendPayout) => {
        if (!searchQuery) return true
        const query = searchQuery.toLowerCase()
        return (
          payout.id?.toString().toLowerCase().includes(query) ||
          payout.businessId?.toLowerCase().includes(query) ||
          payout.businessName?.toLowerCase().includes(query)
        )
      })
      .map((payout: BackendPayout) => ({
        id: payout.id || payout.businessId,
        businessId: payout.businessId,
        businessName: payout.businessName,
        ordersCount: payout.ordersCount || 0,
        payoutsCount: payout.payoutsCount || 0,
        timer: payout.timer || "00:00:00",
        timerColor: payout.timerColor || "green",
      }))
  }, [payoutsResponse, searchQuery])

  // Handle issue payout
  const handleIssuePayout = (payoutId: string) => {
    console.log("Issue payout for:", payoutId)
    // TODO: Implement payout issuance logic
  }

  // Format amount in naira
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payout</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading payouts...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payout</h1>
        </div>
        {/* Date filters */}
        <div className="flex items-center gap-3">
          {/* Placeholder for date filters */}
        </div>
      </div>

      {/* Stat Cards - Row 1: Counts */}
      <div className="grid gap-4 md:grid-cols-3">
        <UserStatCard
          title="Successful Payouts"
          icon={CheckCircle}
          iconBgColor="bg-blue-100"
          value={stats.successful.count}
        />
        <UserStatCard
          title="Pending Payouts"
          icon={Clock}
          iconBgColor="bg-green-100"
          value={stats.pending.count}
        />
        <UserStatCard
          title="Unsuccessful Payouts"
          icon={XCircle}
          iconBgColor="bg-orange-100"
          value={stats.unsuccessful.count}
        />
      </div>

      {/* Stat Cards - Row 2: Amounts */}
      <div className="grid gap-4 md:grid-cols-3">
        <UserStatCard
          title="Successful Payouts"
          icon={CheckCircle}
          iconBgColor="bg-blue-100"
          value={formatAmount(stats.successful.amount)}
        />
        <UserStatCard
          title="Pending Payouts"
          icon={Clock}
          iconBgColor="bg-green-100"
          value={formatAmount(stats.pending.amount)}
        />
        <UserStatCard
          title="Unsuccessful Payouts"
          icon={XCircle}
          iconBgColor="bg-orange-100"
          value={formatAmount(stats.unsuccessful.amount)}
        />
      </div>

      {/* Payouts Table */}
      <PayoutsTable
        title="List of Payouts"
        payouts={tablePayouts}
        onIssuePayout={handleIssuePayout}
        onSearch={setSearchQuery}
        onFilterChange={(filter) => {
          console.log("Filter changed:", filter)
        }}
      />
    </div>
  )
}

