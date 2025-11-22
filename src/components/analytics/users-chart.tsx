"use client"

import { useState } from "react"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface UsersChartProps {
  data: Array<{
    month: string
    value: number
    count: number
    active: number
    inactive: number
  }>
  summary: {
    totalUsers: number
    activeUsers: number
    inactiveUsers: number
    returnedUsers: number
  } | undefined
  year: number
  location: string
  onYearChange: (year: number) => void
  onLocationChange: (location: string) => void
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-blue-600 text-white p-3 rounded-lg shadow-lg">
        <p className="font-semibold mb-2">Total Users: {data.count?.toLocaleString() || 0}</p>
        <p className="text-sm">Active: {data.active?.toLocaleString() || 0}</p>
        <p className="text-sm">Inactive: {data.inactive?.toLocaleString() || 0}</p>
        <p className="text-sm">Returned: {data.returned?.toLocaleString() || 0}</p>
      </div>
    )
  }
  return null
}

const CustomDot = (props: any) => {
  const { cx, cy } = props
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

export function UsersChart({ data, summary, year, location, onYearChange, onLocationChange }: UsersChartProps) {
  const [activeTab, setActiveTab] = useState<"business" | "users">("business")

  const formatValue = (value: number) => {
    return `${Math.round(value)}%`
  }

  // Calculate yearly total (sum of all monthly counts)
  const yearlyTotal = data.reduce((sum, item) => sum + item.count, 0)

  return (
    <div className="p-6 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold">Users</h2>
          <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as "business" | "users")}>
            <TabsList>
              <TabsTrigger value="business">Business</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-right mr-4">
            <p className="text-sm text-gray-600">No. of Users (yr)</p>
            <p className="text-2xl font-bold text-blue-600">{yearlyTotal.toLocaleString()}</p>
          </div>
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
          <Select value={location || "all"} onValueChange={onLocationChange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="lagos">Lagos</SelectItem>
              <SelectItem value="abuja">Abuja</SelectItem>
              <SelectItem value="port-harcourt">Port Harcourt</SelectItem>
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

