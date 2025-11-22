"use client"

import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface PaymentStatCardProps {
  title: string
  icon: LucideIcon
  iconBgColor?: string
  value: string | number
  className?: string
  size?: "large" | "normal" | "split"
  splitTitle?: string
  splitIcon?: LucideIcon
  splitIconBgColor?: string
  splitValue?: string | number
}

export function PaymentStatCard({
  title,
  icon: Icon,
  iconBgColor = "bg-blue-100",
  value,
  className,
  size = "normal",
  splitTitle,
  splitIcon: SplitIcon,
  splitIconBgColor,
  splitValue,
}: PaymentStatCardProps) {
  const formatValue = (val: string | number) => {
    if (typeof val === "string") return val
    return val.toLocaleString()
  }

  // Large card (Total Amount)
  if (size === "large") {
    return (
      <div
        className={cn(
          "rounded-lg bg-white border border-gray-200 p-6 flex flex-col",
          className
        )}
      >
        <div className="flex items-center gap-4  mb-4">
          <div className={cn("p-3 rounded-full", iconBgColor)}>
            <Icon className={cn("h-8 w-8", iconBgColor.includes("blue") ? "text-blue-500" : "text-gray-500")} />
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
        </div>
        <div className="flex-1">
          <p className="text-3xl font-bold text-gray-900">
            {formatValue(value)}
          </p>
        </div>
      </div>
    )
  }

  // Split card (Business/User, Profit/Refunds)
  if (size === "split" && splitTitle && SplitIcon && splitValue) {
    return (
      <div
        className={cn(
          "rounded-lg bg-white border border-gray-200 p-6",
          className
        )}
      >
        <div className="flex flex-col gap-6">
          {/* Top Section */}
          <div className="flex items-start justify-between">
            <div className="flex">
              <div className="flex items-center gap-3 mb-2">
                <div className={cn("p-2 rounded-full", iconBgColor)}>
                  <Icon className={cn("h-5 w-5", iconBgColor.includes("green") ? "text-green-600" : iconBgColor.includes("teal") ? "text-teal-600" : "text-gray-500")} />
                </div>
                <h3 className="text-sm font-medium text-gray-600">{title}</h3>
              </div>
              <p className="text-xl font-bold text-gray-900 ml-11">
                {formatValue(value)}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200"></div>

          {/* Bottom Section */}
          <div className="flex items-start justify-between">
            <div className="flex">
              <div className="flex items-center gap-3 mb-2">
                <div className={cn("p-2 rounded-full", splitIconBgColor)}>
                  <SplitIcon className={cn("h-5 w-5", splitIconBgColor?.includes("yellow") ? "text-yellow-600" : splitIconBgColor?.includes("blue") ? "text-blue-600" : "text-gray-500")} />
                </div>
                <h3 className="text-sm font-medium text-gray-600">{splitTitle}</h3>
              </div>
              <p className="text-xl font-bold text-gray-900 ml-11">
                {formatValue(splitValue)}
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Normal card (Withdrawals)
  return (
    <div
      className={cn(
        "rounded-lg bg-white border border-gray-200 p-6",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex">
          <div className="flex items-center gap-3 mb-2">
            <div className={cn("p-2 rounded-full", iconBgColor)}>
              <Icon className={cn("h-5 w-5", iconBgColor.includes("red") ? "text-red-600" : "text-gray-500")} />
            </div>
            <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          </div>
          <p className="text-xl font-bold text-gray-900 ml-11">
            {formatValue(value)}
          </p>
        </div>
      </div>
    </div>
  )
}

