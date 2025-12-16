"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Eye, Users, Wrench, Crown, Loader2 } from "lucide-react"
import { useAdmins, useAdminStats } from "@/api/hooks"

export default function SettingsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 10

  // Fetch admin data from API
  const { data: adminsResponse, isLoading: adminsLoading } = useAdmins({
    page: currentPage,
    limit,
    search: searchQuery,
  }) as {
    data?: {
      data: Array<{
        _id: string;
        name: string;
        email: string;
        accessLevel: string;
        status: string;
      }>;
    };
    isLoading: boolean;
  }

  // Fetch admin stats from API
  const { data: statsResponse, isLoading: statsLoading } = useAdminStats() as {
    data?: {
      data: {
        management: number;
        marketingEditors: number;
        itPMs: number;
        total: number;
      };
    };
    isLoading: boolean;
  }

  const admins = adminsResponse?.data || []
  const stats = statsResponse?.data || { management: 0, marketingEditors: 0, itPMs: 0, total: 0 }

  const handleAddAdmin = () => {
    // TODO: Implement add admin functionality
    console.log("Add new admin")
  }

  const handleViewAdmin = (adminId: string) => {
    // TODO: Implement view admin details
    console.log("View admin:", adminId)
  }

  const handleChangePassword = () => {
    // TODO: Implement change password functionality
    console.log("Change password")
  }

  const handleChangeEmail = () => {
    // TODO: Implement change email functionality
    console.log("Change email")
  }

  const handleChangePhone = () => {
    // TODO: Implement change phone functionality
    console.log("Change phone")
  }

  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-[#4CAF50] text-white"
      case "deleted":
        return "bg-[#EF5350] text-white"
      case "inactive":
        return "bg-gray-200 text-gray-700"
      default:
        return "bg-gray-200 text-gray-700"
    }
  }

  return (
    <div className="space-y-6 p-6">
      <Tabs defaultValue="access-control" className="space-y-6">
        <TabsList className="bg-transparent border-b rounded-none w-full justify-start h-auto p-0">
          <TabsTrigger 
            value="access-control" 
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none pb-3 font-semibold text-base"
          >
            Access Control
          </TabsTrigger>
          <TabsTrigger 
            value="credentials" 
            className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-black rounded-none pb-3 font-semibold text-base"
          >
            Credentials
          </TabsTrigger>
        </TabsList>

        <TabsContent value="access-control" className="space-y-6 mt-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-2">Management</p>
                  {statsLoading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  ) : (
                    <p className="text-3xl font-bold">{stats.management.toString().padStart(2, '0')}</p>
                  )}
                </div>
                <div className="bg-blue-100 rounded-full p-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-2">Marketing/Editors</p>
                  {statsLoading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  ) : (
                    <p className="text-3xl font-bold">{stats.marketingEditors.toString().padStart(2, '0')}</p>
                  )}
                </div>
                <div className="bg-green-100 rounded-full p-4">
                  <Wrench className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-2">IT/PMs</p>
                  {statsLoading ? (
                    <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                  ) : (
                    <p className="text-3xl font-bold">{stats.itPMs.toString().padStart(2, '0')}</p>
                  )}
                </div>
                <div className="bg-red-100 rounded-full p-4">
                  <Crown className="h-8 w-8 text-red-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Admins Table */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">List of Admins</h2>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Input
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-80 rounded-full border-gray-300"
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <Button
                  onClick={handleAddAdmin}
                  className="bg-[#4CAF50] hover:bg-[#45a049] text-white rounded-full px-6"
                >
                  <span className="mr-2 text-xl">+</span>
                  Add
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-y border-gray-200">
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">S/N</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Access Level</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-4 px-4 font-semibold text-gray-700"></th>
                  </tr>
                </thead>
                <tbody>
                  {adminsLoading ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400 mx-auto" />
                        <p className="mt-2 text-gray-500">Loading admins...</p>
                      </td>
                    </tr>
                  ) : admins.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-500">
                        No admins found
                      </td>
                    </tr>
                  ) : (
                    admins.map((admin, index) => (
                      <tr key={admin._id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4 text-gray-700">{(currentPage - 1) * limit + index + 1}</td>
                        <td className="py-4 px-4 text-gray-700">{admin.name}</td>
                        <td className="py-4 px-4 text-gray-700">{admin.accessLevel}</td>
                        <td className="py-4 px-4 text-gray-700">{admin.email || 'N/A'}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`inline-block px-4 py-1 rounded-full text-sm font-medium capitalize ${getStatusClass(
                              admin.status
                            )}`}
                          >
                            {admin.status}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleViewAdmin(admin._id)}
                            className="text-gray-700 hover:text-gray-900"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="credentials" className="space-y-4 mt-6">
          <h2 className="text-2xl font-bold mb-6">Credentials</h2>

          {/* Last Password Change */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Last Password Change</h3>
                <p className="text-gray-500 bg-gray-100 px-4 py-2 rounded-lg inline-block">
                  20th Sept. 2025
                </p>
              </div>
              <Button
                onClick={handleChangePassword}
                className="bg-black hover:bg-gray-800 text-white rounded-full px-6"
              >
                Change password
              </Button>
            </div>
          </div>

          {/* Last Email Change */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Last Email Change</h3>
                <p className="text-gray-500 bg-gray-100 px-4 py-2 rounded-lg inline-block">
                  20th Sept. 2025
                </p>
              </div>
              <Button
                onClick={handleChangeEmail}
                className="bg-black hover:bg-gray-800 text-white rounded-full px-6"
              >
                Change Email
              </Button>
            </div>
          </div>

          {/* Last Phone Change */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">Last Phone Change</h3>
                <p className="text-gray-500 bg-gray-100 px-4 py-2 rounded-lg inline-block">
                  20th Sept. 2025
                </p>
              </div>
              <Button
                onClick={handleChangePhone}
                className="bg-black hover:bg-gray-800 text-white rounded-full px-6"
              >
                Change Phone
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
