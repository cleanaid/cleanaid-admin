"use client"

import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface UserStatCardProps {
  title: string
  icon: LucideIcon
  iconBgColor?: string
  value: string | number
  className?: string
}

export function UserStatCard({
  title,
  icon: Icon,
  iconBgColor = "bg-blue-100",
  value,
  className,
}: UserStatCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg bg-gray-50 p-6 border border-gray-200",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
          <p className="text-3xl font-bold text-gray-900">
            {typeof value === "number" ? value.toLocaleString() : value}
          </p>
        </div>
        <div className={cn("p-3 rounded-lg", iconBgColor)}>
          <Icon className={cn("h-6 w-6", iconBgColor.includes("blue") ? "text-blue-500" : iconBgColor.includes("green") ? "text-green-500" : "text-orange-500")} />
        </div>
      </div>
    </div>
  )
}

