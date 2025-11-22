"use client"

import { useState, useMemo } from "react"
import { Users, Building2, TrendingUp, ArrowDownLeft, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react"
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

interface TransactionsResponse {
  transactions: BackendTransaction[]
  totalTransactions: number
  page: number
  totalPages: number
}

export default function PaymentsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 10

  // Fetch transaction statistics
  const { data: statsResponse, isLoading: statsLoading } = usePaymentStats()
  
  // Fetch transactions list with pagination
  const { data: transactionsResponse, isLoading: transactionsLoading } = usePayments({
    page: currentPage,
    limit: limit,
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

  // Extract pagination info and transactions from API response
  const { transactions, totalPages, totalTransactions } = useMemo(() => {
    if (!transactionsResponse) {
      return { transactions: [], totalPages: 0, totalTransactions: 0 }
    }

    // Handle ApiResponse wrapper
    const responseData = (transactionsResponse as ApiResponse<TransactionsResponse>).data || transactionsResponse as TransactionsResponse
    
    // Check if responseData has transactions property
    if (responseData && 'transactions' in responseData) {
      return {
        transactions: responseData.transactions || [],
        totalPages: responseData.totalPages || 0,
        totalTransactions: responseData.totalTransactions || 0,
      }
    }

    // Fallback: check if it's an array directly
    if (Array.isArray(responseData)) {
      return {
        transactions: responseData,
        totalPages: 1,
        totalTransactions: responseData.length,
      }
    }

    return { transactions: [], totalPages: 0, totalTransactions: 0 }
  }, [transactionsResponse])

  // Transform transactions data for the table
  const tableTransactions: Transaction[] = useMemo(() => {
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
  }, [transactions, searchQuery])

  // Pagination handlers
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

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
        currentPage={currentPage}
        limit={limit}
      />

      {/* Pagination Controls */}
      {totalPages > 0 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <div className="text-sm text-gray-700">
            Showing {(currentPage - 1) * limit + 1} to {Math.min(currentPage * limit, totalTransactions)} of {totalTransactions} transactions
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreviousPage}
              disabled={currentPage === 1 || isLoading}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            
            {/* Page Numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum: number
                if (totalPages <= 5) {
                  pageNum = i + 1
                } else if (currentPage <= 3) {
                  pageNum = i + 1
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i
                } else {
                  pageNum = currentPage - 2 + i
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                    disabled={isLoading}
                    className="min-w-[40px]"
                  >
                    {pageNum}
                  </Button>
                )
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleNextPage}
              disabled={currentPage === totalPages || isLoading}
              className="flex items-center gap-1"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
