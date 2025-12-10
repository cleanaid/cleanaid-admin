"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface LaundryInfoCardProps {
  orderId: string
  orderPrice: number | string
  paymentStatus: "pending" | "paid" | "failed" | "complete"
  collections: number
  clothes: number
  services: number
  customerInfo?: {
    id: string
    name: string
    address: string
    phone: string
    email: string
  }
  businessInfo?: {
    id: string
    name: string
    address: string
    phone: string
    email: string
  }
  onViewCustomer?: () => void
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

export function LaundryInfoCard({
  orderId,
  orderPrice,
  paymentStatus,
  collections,
  clothes,
  services,
  customerInfo,
  businessInfo,
  onViewCustomer,
  onViewBusiness,
}: LaundryInfoCardProps) {
  const paymentStatusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    paid: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-800",
    complete: "bg-green-100 text-green-700",
  }

  const paymentStatusLabels = {
    pending: "Pending",
    paid: "Paid",
    failed: "Failed",
    complete: "Complete",
  }

  return (
    <Card className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-2">
      {/* Order Information Card - Leftmost, White Background */}
      <div className="w-full bg-white border-gray-200">
        <div className="p-6">
          <div className="flex flex-col items-start justify-between gap-8">
            {/* Left side - Order Price and Payment Status */}
            <div className="flex-1 space-y-4">
              {/* Header */}
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-gray-800">Order information</h3>
                <span className="text-sm text-gray-400 font-normal">I.D {orderId}</span>
              </div>
              
              {/* Order Price */}
              <div className="space-y-1">
                <span className="text-sm text-gray-500 font-normal">Order price</span>
                <p className="text-[20px] md:text-[32px] font-bold text-gray-900 leading-none">{formatAmount(orderPrice)}</p>
              </div>

              {/* Payment Status */}
              <div className="flex items-center gap-2 pt-1">
                <span className="text-sm text-gray-500 font-normal">Payment Status</span>
                <Badge className={cn("rounded-md px-3 py-1 text-xs font-medium border-0", paymentStatusColors[paymentStatus])}>
                  {paymentStatusLabels[paymentStatus]}
                </Badge>
              </div>
            </div>

            {/* Right side - Summary Statistics (Vertical) */}
            <div className="flex gap-6">
              {/* Collections - Stacked Papers Icon */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center mb-2 relative">
                  {/* Two overlapping squares */}
                  <svg className="w-6 h-6 text-white absolute" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="4" y="6" width="12" height="14" rx="1"/>
                  </svg>
                  <svg className="w-6 h-6 text-white absolute -ml-1 -mt-1 opacity-80" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="4" y="6" width="12" height="14" rx="1"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-600 font-normal mb-1">Collections</span>
                <span className="text-lg font-bold text-gray-900">{collections}</span>
              </div>

              {/* Clothes - T-shirt Icon */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16.5 3c-.83 0-1.5.67-1.5 1.5v.5h-5v-.5C10 3.67 9.33 3 8.5 3S7 3.67 7 4.5V5H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2h-3v-.5c0-.83-.67-1.5-1.5-1.5z"/>
                  </svg>
                </div>
                <span className="text-xs text-gray-600 font-normal mb-1">Clothes</span>
                <span className="text-lg font-bold text-gray-900">{clothes}</span>
              </div>

              {/* Services - Hanger Icon */}
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-red-200 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v4M12 6c-2.5 0-4.5 2-4.5 4.5v8h9v-8c0-2.5-2-4.5-4.5-4.5z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600 font-normal mb-1">Services</span>
                <span className="text-lg font-bold text-gray-900">{services}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Info Card - Middle, Light Beige Background */}
      {customerInfo && (
        <Card className="w-full bg-amber-50/50 border-amber-200 shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className=" md:text-lg font-semibold text-gray-900">Customer Info</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400 font-normal">I.D {customerInfo.id}</span>
                  {onViewCustomer ? (
                    <button
                      onClick={onViewCustomer}
                      className="p-1 hover:bg-amber-100 rounded transition-colors"
                    >
                      <Eye className="h-4 w-4 text-gray-900" />
                    </button>
                  ) : (
                    <Eye className="h-4 w-4 text-gray-900" />
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[12px] md:text-[25px] font-bold text-gray-900 leading-tight">{customerInfo.name}</p>
                <div className="space-y-1.5 text-sm text-gray-600">
                  <p>{customerInfo.address}</p>
                  <p>{customerInfo.phone}</p>
                  <p>{customerInfo.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Business Info Card - Rightmost, Light Teal/Green Background */}
      {businessInfo && (
        <Card className="w-full bg-teal-50/50 border-teal-200 shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Business Info</h3>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400 font-normal">I.D {businessInfo.id}</span>
                  {onViewBusiness ? (
                    <button
                      onClick={onViewBusiness}
                      className="p-1 hover:bg-teal-100 rounded transition-colors"
                    >
                      <Eye className="h-4 w-4 text-gray-900" />
                    </button>
                  ) : (
                    <Eye className="h-4 w-4 text-gray-900" />
                  )}
                </div>
              </div>
              <div className="space-y-4">
                <p className="text-[12px] md:text-[25px] font-bold text-gray-900 leading-tight">{businessInfo.name}</p>
                <div className="space-y-1.5 text-sm text-gray-600">
                  <p>{businessInfo.address}</p>
                  <p>{businessInfo.phone}</p>
                  <p>{businessInfo.email}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </Card>
  )
}

