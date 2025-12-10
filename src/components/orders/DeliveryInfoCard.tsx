"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface DeliveryInfoCardProps {
  pickupLocation: string
  pickupTime: string
  deliveryTime: string
  deliveryStatus: string
  statusTimestamp?: string
  progressPercentage?: number
}

const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString)
    const time = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
    const dateFormatted = date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    return `${time} WAT | ${dateFormatted}`
  } catch {
    return dateString
  }
}

export function DeliveryInfoCard({
  pickupLocation,
  pickupTime,
  deliveryTime,
  deliveryStatus,
  statusTimestamp,
  progressPercentage = 0,
}: DeliveryInfoCardProps) {
  const statusColors: Record<string, string> = {
    "Out for pick up": "bg-blue-100 text-blue-800 border-blue-200",
    "In transit": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Delivered": "bg-green-100 text-green-800 border-green-200",
    "Pending": "bg-gray-100 text-gray-800 border-gray-200",
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <h3 className="text-xl font-semibold mb-4">Delivery information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {/* Delivery Information */}
          <div className="flex gap-1 items-end">
            <div className="bg-gray-100 p-2 rounded-lg">
              <label className="text-sm text-gray-500">Pick up location</label>
              <p className="text-gray-900 text-sm font-medium mt-1">{pickupLocation}</p>
            </div>
            <div className="bg-gray-100 p-2 rounded-lg">
              <label className="text-sm text-gray-500">Pick up time</label>
              <p className="text-gray-900 text-sm font-medium mt-1">{formatDate(pickupTime)}</p>
            </div>
            <div className="bg-gray-100 p-2 rounded-lg">
              <label className="text-sm text-gray-500">Delivery time</label>
              <p className="text-gray-900 text-sm font-medium mt-1">{formatDate(deliveryTime)}</p>
            </div>
          </div>

          {/* Delivery Status */}
          <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold">Delivery status</h3>
            <div className="flex items-center gap-3 mb-3">
              <Badge className={cn("rounded-full px-3 py-1", statusColors[deliveryStatus] || statusColors["Pending"])}>
                {deliveryStatus}
              </Badge>
              {statusTimestamp && (
                <span className="text-sm text-gray-600">{formatDate(statusTimestamp)}</span>
              )}
            </div>
            <div className="space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(Math.max(progressPercentage, 0), 100)}%` }}
                />
              </div>
              <div className="flex justify-end">
                <span className="text-sm font-medium text-gray-700">{progressPercentage}%</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

