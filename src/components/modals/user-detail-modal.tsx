"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { User } from "@/types/user"
import { formatDate, formatCurrency } from "@/lib/utils"
import { Mail, Phone, Calendar, CreditCard, ShoppingCart, AlertTriangle } from "lucide-react"

interface UserDetailModalProps {
  user: User | null
  isOpen: boolean
  onClose: () => void
}

export function UserDetailModal({ user, isOpen, onClose }: UserDetailModalProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState<User | null>(null)

  if (!user) return null

  const handleEdit = () => {
    setEditedUser({ ...user })
    setIsEditing(true)
  }

  const handleSave = () => {
    // Here you would typically make an API call to update the user
    console.log("Saving user:", editedUser)
    setIsEditing(false)
    setEditedUser(null)
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditedUser(null)
  }

  const currentUser = editedUser || user

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>User Details</DialogTitle>
          <DialogDescription>
            View and manage user information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Header */}
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {currentUser.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{currentUser.name}</h3>
              <p className="text-muted-foreground">{currentUser.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                {currentUser.status === 'active' ? (
                  <Badge variant="success">Active</Badge>
                ) : currentUser.status === 'inactive' ? (
                  <Badge variant="secondary">Inactive</Badge>
                ) : (
                  <Badge variant="destructive">Suspended</Badge>
                )}
                {currentUser.role === 'admin' ? (
                  <Badge variant="default">Admin</Badge>
                ) : currentUser.role === 'vendor' ? (
                  <Badge variant="outline">Vendor</Badge>
                ) : (
                  <Badge variant="secondary">User</Badge>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              {!isEditing ? (
                <Button onClick={handleEdit} variant="outline">
                  Edit
                </Button>
              ) : (
                <>
                  <Button onClick={handleSave} size="sm">
                    Save
                  </Button>
                  <Button onClick={handleCancel} variant="outline" size="sm">
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>

          <Separator />

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Contact Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      value={currentUser.email}
                      onChange={(e) => setEditedUser({
                        ...currentUser,
                        email: e.target.value
                      })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{currentUser.email}</span>
                    </div>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={currentUser.phone}
                      onChange={(e) => setEditedUser({
                        ...currentUser,
                        phone: e.target.value
                      })}
                    />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{currentUser.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>Account Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Member Since</Label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(currentUser.createdAt)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Last Login</Label>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDate(currentUser.lastLogin)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-4 w-4" />
                <span>Activity Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Total Orders</Label>
                  <div className="flex items-center space-x-2">
                    <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                    <span className="text-lg font-semibold">{currentUser.totalOrders}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Total Spent</Label>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-lg font-semibold">{formatCurrency(currentUser.totalSpent)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4" />
                <span>User Actions</span>
              </CardTitle>
              <CardDescription>
                Perform administrative actions on this user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {currentUser.status === 'active' ? (
                  <Button variant="outline" className="text-yellow-600 hover:text-yellow-700">
                    Suspend User
                  </Button>
                ) : (
                  <Button variant="outline" className="text-green-600 hover:text-green-700">
                    Activate User
                  </Button>
                )}
                <Button variant="outline" className="text-blue-600 hover:text-blue-700">
                  Reset Password
                </Button>
                <Button variant="outline" className="text-purple-600 hover:text-purple-700">
                  View Orders
                </Button>
                <Button variant="destructive" className="text-red-600 hover:text-red-700">
                  Delete User
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
