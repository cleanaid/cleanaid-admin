"use client"

import { useState } from "react"
import { Plus, AlertCircle, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BroadcastRecordsTable } from "@/components/dashboard"
import { useBroadcasts, useCreateBroadcast } from "@/api/hooks"
import { CreateBroadcastPayload } from "@/types/broadcast"

export default function BroadcastPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const limit = 10

  // Form state
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [receivers, setReceivers] = useState<string[]>([])
  const [deliveryChannels, setDeliveryChannels] = useState<("email" | "sms" | "in_app" | "lock_screen")[]>([])
  const [scheduledDate, setScheduledDate] = useState("")
  const [scheduledTime, setScheduledTime] = useState("")

  // Fetch broadcasts
  const { data: broadcastsResponse, isLoading } = useBroadcasts({ page: currentPage, limit })
  const broadcasts = broadcastsResponse?.data ?? []
  const pagination = broadcastsResponse?.pagination

  // Create broadcast mutation
  const createBroadcast = useCreateBroadcast({
    onSuccess: () => {
      setSuccess("Broadcast created successfully")
      setError(null)
      // Reset form
      setTitle("")
      setContent("")
      setReceivers([])
      setDeliveryChannels([])
      setScheduledDate("")
      setScheduledTime("")
      // Reset to page 1 to show the new broadcast at the top
      setCurrentPage(1)
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(null), 5000)
    },
    onError: (error: Error) => {
      setError(error.message || "Failed to create broadcast")
      setSuccess(null)
      // Clear error message after 5 seconds
      setTimeout(() => setError(null), 5000)
    },
  })

  const handleDeliveryChannelToggle = (channel: "email" | "sms" | "in_app" | "lock_screen") => {
    setDeliveryChannels((prev) =>
      prev.includes(channel) ? prev.filter((c) => c !== channel) : [...prev, channel]
    )
  }

  const handleAddReceiver = () => {
    // TODO: Implement receiver selection modal/dialog
    // For now, just add a placeholder
    const newReceiver = prompt("Enter receiver email or select from list")
    if (newReceiver) {
      setReceivers((prev) => [...prev, newReceiver])
    }
  }

  const handleSendMessage = () => {
    if (!title || !content) {
      setError("Title and content are required")
      setSuccess(null)
      setTimeout(() => setError(null), 5000)
      return
    }

    if (deliveryChannels.length === 0) {
      setError("Please select at least one delivery channel")
      setSuccess(null)
      setTimeout(() => setError(null), 5000)
      return
    }

    // Combine date and time
    let scheduledDateTime: string | undefined
    if (scheduledDate && scheduledTime) {
      const date = new Date(`${scheduledDate}T${scheduledTime}`)
      scheduledDateTime = date.toISOString()
    }

    const payload: CreateBroadcastPayload = {
      title,
      content,
      receivers: receivers.length > 0 ? receivers : "all",
      deliveryChannels,
      scheduledDate: scheduledDateTime,
    }

    createBroadcast.mutate(payload)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleViewBroadcast = (broadcastId: string) => {
    // TODO: Implement view broadcast details
    console.log("View broadcast:", broadcastId)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Broadcast</h1>
      </div>

      {/* New Broadcast Section */}
      <Card className="bg-white border border-gray-200">
        <CardContent className="p-6 space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">New Broadcast</h2>

          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Title and Content */}
            <div className="lg:col-span-2 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="<User> 25% Bonus"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  placeholder="Hi, we are running promo 25% off this weekend, take advantage of it today"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[200px]"
                />
              </div>

              {/* Delivery Channels */}
              <div className="space-y-2">
                <Label>Delivery Channels</Label>
                <div className="flex flex-wrap gap-3">
                  <Button
                    type="button"
                    variant={deliveryChannels.includes("email") ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleDeliveryChannelToggle("email")}
                    className={deliveryChannels.includes("email") ? "bg-blue-600 hover:bg-blue-700" : ""}
                  >
                    Email
                  </Button>
                  <Button
                    type="button"
                    variant={deliveryChannels.includes("sms") ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleDeliveryChannelToggle("sms")}
                    className={deliveryChannels.includes("sms") ? "bg-blue-600 hover:bg-blue-700" : ""}
                  >
                    SMS
                  </Button>
                  <Button
                    type="button"
                    variant={deliveryChannels.includes("in_app") ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleDeliveryChannelToggle("in_app")}
                    className={deliveryChannels.includes("in_app") ? "bg-blue-600 hover:bg-blue-700" : ""}
                  >
                    In-App
                  </Button>
                  <Button
                    type="button"
                    variant={deliveryChannels.includes("lock_screen") ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleDeliveryChannelToggle("lock_screen")}
                    className={deliveryChannels.includes("lock_screen") ? "bg-blue-600 hover:bg-blue-700" : ""}
                  >
                    Lock Screen
                  </Button>
                </div>
              </div>

              {/* Sending Date */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="scheduledDate">Sending date</Label>
                  <Input
                    id="scheduledDate"
                    type="date"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduledTime">Time</Label>
                  <Input
                    id="scheduledTime"
                    type="time"
                    value={scheduledTime}
                    onChange={(e) => setScheduledTime(e.target.value)}
                  />
                </div>
              </div>

              {/* Send Message Button */}
              <Button
                onClick={handleSendMessage}
                disabled={createBroadcast.isPending}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                {createBroadcast.isPending ? "Sending..." : "Send message"}
              </Button>
            </div>

            {/* Right Column: Receiver Selection */}
            <div className="space-y-2">
              <Label>Add receiver(s)</Label>
              <Card className="border-2 border-dashed border-gray-300 min-h-[300px] flex items-center justify-center">
                <CardContent className="p-6 text-center">
                  {receivers.length === 0 ? (
                    <div className="space-y-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                        <Plus className="h-6 w-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-500">Add receiver(s)</p>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddReceiver}
                      >
                        Add
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {receivers.map((receiver, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <span className="text-sm">{receiver}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => setReceivers((prev) => prev.filter((_, i) => i !== index))}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleAddReceiver}
                        className="mt-2"
                      >
                        Add More
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Records of Broadcast Section */}
      <BroadcastRecordsTable
        broadcasts={broadcasts}
        onViewBroadcast={handleViewBroadcast}
        currentPage={currentPage}
        limit={limit}
        pagination={pagination as { currentPage: number; totalPages: number; totalItems: number; pageSize: number } | undefined}
        onPageChange={handlePageChange}
        isLoading={isLoading}
      />
    </div>
  )
}

