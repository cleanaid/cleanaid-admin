"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Download, Search, Plus, CreditCard, ArrowUpRight, ArrowDownLeft, DollarSign } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Payment, PaymentFilters } from "@/types/payment"
import { formatDate, formatCurrency } from "@/lib/utils"

// Mock data - will be replaced with real API calls
const mockPayments: Payment[] = [
  {
    id: "1",
    type: "payment",
    amount: 150.00,
    currency: "USD",
    status: "completed",
    description: "Cleaning service payment",
    userId: "user1",
    businessId: "business1",
    orderId: "order1",
    paymentMethod: "card",
    transactionId: "txn_123456789",
    reference: "REF001",
    createdAt: "2024-01-20T10:30:00Z",
    processedAt: "2024-01-20T10:31:00Z",
  },
  {
    id: "2",
    type: "refund",
    amount: 75.00,
    currency: "USD",
    status: "completed",
    description: "Service cancellation refund",
    userId: "user2",
    businessId: "business1",
    orderId: "order2",
    paymentMethod: "card",
    transactionId: "txn_123456790",
    reference: "REF002",
    createdAt: "2024-01-19T14:22:00Z",
    processedAt: "2024-01-19T14:25:00Z",
  },
  {
    id: "3",
    type: "withdrawal",
    amount: 500.00,
    currency: "USD",
    status: "pending",
    description: "Business earnings withdrawal",
    businessId: "business1",
    paymentMethod: "bank_transfer",
    transactionId: "txn_123456791",
    reference: "WTH001",
    createdAt: "2024-01-20T09:15:00Z",
  },
  {
    id: "4",
    type: "credit",
    amount: 25.00,
    currency: "USD",
    status: "completed",
    description: "Promotional credit",
    userId: "user3",
    paymentMethod: "manual",
    reference: "CRD001",
    createdAt: "2024-01-18T16:45:00Z",
    processedAt: "2024-01-18T16:46:00Z",
  },
  {
    id: "5",
    type: "manual",
    amount: 100.00,
    currency: "USD",
    status: "completed",
    description: "Manual adjustment",
    userId: "user4",
    paymentMethod: "manual",
    reference: "MAN001",
    createdAt: "2024-01-17T11:20:00Z",
    processedAt: "2024-01-17T11:21:00Z",
  },
]

const getPaymentTypeIcon = (type: Payment['type']) => {
  switch (type) {
    case 'payment':
      return <CreditCard className="h-4 w-4 text-green-600" />
    case 'refund':
      return <ArrowDownLeft className="h-4 w-4 text-red-600" />
    case 'withdrawal':
      return <ArrowUpRight className="h-4 w-4 text-blue-600" />
    case 'credit':
      return <DollarSign className="h-4 w-4 text-purple-600" />
    case 'manual':
      return <Plus className="h-4 w-4 text-orange-600" />
    default:
      return <CreditCard className="h-4 w-4 text-gray-600" />
  }
}

const getPaymentTypeBadge = (type: Payment['type']) => {
  switch (type) {
    case 'payment':
      return <Badge variant="success">Payment</Badge>
    case 'refund':
      return <Badge variant="destructive">Refund</Badge>
    case 'withdrawal':
      return <Badge variant="outline">Withdrawal</Badge>
    case 'credit':
      return <Badge variant="secondary">Credit</Badge>
    case 'manual':
      return <Badge variant="warning">Manual</Badge>
    default:
      return <Badge variant="secondary">{type}</Badge>
  }
}

