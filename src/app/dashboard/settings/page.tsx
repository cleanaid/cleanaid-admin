"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { 
  Shield, 
  Settings as SettingsIcon, 
  Users, 
  Key, 
  Bell, 
  Globe, 
  Database,
  Save,
  RefreshCw
} from "lucide-react"

// Mock data - will be replaced with real API calls
const mockAccessControlSettings = {
  userRegistration: {
    enabled: true,
    requireEmailVerification: true,
    requirePhoneVerification: false,
    autoApprove: false,
  },
  businessRegistration: {
    enabled: true,
    requireDocumentVerification: true,
    requireManualApproval: true,
    autoApprove: false,
  },
  adminPermissions: {
    canManageUsers: true,
    canManageBusinesses: true,
    canManagePayments: true,
    canViewAnalytics: true,
    canManageSettings: true,
  },
  securitySettings: {
    sessionTimeout: 30, // minutes
    requireTwoFactor: false,
    passwordMinLength: 8,
    passwordRequireSpecialChars: true,
  },
}

const mockApplicationSettings = {
  general: {
    appName: "Cleanaid Admin",
    appVersion: "1.0.0",
    maintenanceMode: false,
    debugMode: false,
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    adminAlerts: true,
  },
  integrations: {
    paymentGateway: "stripe",
    emailService: "sendgrid",
    smsService: "twilio",
    analyticsService: "google_analytics",
  },
  features: {
    darkMode: true,
    multiLanguage: false,
    advancedAnalytics: true,
    apiAccess: true,
  },
}

