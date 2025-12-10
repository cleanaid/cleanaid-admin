"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface ClothCollectionCardProps {
  collectionName: string
  clothesCount: number
  servicesCount: number
  collectionPrice: number | string
  badges?: Array<{ label: string; color: "red" | "yellow" | "blue" | "green" }>
  className?: string
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

export function ClothCollectionCard({
  collectionName,
  clothesCount,
  servicesCount,
  collectionPrice,
  className,
}: ClothCollectionCardProps) {
  return (
    <Card className={cn("w-full", className)}>
      <CardContent className="p-6">
        <div className="space-y-4">
          <h3 className="text-xl font-bold">{collectionName}</h3>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-yellow-200 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-600">Clothes</p>
                <p className="text-lg font-semibold">{clothesCount}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-red-200 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-600">Services</p>
                <p className="text-lg font-semibold">{servicesCount}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="relative">
              <p className="text-sm text-gray-600">Collection price</p>
              <p className="text-lg font-semibold">{formatAmount(collectionPrice)}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}


