"use client"

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface OrdersChartProps {
  data: Array<{
    month: string
    value: number
    count: number
    completed: number
    pending: number
    cancelled: number
  }>
  summary: {
    totalOrders: number
    completed: number
    pending: number
    cancelled: number
  } | undefined
  year: number
  onYearChange: (year: number) => void
}

interface TooltipPayloadItem {
  payload: {
    count?: number
    completed?: number
    pending?: number
    cancelled?: number
  }
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: TooltipPayloadItem['payload'] }> }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-blue-600 text-white p-3 rounded-lg shadow-lg">
        <p className="font-semibold mb-2">No. of Orders: {data.count?.toLocaleString() || 0}</p>
        <p className="text-sm">Completed: {data.completed?.toLocaleString() || 0}</p>
        <p className="text-sm">Pending: {data.pending?.toLocaleString() || 0}</p>
        <p className="text-sm">Cancelled: {data.cancelled?.toLocaleString() || 0}</p>
      </div>
    )
  }
  return null
}

interface DotProps {
  cx?: number
  cy?: number
}

const CustomDot = ({ cx, cy }: DotProps) => {
  if (cx === undefined || cy === undefined) return null
  return (
    <circle
      cx={cx}
      cy={cy}
      r={4}
      fill="#2563eb"
      stroke="#fff"
      strokeWidth={2}
    />
  )
}

export function OrdersChart({ data, year, onYearChange }: OrdersChartProps) {
  const formatValue = (value: number) => {
    return `${Math.round(value)}%`
  }

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Total Orders</h2>
        <div className="flex items-center gap-2">
          <Select value={year.toString()} onValueChange={(val) => onYearChange(parseInt(val))}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 3 }, (_, i) => {
                const y = new Date().getFullYear() - i
                return (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e5e7eb" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <YAxis
            domain={[20, 100]}
            tickFormatter={formatValue}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#2563eb"
            strokeWidth={2}
            dot={<CustomDot />}
            activeDot={{ r: 6, fill: '#2563eb' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

