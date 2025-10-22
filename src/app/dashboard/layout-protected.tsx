import { DashboardLayout } from "@/components/layout/dashboard-layout"
// import { ProtectedRoute } from "@/components/protected-route"

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // Temporarily disable protected route for development
    // <ProtectedRoute>
      <DashboardLayout>{children}</DashboardLayout>
    // </ProtectedRoute>
  )
}
