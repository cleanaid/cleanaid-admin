"use client"

import { LucideIcon, TrendingUp } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SubMetric {
  label: string
  value: string | number
  color?: "green" | "yellow" | "orange" | "pink"
}

export interface MetricCardProps {
  title: string
  icon: LucideIcon
  iconColor?: string
  value: string | number
  subMetrics: SubMetric[]
  trend?: {
    percentage: number
    direction: "up" | "down"
  }
  className?: string
}

const subMetricColors = {
  green: "bg-green-100 text-green-800",
  yellow: "bg-yellow-100 text-yellow-800",
  orange: "bg-orange-100 text-orange-800",
  pink: "bg-pink-100 text-pink-800",
}

export function MetricCard({
  title,
  icon: Icon,
  iconColor = "text-blue-500",
  value,
  subMetrics,
  trend,
  className,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg bg-white p-4 border border-gray-200",
        className
      )}
    >
      {/* Header with Title and Icon */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
        <Icon className={cn("h-5 w-5", iconColor)} />
      </div>

      {/* Main Metric Value */}
      <div className="mb-4">
        <p className="text-3xl font-bold text-gray-900">
          {typeof value === "number" ? value.toLocaleString() : value}
        </p>
      </div>

      {/* Sub-Metrics */}
      <div className="space-y-2 mb-4">
        {subMetrics.map((subMetric, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center justify-between rounded-full px-5 py-5 text-xs font-medium",
              subMetricColors[subMetric.color || "green"]
            )}
          >
            <span>{subMetric.label}</span>
            <span className="font-bold">
              {typeof subMetric.value === "number"
                ? subMetric.value.toLocaleString()
                : subMetric.value}
            </span>
          </div>
        ))}
      </div>

      {/* Trend Indicator */}
      {trend && (
        <div className="flex items-center gap-1 text-xs text-green-600">
          <TrendingUp className="h-3 w-3" />
          {trend.percentage}% 
          <span className="text-black">
            {trend.direction === "up" ? "Up" : "Down"} from
            yesterday
          </span>
        </div>
      )}
    </div>
  )
}

