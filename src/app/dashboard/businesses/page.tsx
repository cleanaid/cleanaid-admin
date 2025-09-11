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
import { ArrowUpDown, ChevronDown, MoreHorizontal, Download, Search, Eye, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

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
import { Business, BusinessFilters } from "@/types/business"
import { formatDate, formatCurrency } from "@/lib/utils"

// Mock data - will be replaced with real API calls
const mockBusinesses: Business[] = [
  {
    id: "1",
    name: "Sparkle Clean Services",
    email: "info@sparkleclean.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    businessType: "cleaning",
    verificationStatus: "verified",
    ownerName: "John Smith",
    ownerEmail: "john@sparkleclean.com",
    ownerPhone: "+1 (555) 123-4567",
    createdAt: "2024-01-15T10:30:00Z",
    lastUpdated: "2024-01-20T14:22:00Z",
    totalServices: 45,
    totalEarnings: 2250.00,
    rating: 4.8,
    reviewCount: 23,
    documents: [],
    services: [],
  },
  {
    id: "2",
    name: "Pro Maintenance Co",
    email: "contact@promaintenance.com",
    phone: "+1 (555) 987-6543",
    address: "456 Oak Ave",
    city: "Los Angeles",
    state: "CA",
    zipCode: "90210",
    businessType: "maintenance",
    verificationStatus: "pending",
    ownerName: "Jane Doe",
    ownerEmail: "jane@promaintenance.com",
    ownerPhone: "+1 (555) 987-6543",
    createdAt: "2024-01-10T09:15:00Z",
    lastUpdated: "2024-01-20T16:45:00Z",
    totalServices: 0,
    totalEarnings: 0,
    rating: 0,
    reviewCount: 0,
    documents: [],
    services: [],
  },
  {
    id: "3",
    name: "Elite Cleaning Solutions",
    email: "hello@elitecleaning.com",
    phone: "+1 (555) 456-7890",
    address: "789 Pine St",
    city: "Chicago",
    state: "IL",
    zipCode: "60601",
    businessType: "cleaning",
    verificationStatus: "rejected",
    ownerName: "Mike Johnson",
    ownerEmail: "mike@elitecleaning.com",
    ownerPhone: "+1 (555) 456-7890",
    createdAt: "2024-01-05T11:20:00Z",
    lastUpdated: "2024-01-18T08:30:00Z",
    totalServices: 12,
    totalEarnings: 600.00,
    rating: 4.2,
    reviewCount: 8,
    documents: [],
    services: [],
  },
  {
    id: "4",
    name: "Quick Fix Services",
    email: "info@quickfix.com",
    phone: "+1 (555) 321-0987",
    address: "321 Elm St",
    city: "Houston",
    state: "TX",
    zipCode: "77001",
    businessType: "maintenance",
    verificationStatus: "suspended",
    ownerName: "Sarah Wilson",
    ownerEmail: "sarah@quickfix.com",
    ownerPhone: "+1 (555) 321-0987",
    createdAt: "2024-01-12T13:45:00Z",
    lastUpdated: "2024-01-19T12:15:00Z",
    totalServices: 8,
    totalEarnings: 400.00,
    rating: 3.9,
    reviewCount: 5,
    documents: [],
    services: [],
  },
]

const getVerificationStatusBadge = (status: Business['verificationStatus']) => {
  switch (status) {
    case 'verified':
      return <Badge variant="success" className="flex items-center gap-1"><CheckCircle className="h-3 w-3" />Verified</Badge>
    case 'pending':
      return <Badge variant="warning" className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Pending</Badge>
    case 'rejected':
      return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" />Rejected</Badge>
    case 'suspended':
      return <Badge variant="secondary" className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Suspended</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getBusinessTypeBadge = (type: Business['businessType']) => {
  switch (type) {
    case 'cleaning':
      return <Badge variant="outline">Cleaning</Badge>
    case 'maintenance':
      return <Badge variant="outline">Maintenance</Badge>
    case 'other':
      return <Badge variant="outline">Other</Badge>
    default:
      return <Badge variant="outline">{type}</Badge>
  }
}

export default function BusinessesPage() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [filters] = useState<BusinessFilters>({})

  // Mock API call - will be replaced with real useQuery
  const { data: businesses = [], isLoading } = useQuery({
    queryKey: ['businesses', filters],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      return mockBusinesses
    },
  })

  const columns: ColumnDef<Business>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Business Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {(row.getValue("name") as string).charAt(0)}
            </span>
          </div>
          <div>
            <div className="font-medium">{row.getValue("name")}</div>
            <div className="text-sm text-muted-foreground">{row.original.email}</div>
          </div>
        </div>
      ),
    },
    {
      accessorKey: "ownerName",
      header: "Owner",
      cell: ({ row }) => <div>{row.getValue("ownerName")}</div>,
    },
    {
      accessorKey: "businessType",
      header: "Type",
      cell: ({ row }) => getBusinessTypeBadge(row.getValue("businessType")),
    },
    {
      accessorKey: "verificationStatus",
      header: "Status",
      cell: ({ row }) => getVerificationStatusBadge(row.getValue("verificationStatus")),
    },
    {
      accessorKey: "city",
      header: "Location",
      cell: ({ row }) => (
        <div>
          <div>{row.getValue("city")}, {row.original.state}</div>
          <div className="text-sm text-muted-foreground">{row.original.zipCode}</div>
        </div>
      ),
    },
    {
      accessorKey: "totalServices",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Services
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{row.getValue("totalServices")}</div>,
    },
    {
      accessorKey: "totalEarnings",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Earnings
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div>{formatCurrency(row.getValue("totalEarnings"))}</div>,
    },
    {
      accessorKey: "rating",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Rating
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const rating = row.getValue("rating") as number
        const reviewCount = row.original.reviewCount
        return (
          <div>
            {rating > 0 ? (
              <>
                <div className="font-medium">{rating.toFixed(1)} ⭐</div>
                <div className="text-sm text-muted-foreground">{reviewCount} reviews</div>
              </>
            ) : (
              <div className="text-muted-foreground">No reviews</div>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Created
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
        const business = row.original

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
                onClick={() => navigator.clipboard.writeText(business.id)}
              >
                Copy business ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                View details
              </DropdownMenuItem>
              <DropdownMenuItem>Edit business</DropdownMenuItem>
              <DropdownMenuSeparator />
              {business.verificationStatus === 'pending' && (
                <>
                  <DropdownMenuItem className="text-green-600">
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Verify business
                  </DropdownMenuItem>
                  <DropdownMenuItem className="text-red-600">
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject verification
                  </DropdownMenuItem>
                </>
              )}
              {business.verificationStatus === 'verified' && (
                <DropdownMenuItem className="text-yellow-600">
                  <AlertTriangle className="mr-2 h-4 w-4" />
                  Suspend business
                </DropdownMenuItem>
              )}
              {business.verificationStatus === 'suspended' && (
                <DropdownMenuItem className="text-green-600">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Activate business
                </DropdownMenuItem>
              )}
              <DropdownMenuItem className="text-red-600">
                Delete business
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const handleExportCSV = () => {
    const csvContent = [
      ['Business Name', 'Owner', 'Type', 'Status', 'Location', 'Services', 'Earnings', 'Rating', 'Created'],
      ...businesses.map(business => [
        business.name,
        business.ownerName,
        business.businessType,
        business.verificationStatus,
        `${business.city}, ${business.state}`,
        business.totalServices,
        business.totalEarnings,
        business.rating,
        formatDate(business.createdAt)
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'businesses-export.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const table = useReactTable({
    data: businesses,
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
          <h1 className="text-3xl font-bold tracking-tight">Business Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor all businesses on the platform.
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading businesses...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Business Management</h1>
        <p className="text-muted-foreground">
          Manage and monitor all businesses on the platform.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Businesses</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{businesses.length}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Verified</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {businesses.filter(b => b.verificationStatus === 'verified').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round((businesses.filter(b => b.verificationStatus === 'verified').length / businesses.length) * 100)}% of total
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {businesses.filter(b => b.verificationStatus === 'pending').length}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting verification
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(businesses.reduce((sum, b) => sum + b.totalEarnings, 0))}
            </div>
            <p className="text-xs text-muted-foreground">
              From all businesses
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Actions</CardTitle>
          <CardDescription>
            Filter businesses and perform bulk actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search businesses..."
                  value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                  onChange={(event) =>
                    table.getColumn("name")?.setFilterValue(event.target.value)
                  }
                  className="pl-8"
                />
              </div>
            </div>
            <Select
              value={(table.getColumn("verificationStatus")?.getFilterValue() as string) ?? ""}
              onValueChange={(value) =>
                table.getColumn("verificationStatus")?.setFilterValue(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={(table.getColumn("businessType")?.getFilterValue() as string) ?? ""}
              onValueChange={(value) =>
                table.getColumn("businessType")?.setFilterValue(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="cleaning">Cleaning</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExportCSV} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Businesses Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Businesses ({businesses.length})</CardTitle>
              <CardDescription>
                A list of all businesses in the system
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
    </div>
  )
}
