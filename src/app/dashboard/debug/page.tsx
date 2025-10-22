"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DebugPage() {
  const [apiStatus, setApiStatus] = useState<string>("Not tested")
  const [apiData, setApiData] = useState<unknown>(null)

  const testAPI = async () => {
    setApiStatus("Testing...")
    try {
      const response = await fetch('http://localhost:8080/api/admin/users', {
        headers: {
          'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODkyMGEwMGVlYTUwZjZhN2QyMWRmZjAiLCJyb2xlIjoiYWRtaW4iLCJyb2xlSWQiOiI2ODkyMGEwMGVlYTUwZjZhN2QyMWRmZjMiLCJwaG9uZU51bWJlciI6IisyMzQ5MDc1MjExNDcxIiwiaWF0IjoxNzYwNTAxMDY1LCJleHAiOjE3NjA1MDQ2NjV9.WsyL46FRur6yWIYbwlklcPddDYB0QVwI7NQ1HayV1vw',
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setApiStatus("✅ API Working!")
        setApiData(data)
      } else {
        setApiStatus(`❌ API Error: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      setApiStatus(`❌ Connection Error: ${error}`)
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Debug Page</h1>
        <p className="text-muted-foreground">Test API connectivity and authentication</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>API Test</CardTitle>
          <CardDescription>Test the backend API connection</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={testAPI}>Test API Connection</Button>
          <div>
            <strong>Status:</strong> {apiStatus}
          </div>
          {apiData !== null && (
            <div>
              <strong>Response:</strong>
              <pre className="mt-2 p-4 bg-gray-100 rounded text-sm overflow-auto">
                {JSON.stringify(apiData, null, 2)}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Navigation Test</CardTitle>
          <CardDescription>Test if you can navigate to different pages</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button asChild variant="outline">
            <a href="/dashboard">Dashboard</a>
          </Button>
          <Button asChild variant="outline">
            <a href="/dashboard/users">Users</a>
          </Button>
          <Button asChild variant="outline">
            <a href="/test">Test Page</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
