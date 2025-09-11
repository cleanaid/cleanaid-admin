import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Building2, ShoppingCart, AlertTriangle, CreditCard, TrendingUp } from "lucide-react"

export default function DashboardPage() {
  // Mock data - will be replaced with real API calls
  const stats = [
    {
      title: "Total Users",
      value: "12,345",
      description: "+20.1% from last month",
      icon: Users,
      trend: "up"
    },
    {
      title: "Active Businesses",
      value: "1,234",
      description: "+5.2% from last month",
      icon: Building2,
      trend: "up"
    },
    {
      title: "Total Orders",
      value: "45,678",
      description: "+12.3% from last month",
      icon: ShoppingCart,
      trend: "up"
    },
    {
      title: "Complaints",
      value: "23",
      description: "-8.1% from last month",
      icon: AlertTriangle,
      trend: "down"
    },
    {
      title: "Total Payouts",
      value: "$234,567",
      description: "+15.7% from last month",
      icon: CreditCard,
      trend: "up"
    },
    {
      title: "Revenue",
      value: "$456,789",
      description: "+18.2% from last month",
      icon: TrendingUp,
      trend: "up"
    }
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome to the Cleanaid Admin Dashboard. Here&apos;s an overview of your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title} className="hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 hover:scale-[1.02] cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className={`text-xs ${
                  stat.trend === "up" ? "text-green-600" : "text-red-600"
                }`}>
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 hover:scale-[1.02] cursor-pointer">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>
              Latest orders from your platform
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Order #{1000 + i}</p>
                    <p className="text-xs text-muted-foreground">
                      Cleaning service - $45.00
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {i}h ago
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg hover:shadow-primary/10 transition-all duration-200 hover:scale-[1.02] cursor-pointer">
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>
              New user registrations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">User {i}</p>
                    <p className="text-xs text-muted-foreground">
                      user{i}@example.com
                    </p>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {i}h ago
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
