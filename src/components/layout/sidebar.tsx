"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Users,
  Building2,
  CreditCard,
  Wallet,
  BarChart3,
  Megaphone,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronUp,
  ChevronDown,
  Shirt,
} from "lucide-react"
import { useState } from "react"

interface SidebarProps {
  className?: string
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isManagementOpen, setIsManagementOpen] = useState(
    pathname?.includes('/dashboard/users') || pathname?.includes('/dashboard/businesses')
  )

  const mainNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Laundry", href: "/dashboard/laundry", icon: Shirt },
  ]

  const managementItems = [
    { name: "Users", href: "/dashboard/users", icon: Users },
    { name: "Business", href: "/dashboard/businesses", icon: Building2 },
  ]

  const adminNavigation = [
    { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
    { name: "Pay Outs", href: "/dashboard/payouts", icon: Wallet },
    { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Broadcast", href: "/dashboard/broadcast", icon: Megaphone },
  ]

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50 bg-background">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="bg-background shadow-md border-primary/20 hover:border-primary hover:bg-primary/5"
        >
          {isMobileMenuOpen ? (
            <X className="h-4 w-4" />
          ) : (
            <Menu className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex items-center justify-center py-[34]">
            <Image 
              src="/logo.svg" 
              alt="Cleanaid Logo" 
              width={100}
              height={100}
              unoptimized
            />
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2 p-4 overflow-y-auto">
            {/* Main Navigation */}
            {mainNavigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 hover:scale-[1.02]",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                </Link>
              )
            })}

            {/* Management Dropdown */}
            <div className="space-y-1">
              <button
                onClick={() => setIsManagementOpen(!isManagementOpen)}
                className={cn(
                  "w-full flex items-center justify-between gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 hover:scale-[1.02]",
                  isManagementOpen
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                )}
              >
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4" />
                  <span>Management</span>
                </div>
                {isManagementOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
              
              {isManagementOpen && (
                <div className="ml-4 space-y-1 border-l-2 border-primary/20 pl-4">
                  {managementItems.map((item) => {
                    const isActive = pathname === item.href
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                          isActive
                            ? "bg-primary text-primary-foreground shadow-md"
                            : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                        )}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <item.icon className="h-4 w-4" />
                        {item.name}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Separator */}
            <div className="border-t border-border my-2" />

            {/* Admin Section */}
            <div className="space-y-1">
              <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Admin
              </div>
              {adminNavigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 hover:scale-[1.02]",
                      isActive
                        ? "bg-primary text-primary-foreground shadow-md"
                        : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    )}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                )
              })}
            </div>

            {/* Separator */}
            <div className="border-t border-border my-2" />

            {/* Settings */}
            <Link
              href="/dashboard/settings"
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-200 hover:scale-[1.02]",
                pathname === "/dashboard/settings"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:bg-primary/10 hover:text-primary"
              )}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>

          {/* Logout */}
          <div className="border-t p-4">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 text-muted-foreground hover:text-accent-foreground"
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