export default function SettingsPage() {
  const [accessControlSettings, setAccessControlSettings] = useState(mockAccessControlSettings)
  const [applicationSettings, setApplicationSettings] = useState(mockApplicationSettings)
  const [isSaving, setIsSaving] = useState(false)

  const handleSaveAccessControl = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log("Saving access control settings:", accessControlSettings)
    setIsSaving(false)
  }

  const handleSaveApplicationSettings = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log("Saving application settings:", applicationSettings)
    setIsSaving(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage system settings, access control, and application configuration.
        </p>
      </div>

      <Tabs defaultValue="access-control" className="space-y-4">
        <TabsList>
          <TabsTrigger value="access-control" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Access Control
          </TabsTrigger>
          <TabsTrigger value="application" className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Application
          </TabsTrigger>
        </TabsList>

        <TabsContent value="access-control" className="space-y-4">
          {/* User Registration Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>User Registration</span>
              </CardTitle>
              <CardDescription>
                Configure user registration and verification settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable User Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow new users to register on the platform
                  </p>
                </div>
                <Switch
                  checked={accessControlSettings.userRegistration.enabled}
                  onCheckedChange={(checked) => setAccessControlSettings({
                    ...accessControlSettings,
                    userRegistration: {
                      ...accessControlSettings.userRegistration,
                      enabled: checked
                    }
                  })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Email Verification</Label>
                  <p className="text-sm text-muted-foreground">
                    Users must verify their email before accessing the platform
                  </p>
                </div>
                <Switch
                  checked={accessControlSettings.userRegistration.requireEmailVerification}
                  onCheckedChange={(checked) => setAccessControlSettings({
                    ...accessControlSettings,
                    userRegistration: {
                      ...accessControlSettings.userRegistration,
                      requireEmailVerification: checked
                    }
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Phone Verification</Label>
                  <p className="text-sm text-muted-foreground">
                    Users must verify their phone number during registration
                  </p>
                </div>
                <Switch
                  checked={accessControlSettings.userRegistration.requirePhoneVerification}
                  onCheckedChange={(checked) => setAccessControlSettings({
                    ...accessControlSettings,
                    userRegistration: {
                      ...accessControlSettings.userRegistration,
                      requirePhoneVerification: checked
                    }
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto-approve Users</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically approve new user registrations
                  </p>
                </div>
                <Switch
                  checked={accessControlSettings.userRegistration.autoApprove}
                  onCheckedChange={(checked) => setAccessControlSettings({
                    ...accessControlSettings,
                    userRegistration: {
                      ...accessControlSettings.userRegistration,
                      autoApprove: checked
                    }
                  })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Business Registration Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-4 w-4" />
                <span>Business Registration</span>
              </CardTitle>
              <CardDescription>
                Configure business registration and verification settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Enable Business Registration</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow new businesses to register on the platform
                  </p>
                </div>
                <Switch
                  checked={accessControlSettings.businessRegistration.enabled}
                  onCheckedChange={(checked) => setAccessControlSettings({
                    ...accessControlSettings,
                    businessRegistration: {
                      ...accessControlSettings.businessRegistration,
                      enabled: checked
                    }
                  })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Document Verification</Label>
                  <p className="text-sm text-muted-foreground">
                    Businesses must submit verification documents
                  </p>
                </div>
                <Switch
                  checked={accessControlSettings.businessRegistration.requireDocumentVerification}
                  onCheckedChange={(checked) => setAccessControlSettings({
                    ...accessControlSettings,
                    businessRegistration: {
                      ...accessControlSettings.businessRegistration,
                      requireDocumentVerification: checked
                    }
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Manual Approval</Label>
                  <p className="text-sm text-muted-foreground">
                    All business registrations require manual admin approval
                  </p>
                </div>
                <Switch
                  checked={accessControlSettings.businessRegistration.requireManualApproval}
                  onCheckedChange={(checked) => setAccessControlSettings({
                    ...accessControlSettings,
                    businessRegistration: {
                      ...accessControlSettings.businessRegistration,
                      requireManualApproval: checked
                    }
                  })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Key className="h-4 w-4" />
                <span>Security Settings</span>
              </CardTitle>
              <CardDescription>
                Configure security and authentication settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input
                    id="session-timeout"
                    type="number"
                    value={accessControlSettings.securitySettings.sessionTimeout}
                    onChange={(e) => setAccessControlSettings({
                      ...accessControlSettings,
                      securitySettings: {
                        ...accessControlSettings.securitySettings,
                        sessionTimeout: parseInt(e.target.value) || 30
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password-length">Minimum Password Length</Label>
                  <Input
                    id="password-length"
                    type="number"
                    value={accessControlSettings.securitySettings.passwordMinLength}
                    onChange={(e) => setAccessControlSettings({
                      ...accessControlSettings,
                      securitySettings: {
                        ...accessControlSettings.securitySettings,
                        passwordMinLength: parseInt(e.target.value) || 8
                      }
                    })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Two-Factor Authentication</Label>
                  <p className="text-sm text-muted-foreground">
                    Force all admin users to use 2FA
                  </p>
                </div>
                <Switch
                  checked={accessControlSettings.securitySettings.requireTwoFactor}
                  onCheckedChange={(checked) => setAccessControlSettings({
                    ...accessControlSettings,
                    securitySettings: {
                      ...accessControlSettings.securitySettings,
                      requireTwoFactor: checked
                    }
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Require Special Characters in Passwords</Label>
                  <p className="text-sm text-muted-foreground">
                    Passwords must contain special characters
                  </p>
                </div>
                <Switch
                  checked={accessControlSettings.securitySettings.passwordRequireSpecialChars}
                  onCheckedChange={(checked) => setAccessControlSettings({
                    ...accessControlSettings,
                    securitySettings: {
                      ...accessControlSettings.securitySettings,
                      passwordRequireSpecialChars: checked
                    }
                  })}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSaveAccessControl} disabled={isSaving}>
              {isSaving ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Access Control Settings
                </>
              )}
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="application" className="space-y-4">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span>General Settings</span>
              </CardTitle>
              <CardDescription>
                Configure general application settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="app-name">Application Name</Label>
                  <Input
                    id="app-name"
                    value={applicationSettings.general.appName}
                    onChange={(e) => setApplicationSettings({
                      ...applicationSettings,
                      general: {
                        ...applicationSettings.general,
                        appName: e.target.value
                      }
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="app-version">Application Version</Label>
                  <Input
                    id="app-version"
                    value={applicationSettings.general.appVersion}
                    onChange={(e) => setApplicationSettings({
                      ...applicationSettings,
                      general: {
                        ...applicationSettings.general,
                        appVersion: e.target.value
                      }
                    })}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Put the application in maintenance mode
                  </p>
                </div>
                <Switch
                  checked={applicationSettings.general.maintenanceMode}
                  onCheckedChange={(checked) => setApplicationSettings({
                    ...applicationSettings,
                    general: {
                      ...applicationSettings.general,
                      maintenanceMode: checked
                    }
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Debug Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Enable debug logging and development features
                  </p>
                </div>
                <Switch
                  checked={applicationSettings.general.debugMode}
                  onCheckedChange={(checked) => setApplicationSettings({
                    ...applicationSettings,
                    general: {
                      ...applicationSettings.general,
                      debugMode: checked
                    }
                  })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Bell className="h-4 w-4" />
                <span>Notification Settings</span>
              </CardTitle>
              <CardDescription>
                Configure notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send email notifications to users
                  </p>
                </div>
                <Switch
                  checked={applicationSettings.notifications.emailNotifications}
                  onCheckedChange={(checked) => setApplicationSettings({
                    ...applicationSettings,
                    notifications: {
                      ...applicationSettings.notifications,
                      emailNotifications: checked
                    }
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send SMS notifications to users
                  </p>
                </div>
                <Switch
                  checked={applicationSettings.notifications.smsNotifications}
                  onCheckedChange={(checked) => setApplicationSettings({
                    ...applicationSettings,
                    notifications: {
                      ...applicationSettings.notifications,
                      smsNotifications: checked
                    }
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Push Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Send push notifications to mobile apps
                  </p>
                </div>
                <Switch
                  checked={applicationSettings.notifications.pushNotifications}
                  onCheckedChange={(checked) => setApplicationSettings({
                    ...applicationSettings,
                    notifications: {
                      ...applicationSettings.notifications,
                      pushNotifications: checked
                    }
                  })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Admin Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Send alerts to admin users for important events
                  </p>
                </div>
                <Switch
                  checked={applicationSettings.notifications.adminAlerts}
                  onCheckedChange={(checked) => setApplicationSettings({
                    ...applicationSettings,
                    notifications: {
                      ...applicationSettings.notifications,
                      adminAlerts: checked
                    }
                  })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Integration Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-4 w-4" />
                <span>Integration Settings</span>
              </CardTitle>
              <CardDescription>
                Configure third-party service integrations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Payment Gateway</Label>
                  <Select
                    value={applicationSettings.integrations.paymentGateway}
                    onValueChange={(value) => setApplicationSettings({
                      ...applicationSettings,
                      integrations: {
                        ...applicationSettings.integrations,
                        paymentGateway: value
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="stripe">Stripe</SelectItem>
                      <SelectItem value="paypal">PayPal</SelectItem>
                      <SelectItem value="square">Square</SelectItem>
                      <SelectItem value="razorpay">Razorpay</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Email Service</Label>
                  <Select
                    value={applicationSettings.integrations.emailService}
                    onValueChange={(value) => setApplicationSettings({
                      ...applicationSettings,
                      integrations: {
                        ...applicationSettings.integrations,
                        emailService: value
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sendgrid">SendGrid</SelectItem>
                      <SelectItem value="mailgun">Mailgun</SelectItem>
                      <SelectItem value="ses">AWS SES</SelectItem>
                      <SelectItem value="postmark">Postmark</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>SMS Service</Label>
                  <Select
                    value={applicationSettings.integrations.smsService}
                    onValueChange={(value) => setApplicationSettings({
                      ...applicationSettings,
                      integrations: {
                        ...applicationSettings.integrations,
                        smsService: value
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="twilio">Twilio</SelectItem>
                      <SelectItem value="aws_sns">AWS SNS</SelectItem>
                      <SelectItem value="messagebird">MessageBird</SelectItem>
                      <SelectItem value="nexmo">Nexmo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Analytics Service</Label>
                  <Select
                    value={applicationSettings.integrations.analyticsService}
                    onValueChange={(value) => setApplicationSettings({
                      ...applicationSettings,
                      integrations: {
                        ...applicationSettings.integrations,
                        analyticsService: value
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google_analytics">Google Analytics</SelectItem>
                      <SelectItem value="mixpanel">Mixpanel</SelectItem>
                      <SelectItem value="amplitude">Amplitude</SelectItem>
                      <SelectItem value="hotjar">Hotjar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleSaveApplicationSettings} disabled={isSaving}>
              {isSaving ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Application Settings
                </>
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
