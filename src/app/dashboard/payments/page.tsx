"use client"

import { useState, useMemo } from "react"
import { Users, Building2, TrendingUp, ArrowDownLeft, ArrowUpRight } from "lucide-react"
import { TransactionsTable, type Transaction } from "@/components/dashboard"
import { PaymentStatCard } from "@/components/dashboard/payment-stat-card"
import { usePayments, usePaymentStats } from "@/api/hooks"
import { Button } from "@/components/ui/button"
import type { ApiResponse } from "@/api/api-client"

// Backend transaction response structure
interface BackendTransaction {
  _id: string
  transactionId: string
  description: string
  type: "credit" | "debit" | "refund"
  amount: number
  createdAt: string
}

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("")

  // Fetch transaction statistics
  const { data: statsResponse, isLoading: statsLoading } = usePaymentStats()
  
  // Fetch transactions list
  const { data: transactionsResponse, isLoading: transactionsLoading } = usePayments({
    page: 1,
    limit: 100,
  })

  const isLoading = statsLoading || transactionsLoading

  // Extract stats from API response
  const stats = useMemo(() => {
    if (!statsResponse || typeof statsResponse !== 'object') {
      return { 
        totalAmount: 0,
        businessAmount: 0,
        userAmount: 0,
        profit: 0,
        refunds: 0,
        withdrawals: 0,
      }
    }

    // Handle both wrapped and direct responses
    if ('data' in statsResponse && statsResponse.data) {
      return statsResponse.data as {
        totalAmount: number
        businessAmount: number
        userAmount: number
        profit: number
        refunds: number
        withdrawals: number
      }
    }
    
    // Direct response structure
    return statsResponse as {
      totalAmount: number
      businessAmount: number
      userAmount: number
      profit: number
      refunds: number
      withdrawals: number
    }
  }, [statsResponse])

  // Transform transactions data for the table
  const tableTransactions: Transaction[] = useMemo(() => {
    const transactionsData = transactionsResponse as ApiResponse<{ transactions: BackendTransaction[] }> | undefined
    if (!transactionsData || !transactionsData.data || !('transactions' in transactionsData.data)) return []

    const transactions = transactionsData.data.transactions || []
    
    return transactions
      .filter((transaction: BackendTransaction) => {
        if (!searchQuery) return true
        const query = searchQuery.toLowerCase()
        return (
          transaction.transactionId?.toLowerCase().includes(query) ||
          transaction.description?.toLowerCase().includes(query) ||
          transaction.type?.toLowerCase().includes(query)
        )
      })
      .map((transaction: BackendTransaction) => ({
        id: transaction._id || transaction.transactionId,
        transactionId: transaction.transactionId,
        description: transaction.description,
        type: transaction.type,
        amount: transaction.amount || 0,
      }))
  }, [transactionsResponse, searchQuery])

  // Handle view transaction
  const handleViewTransaction = (transactionId: string) => {
    console.log("View transaction:", transactionId)
    // TODO: Implement transaction detail view
  }

  // Handle action buttons
  const handleIssueRefund = () => {
    console.log("Issue Refund clicked")
    // TODO: Implement refund issuance
  }

  const handleIssueWithdrawal = () => {
    console.log("Issue Withdrawal clicked")
    // TODO: Implement withdrawal issuance
  }

  const handleIssueCredit = () => {
    console.log("Issue Credit clicked")
    // TODO: Implement credit issuance
  }

  // Format amount in naira with 2 decimal places
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading payments...</p>
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
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        </div>
        {/* Date filters */}
        <div className="flex items-center gap-3">
          {/* Placeholder for date filters */}
        </div>
      </div>

      {/* Stats Section */}
      <div className="space-y-4">
        {/* Top Row: Total Amount, Business/User Split, Profit/Refunds Split */}
        <div className="flex flex-row gap-4">
          {/* Total Amount - Large card */}
          <div className="flex-1">
            <PaymentStatCard
              title="Total Amount"
              icon={Users}
              iconBgColor="bg-blue-100"
              value={formatAmount(stats.totalAmount)}
              size="large"
              className="h-full"
            />
          </div>

          {/* Business/User Split Card */}
          <div className="flex-1">
            <PaymentStatCard
              title="Business"
              icon={Building2}
              iconBgColor="bg-green-100"
              value={formatAmount(stats.businessAmount)}
              size="split"
              splitTitle="User"
              splitIcon={Users}
              splitIconBgColor="bg-yellow-100"
              splitValue={formatAmount(stats.userAmount)}
              className="h-full"
            />
          </div>

          {/* Profit/Refunds Split Card */}
          <div className="flex-1">
            <PaymentStatCard
              title="Profit"
              icon={TrendingUp}
              iconBgColor="bg-teal-100"
              value={formatAmount(stats.profit)}
              size="split"
              splitTitle="Refunds"
              splitIcon={ArrowDownLeft}
              splitIconBgColor="bg-blue-100"
              splitValue={formatAmount(stats.refunds)}
              className="h-full"
            />
          </div>
        </div>

        {/* Bottom Row: Withdrawals and Action Buttons */}
        <div className="flex flex-row gap-4 items-center">
          {/* Withdrawals Card */}
          <div className="flex-1">
            <PaymentStatCard
              title="Withdrawals"
              icon={ArrowUpRight}
              iconBgColor="bg-red-100"
              value={formatAmount(stats.withdrawals)}
              size="normal"
            />
          </div>

          {/* Empty space */}
          <div className="flex-1"></div>

          {/* Action Buttons - Right aligned */}
          <div className="flex flex-row gap-3 justify-end">
            <Button
              onClick={handleIssueRefund}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
            >
              Issue Refund
            </Button>
            <Button
              onClick={handleIssueWithdrawal}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2"
            >
              Issue Withdrawal
            </Button>
            <Button
              onClick={handleIssueCredit}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2"
            >
              Issue Credit
            </Button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <TransactionsTable
        title="List of Transactions"
        transactions={tableTransactions}
        onViewTransaction={handleViewTransaction}
        onSearch={setSearchQuery}
        onFilterChange={(filter) => {
          console.log("Filter changed:", filter)
        }}
      />
    </div>
  )
}