const getStatusBadge = (status: Payment['status']) => {
  switch (status) {
    case 'completed':
      return <Badge variant="success">Completed</Badge>
    case 'pending':
      return <Badge variant="warning">Pending</Badge>
    case 'failed':
      return <Badge variant="destructive">Failed</Badge>
    case 'cancelled':
      return <Badge variant="secondary">Cancelled</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

export default function PaymentsPage() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [filters] = useState<PaymentFilters>({})

  // Mock API call - will be replaced with real useQuery
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['payments', filters],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      return mockPayments
    },
  })

  const columns: ColumnDef<Payment>[] = [
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          {getPaymentTypeIcon(row.getValue("type"))}
          {getPaymentTypeBadge(row.getValue("type"))}
        </div>
      ),
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const amount = row.getValue("amount") as number
        const type = row.original.type
        const isNegative = type === 'refund' || type === 'withdrawal'
        return (
          <div className={`font-medium ${isNegative ? 'text-red-600' : 'text-green-600'}`}>
            {isNegative ? '-' : '+'}{formatCurrency(amount)}
          </div>
        )
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => getStatusBadge(row.getValue("status")),
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => <div className="max-w-[200px] truncate">{row.getValue("description")}</div>,
    },
    {
      accessorKey: "paymentMethod",
      header: "Method",
      cell: ({ row }) => {
        const method = row.getValue("paymentMethod") as string
        return <Badge variant="outline">{method.replace('_', ' ').toUpperCase()}</Badge>
      },
    },
    {
      accessorKey: "reference",
      header: "Reference",
      cell: ({ row }) => <div className="font-mono text-sm">{row.getValue("reference")}</div>,
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{formatDate(row.getValue("createdAt"))}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const payment = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(payment.id)}
              >
                Copy transaction ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Download receipt</DropdownMenuItem>
              <DropdownMenuSeparator />
              {payment.status === 'pending' && (
                <>
                  <DropdownMenuItem className="text-green-600">
                    Approve transaction
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    Reject transaction
                  </DropdownMenuItem>
                </>
              )}
              {payment.status === 'completed' && payment.type === 'payment' && (
                <DropdownMenuItem className="text-yellow-600">
                  Process refund
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const handleExportCSV = () => {
    const csvContent = [
      ['Type', 'Amount', 'Status', 'Description', 'Method', 'Reference', 'Date'],
      ...payments.map(payment => [
        payment.type,
        payment.amount,
        payment.status,
        payment.description,
        payment.paymentMethod,
        payment.reference,
        formatDate(payment.createdAt)
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'payments-export.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const table = useReactTable({
    data: payments,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-muted-foreground">
            Manage all payment transactions and financial operations.
          </p>
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

  const totalRevenue = payments
    .filter(p => p.type === 'payment' && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)

  const totalRefunds = payments
    .filter(p => p.type === 'refund' && p.status === 'completed')
    .reduce((sum, p) => sum + p.amount, 0)

  const pendingWithdrawals = payments
    .filter(p => p.type === 'withdrawal' && p.status === 'pending')
    .reduce((sum, p) => sum + p.amount, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">
          Manage all payment transactions and financial operations.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalRevenue)}</div>
            <p className="text-xs text-muted-foreground">
              From completed payments
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Refunds</CardTitle>
            <ArrowDownLeft className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalRefunds)}</div>
            <p className="text-xs text-muted-foreground">
              Processed refunds
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Withdrawals</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{formatCurrency(pendingWithdrawals)}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting approval
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalRevenue - totalRefunds)}</div>
            <p className="text-xs text-muted-foreground">
              Revenue minus refunds
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">All Transactions</TabsTrigger>
          <TabsTrigger value="manual">Manual Transactions</TabsTrigger>
          <TabsTrigger value="refunds">Refunds</TabsTrigger>
          <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
          <TabsTrigger value="credits">Credits</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          {/* Filters and Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Filters & Actions</CardTitle>
              <CardDescription>
                Filter transactions and perform bulk actions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search transactions..."
                      value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
                      onChange={(event) =>
                        table.getColumn("description")?.setFilterValue(event.target.value)
                      }
                      className="pl-8"
                    />
                  </div>
                </div>
                <Select
                  value={(table.getColumn("type")?.getFilterValue() as string) ?? ""}
                  onValueChange={(value) =>
                    table.getColumn("type")?.setFilterValue(value === "all" ? "" : value)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="payment">Payment</SelectItem>
                    <SelectItem value="refund">Refund</SelectItem>
                    <SelectItem value="withdrawal">Withdrawal</SelectItem>
                    <SelectItem value="credit">Credit</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
                  onValueChange={(value) =>
                    table.getColumn("status")?.setFilterValue(value === "all" ? "" : value)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleExportCSV} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Transactions Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Transactions ({payments.length})</CardTitle>
                  <CardDescription>
                    Complete transaction history
                  </CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                      Columns <ChevronDown className="ml-2 h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background">
                    {table
                      .getAllColumns()
                      .filter((column) => column.getCanHide())
                      .map((column) => {
                        return (
                          <DropdownMenuCheckboxItem
                            key={column.id}
                            className="capitalize"
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                              column.toggleVisibility(!!value)
                            }
                          >
                            {column.id}
                          </DropdownMenuCheckboxItem>
                        )
                      })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                          return (
                            <TableHead key={header.id}>
                              {header.isPlaceholder
                                ? null
                                : flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                            </TableHead>
                          )
                        })}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows?.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && "selected"}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={columns.length}
                          className="h-24 text-center"
                        >
                          No results.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                  {table.getFilteredSelectedRowModel().rows.length} of{" "}
                  {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="manual" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Manual Transactions</CardTitle>
              <CardDescription>
                Create manual credit or debit transactions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Manual Transaction Form</h3>
                <p className="text-muted-foreground mb-4">
                  Create manual credit or debit transactions for users or businesses.
                </p>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Manual Transaction
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="refunds" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Refund Management</CardTitle>
              <CardDescription>
                Process refunds for completed payments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <ArrowDownLeft className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Refund Processing</h3>
                <p className="text-muted-foreground mb-4">
                  Process refunds for completed payments and manage refund requests.
                </p>
                <Button>
                  <ArrowDownLeft className="mr-2 h-4 w-4" />
                  Process Refund
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdrawals" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal Management</CardTitle>
              <CardDescription>
                Approve and process business withdrawals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <ArrowUpRight className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Withdrawal Processing</h3>
                <p className="text-muted-foreground mb-4">
                  Review and approve business withdrawal requests.
                </p>
                <Button>
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  Review Withdrawals
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credits" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Credit Management</CardTitle>
              <CardDescription>
                Issue promotional credits and manage user balances
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Credit Issuance</h3>
                <p className="text-muted-foreground mb-4">
                  Issue promotional credits to users and manage credit balances.
                </p>
                <Button>
                  <DollarSign className="mr-2 h-4 w-4" />
                  Issue Credit
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
