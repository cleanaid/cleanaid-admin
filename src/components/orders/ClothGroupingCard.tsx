"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye } from "lucide-react"
import { cn } from "@/lib/utils"

interface ClothGroupingCardProps {
  clothType: string
  quantity: number
  services: string[]
  allergyInformation?: string
  images: string[]
  clothPrice: number | string
  badges?: Array<{ label: string; color: "red" | "yellow" | "blue" | "green" }>
  className?: string
  onViewImage?: (imageUrl: string) => void
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

const badgeColors = {
  red: "bg-red-500 text-white",
  yellow: "bg-yellow-500 text-white",
  blue: "bg-blue-500 text-white",
  green: "bg-green-500 text-white",
}

export function ClothGroupingCard({
  clothType,
  quantity,
  services,
  allergyInformation,
  images,
  clothPrice,
  badges = [],
  className,
  onViewImage,
}: ClothGroupingCardProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Cloth Grouping</h3>
              <span className="text-sm text-gray-500">Single Cloth | {clothType}</span>
            </div>
            <Badge className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200 text-gray-700 font-semibold">
              {quantity}
            </Badge>
          </div>

          {/* Services */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-700">Services</p>
              <p className="text-sm text-gray-600">{services.join(", ")}</p>
            </div>
          </div>

          {/* Allergy Information */}
          {allergyInformation && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-200 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-700">Allergy information</p>
                <p className="text-sm text-gray-600">{allergyInformation}</p>
              </div>
            </div>
          )}

          {/* Images */}
          {images.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Images</p>
              <div className="flex gap-2 flex-wrap">
                {images.map((imageUrl, index) => (
                  <div key={index} className="relative group">
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                      <img
                        src={imageUrl}
                        alt={`${clothType} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    {onViewImage && (
                      <button
                        onClick={() => onViewImage(imageUrl)}
                        className="absolute top-1 right-1 p-1 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Eye className="h-3 w-3 text-gray-600" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between pt-2 border-t">
            <div className="relative">
              <p className="text-sm text-gray-600">Cloth price</p>
              <p className="text-lg font-semibold">{formatAmount(clothPrice)}</p>
              {badges.length > 0 && (
                <div className="absolute -top-1 -right-8 flex gap-1">
                  {badges.map((badge, index) => (
                    <Badge
                      key={index}
                      className={cn(
                        "w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs font-bold",
                        badgeColors[badge.color]
                      )}
                      style={{ zIndex: badges.length - index }}
                    >
                      {badge.label}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

