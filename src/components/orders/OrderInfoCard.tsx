"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface OrderInfoCardProps {
  orderId: string
  orderPrice: number | string
  paymentStatus: "pending" | "paid" | "failed" | "complete"
  collections: number
  clothes: number
  services: number
}

interface CustomerInfoCardProps {
  customerInfo: {
    id: string
    name: string
    address: string
    phone: string
    email: string
  }
  onViewCustomer?: () => void
}

interface BusinessInfoCardProps {
  businessInfo: {
    id: string
    name: string
    address: string
    phone: string
    email: string
  }
  onViewBusiness?: () => void
}

const formatAmount = (amount: number | string): string => {
  const numAmount = typeof amount === "string" ? parseFloat(amount.replace(/[^0-9.-]+/g, "")) : amount
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount)
}

export function OrderInfoCard({
  orderId,
  orderPrice,
  paymentStatus,
  collections,
  clothes,
  services,
}: OrderInfoCardProps) {
  const paymentStatusColors = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
    paid: "bg-green-100 text-green-800 border-green-200",
    failed: "bg-red-100 text-red-800 border-red-200",
    complete: "bg-green-100 text-green-800 border-green-200",
  }

  const paymentStatusLabels = {
    pending: "Pending",
    paid: "Paid",
    failed: "Failed",
    complete: "Complete",
  }

  return (
    <Card className="w-full bg-white">
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-6">
          {/* Left side - Order Price and Payment Status */}
          <div className="flex-1 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Order information</h3>
              <span className="text-sm text-gray-500">I.D {orderId}</span>
            </div>
            
            {/* Order Price */}
            <div className="space-y-1">
              <span className="text-sm text-gray-600">Order price</span>
              <p className="text-3xl font-bold text-gray-900">{formatAmount(orderPrice)}</p>
            </div>

            {/* Payment Status */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Payment Status</span>
              <Badge className={cn("rounded-full px-3 py-1 text-xs font-medium", paymentStatusColors[paymentStatus])}>
                {paymentStatusLabels[paymentStatus]}
              </Badge>
            </div>
          </div>

          {/* Right side - Summary Statistics (Vertical) */}
          <div className="flex flex-col gap-4">
            {/* Collections - Stacked Papers Icon */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mb-2 relative">
                {/* Three overlapping squares */}
                <svg className="w-6 h-6 text-white absolute" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="4" y="6" width="12" height="14" rx="1"/>
                </svg>
                <svg className="w-6 h-6 text-white absolute -ml-1 -mt-1 opacity-70" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="4" y="6" width="12" height="14" rx="1"/>
                </svg>
                <svg className="w-6 h-6 text-white absolute -ml-2 -mt-2 opacity-50" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="4" y="6" width="12" height="14" rx="1"/>
                </svg>
              </div>
              <span className="text-xs text-gray-600 mb-1">Collections</span>
              <span className="text-lg font-semibold text-gray-900">{collections}</span>
            </div>

            {/* Clothes - T-shirt Icon */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16.5 3c-.83 0-1.5.67-1.5 1.5v.5h-5v-.5C10 3.67 9.33 3 8.5 3S7 3.67 7 4.5V5H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-3v-.5c0-.83-.67-1.5-1.5-1.5z"/>
                </svg>
              </div>
              <span className="text-xs text-gray-600 mb-1">Clothes</span>
              <span className="text-lg font-semibold text-gray-900">{clothes}</span>
            </div>

            {/* Services - Hanger Icon */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center mb-2">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4M12 6c-2.5 0-4.5 2-4.5 4.5v8h9v-8c0-2.5-2-4.5-4.5-4.5z" />
                </svg>
              </div>
              <span className="text-xs text-gray-600 mb-1">Services</span>
              <span className="text-lg font-semibold text-gray-900">{services}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function CustomerInfoCard({ customerInfo, onViewCustomer }: CustomerInfoCardProps) {
  return (
    <Card className="w-full bg-amber-50/50 border-amber-200">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Customer Info</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">I.D {customerInfo.id}</span>
              {onViewCustomer ? (
                <button
                  onClick={onViewCustomer}
                  className="p-1 hover:bg-amber-100 rounded transition-colors"
                >
                  <Eye className="h-4 w-4 text-gray-700" />
                </button>
              ) : (
                <Eye className="h-4 w-4 text-gray-700" />
              )}
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-2xl font-bold text-gray-900">{customerInfo.name}</p>
            <div className="space-y-1.5 text-sm">
              <p className="text-gray-600">{customerInfo.address}</p>
              <p className="text-gray-600">{customerInfo.phone}</p>
              <p className="text-gray-600">{customerInfo.email}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function BusinessInfoCard({ businessInfo, onViewBusiness }: BusinessInfoCardProps) {
  return (
    <Card className="w-full bg-teal-50/50 border-teal-200">
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Business Info</h3>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">I.D {businessInfo.id}</span>
              {onViewBusiness ? (
                <button
                  onClick={onViewBusiness}
                  className="p-1 hover:bg-teal-100 rounded transition-colors"
                >
                  <Eye className="h-4 w-4 text-gray-700" />
                </button>
              ) : (
                <Eye className="h-4 w-4 text-gray-700" />
              )}
            </div>
          </div>
          <div className="space-y-3">
            <p className="text-2xl font-bold text-gray-900">{businessInfo.name}</p>
            <div className="space-y-1.5 text-sm">
              <p className="text-gray-600">{businessInfo.address}</p>
              <p className="text-gray-600">{businessInfo.phone}</p>
              <p className="text-gray-600">{businessInfo.email}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

