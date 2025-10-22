"use client"

import { useState, useMemo, useCallback } from "react"
import {
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
import { ArrowUpDown, ChevronDown, MoreHorizontal, Download, Search, AlertCircle } from "lucide-react"

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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User } from "@/types/user"
import { formatDate, formatCurrency } from "@/lib/utils"
import { useUsers, useToggleUserStatus, useDeleteUser, type UserFilters as ApiUserFilters } from "@/api/hooks"


const getStatusBadge = (status: User['status']) => {
  switch (status) {
    case 'active':
      return <Badge variant="success">Active</Badge>
    case 'inactive':
      return <Badge variant="secondary">Inactive</Badge>
    case 'suspended':
      return <Badge variant="destructive">Suspended</Badge>
    default:
      return <Badge variant="secondary">{status}</Badge>
  }
}

const getRoleBadge = (role: User['role']) => {
  switch (role) {
    case 'admin':
      return <Badge variant="default">Admin</Badge>
    case 'service_provider':
      return <Badge variant="outline">Service Provider</Badge>
    case 'customer':
      return <Badge variant="secondary">Customer</Badge>
    case 'vendor':
      return <Badge variant="outline">Vendor</Badge>
    case 'user':
      return <Badge variant="secondary">User</Badge>
    default:
      return <Badge variant="secondary">{role}</Badge>
  }
}

export default function UsersPage() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = useState({})
  const [filters] = useState<ApiUserFilters>({
    page: 1,
    limit: 50,
  })

  // Real API call using React Query hooks
  const { 
    data: usersResponse, 
    isLoading, 
    error,
    refetch 
  } = useUsers(filters)

  // Extract users from API response and transform to match UI expectations - memoized to prevent re-renders
  const { users, pagination } = useMemo(() => {
    const rawUsers = usersResponse?.data || []
    const pagination = usersResponse?.pagination
    
    const transformedUsers = rawUsers.map((user: User) => ({
      ...user,
      id: user.id || user.phoneNumber, // Use phoneNumber as ID if no ID
      name: user.fullName || user.name || 'Unknown',
      email: user.emailAddress || user.email || '',
      phone: user.phoneNumber || user.phone || '',
      status: user.isVerified ? 'active' : 'inactive', // Map isVerified to status
      totalOrders: user.transaction || user.totalOrders || 0,
      totalSpent: user.transaction || user.totalSpent || 0,
    }))
    
    return { users: transformedUsers, pagination }
  }, [usersResponse])

  // Mutations for user actions
  const toggleStatusMutation = useToggleUserStatus({
    onSuccess: () => {
      refetch()
    },
    onError: (error) => {
      console.error('Failed to toggle user status:', error)
    }
  })

  const deleteUserMutation = useDeleteUser({
    onSuccess: () => {
      refetch()
    },
    onError: (error) => {
      console.error('Failed to delete user:', error)
    }
  })

  const handleToggleStatus = useCallback((userId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active'
    toggleStatusMutation.mutate({ id: userId, status: newStatus as 'active' | 'suspended' })
  }, [toggleStatusMutation])

  const handleDeleteUser = useCallback((userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      deleteUserMutation.mutate(userId)
    }
  }, [deleteUserMutation])

  // Handlers will be defined after table creation

  const columns = useMemo(() => [
    {
      accessorKey: "name",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: { row: any }) => (
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
      accessorKey: "phone",
      header: "Phone",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: { row: any }) => <div>{row.getValue("phone")}</div>,
    },
    {
      accessorKey: "status",
      header: "Status",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: { row: any }) => getStatusBadge(row.getValue("status")),
    },
    {
      accessorKey: "role",
      header: "Role",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: { row: any }) => getRoleBadge(row.getValue("role")),
    },
    {
      accessorKey: "totalOrders",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Orders
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: { row: any }) => <div>{row.getValue("totalOrders")}</div>,
    },
    {
      accessorKey: "totalSpent",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Total Spent
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: { row: any }) => <div>{formatCurrency(row.getValue("totalSpent"))}</div>,
    },
    {
      accessorKey: "lastLogin",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      header: ({ column }: { column: any }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Last Login
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: { row: any }) => <div>{formatDate(row.getValue("lastLogin"))}</div>,
    },
    {
      id: "actions",
      enableHiding: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      cell: ({ row }: { row: any }) => {
        const user = row.original

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
                onClick={() => navigator.clipboard.writeText(user.id || user.phoneNumber || '')}
              >
                Copy user ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Edit user</DropdownMenuItem>
              <DropdownMenuSeparator />
              {user.status === 'active' ? (
                <DropdownMenuItem 
                  className="text-yellow-600"
                  onClick={() => handleToggleStatus(user.id || user.phoneNumber || '', user.status || 'inactive')}
                  disabled={toggleStatusMutation.isPending}
                >
                  {toggleStatusMutation.isPending ? 'Updating...' : 'Suspend user'}
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem 
                  className="text-green-600"
                  onClick={() => handleToggleStatus(user.id || user.phoneNumber || '', user.status || 'inactive')}
                  disabled={toggleStatusMutation.isPending}
                >
                  {toggleStatusMutation.isPending ? 'Updating...' : 'Activate user'}
                </DropdownMenuItem>
              )}
              <DropdownMenuItem 
                className="text-red-600"
                onClick={() => handleDeleteUser(user.id || user.phoneNumber || '')}
                disabled={deleteUserMutation.isPending}
              >
                {deleteUserMutation.isPending ? 'Deleting...' : 'Delete user'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ], [toggleStatusMutation.isPending, deleteUserMutation.isPending, handleDeleteUser, handleToggleStatus])

  const table = useReactTable({
    data: users,
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

  // Debounced search handler to prevent excessive re-renders
  const handleSearchChange = useCallback((value: string) => {
    table.getColumn("name")?.setFilterValue(value)
  }, [table])

  const handleExportCSV = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Status', 'Role', 'Orders', 'Total Spent', 'Last Login'],
      ...users.map((user) => [
        user.name,
        user.email,
        user.phone,
        user.status,
        user.role,
        user.totalOrders,
        user.totalSpent,
        formatDate(user.lastLogin)
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'users-export.csv'
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor all users on the platform.
          </p>
        </div>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-muted-foreground">Loading users...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground">
            Manage and monitor all users on the platform.
          </p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load users. Please check your connection and try again.
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-2"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage and monitor all users on the platform.
        </p>
      </div>

      {/* Filters and Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Filters & Actions</CardTitle>
          <CardDescription>
            Filter users and perform bulk actions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
                  onChange={(event) => handleSearchChange(event.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={(table.getColumn("role")?.getFilterValue() as string) ?? ""}
              onValueChange={(value) =>
                table.getColumn("role")?.setFilterValue(value === "all" ? "" : value)
              }
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="service_provider">Service Provider</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="vendor">Vendor</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handleExportCSV} variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 hover:scale-[1.01]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Users ({pagination?.total || users.length})</CardTitle>
              <CardDescription>
                A list of all users in the system
                {pagination && (
                  <span className="ml-2 text-xs">
                    (Page {pagination.page} of {pagination.totalPages})
                  </span>
                )}
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
