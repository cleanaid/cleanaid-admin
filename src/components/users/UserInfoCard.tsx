"use client"

import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy } from "lucide-react"

interface UserInfoCardProps {
  user: {
    id: string
    name: string
    avatar?: string
    email: string
    phone: string
    address: string
  }
  orderStats: {
    totalOrders: number
    totalAmount: number
    successfulOrders: number
    successfulAmount: number
    canceledOrders: number
    canceledAmount: number
  }
  rewardMetrics?: {
    target: number
    amountSpent: number
    reward: string
    status: string
  }
  onHistoryClick?: () => void
}

const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function UserInfoCard({ user, orderStats, rewardMetrics, onHistoryClick }: UserInfoCardProps) {
  const progressPercentage = rewardMetrics
    ? Math.round((rewardMetrics.amountSpent / rewardMetrics.target) * 100)
    : 0

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">User Information</h2>
      
      <Card className="grid grid-cols-1 lg:grid-cols-4 gap-6 p-4">
        {/* User Profile Card - Leftmost */}
        <Card className="w-full bg-white">
          <CardContent className="p-6">
            <div className="space-y-4">
              {/* Avatar */}
              <div className="flex justify-center">
                {user.avatar ? (
                  <div className="relative w-20 h-20 rounded-full overflow-hidden">
                    <Image
                      src={user.avatar}
                      alt={user.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-200 to-purple-200 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-700">
                      {user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              
              {/* ID */}
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">I.d No.</p>
                <p className="text-sm font-semibold text-gray-900">{user.id}</p>
              </div>
              
              {/* User Name */}
              <div className="text-center">
                <p className="text-xs text-gray-500 mb-1">User name</p>
                <p className="text-sm font-semibold text-gray-900">{user.name}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Info Card - Middle Left */}
        <Card className="w-full bg-blue-50/50 border-blue-200">
          <CardContent className="p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900">Contact Info</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <p>{user.address}</p>
                <p>{user.phone}</p>
                <p>{user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Summary Block - Middle Right (3 vertical cards) */}
        <div className="flex flex-col gap-3">
          {/* Total Orders Card */}
          <Card className="bg-yellow-50/50 border-yellow-200">
            <CardContent className="p-4">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">Total Orders</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-lg font-bold text-gray-900">{formatAmount(orderStats.totalAmount)}</p>
                  <p className="text-sm text-gray-600">{orderStats.totalOrders.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Successful Order Card */}
          <Card className="bg-green-50/50 border-green-200">
            <CardContent className="p-4">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">Successful Order</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-lg font-bold text-gray-900">{formatAmount(orderStats.successfulAmount)}</p>
                  <p className="text-sm text-gray-600">{orderStats.successfulOrders.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Canceled Card */}
          <Card className="bg-red-50/50 border-red-200">
            <CardContent className="p-4">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">Canceled</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-lg font-bold text-gray-900">{formatAmount(orderStats.canceledAmount)}</p>
                  <p className="text-sm text-gray-600">{orderStats.canceledOrders}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reward Metrics Card - Rightmost */}
        {rewardMetrics && (
          <Card className="w-full bg-amber-50/50 border-amber-200">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Reward Metrics</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="text-xs"
                    onClick={onHistoryClick}
                  >
                    History
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-700 mb-1">Target</p>
                    <p className="text-base font-bold text-gray-900">{formatAmount(rewardMetrics.target)}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Spend {formatAmount(rewardMetrics.target)} to unlock {rewardMetrics.reward}
                    </p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-700 mb-1">Amount spent</p>
                    <p className="text-base font-bold text-gray-900">{formatAmount(rewardMetrics.amountSpent)}</p>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 relative h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500 transition-all"
                          style={{ width: `${progressPercentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-900 min-w-[40px]">{progressPercentage}%</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-700 mb-1">Reward</p>
                    <p className="text-base font-bold text-gray-900">{rewardMetrics.reward}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-700">Status</p>
                    <div className="flex items-center gap-1 bg-yellow-100 px-2 py-1 rounded">
                      <Trophy className="w-4 h-4 text-yellow-600" />
                      <span className="text-xs font-semibold text-yellow-800">{rewardMetrics.status}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </Card>
    </div>
  )
}

