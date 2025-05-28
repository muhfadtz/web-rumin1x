"use client"

import { DataGenerator } from "@/components/dashboard/data-generator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Settings, Bell, Database, Activity } from "lucide-react"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Settings className="h-6 w-6" />
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Data Management */}
        <div className="space-y-6">
          <DataGenerator />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Management
              </CardTitle>
              <CardDescription>Configure data retention and export settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="retention">Data Retention (days)</Label>
                <Input id="retention" type="number" defaultValue="30" />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="auto-cleanup" />
                <Label htmlFor="auto-cleanup">Auto-cleanup old data</Label>
              </div>

              <Separator />

              <Button variant="outline" className="w-full">
                Export All Data
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                System Status
              </CardTitle>
              <CardDescription>Current dashboard status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Data Source</span>
                <span className="text-sm text-green-600 font-medium">Mock Data (Active)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Real-time Updates</span>
                <span className="text-sm text-green-600 font-medium">Enabled</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Update Interval</span>
                <span className="text-sm text-muted-foreground">5 seconds</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dashboard Preferences */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Dashboard Preferences</CardTitle>
              <CardDescription>Customize your dashboard experience</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="refresh-rate">Dashboard Refresh Rate</Label>
                <select id="refresh-rate" className="w-full p-2 border rounded-md" defaultValue="5">
                  <option value="1">1 second</option>
                  <option value="5">5 seconds</option>
                  <option value="10">10 seconds</option>
                  <option value="30">30 seconds</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Input id="timezone" defaultValue="UTC" />
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="dark-mode" />
                <Label htmlFor="dark-mode">Dark mode</Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>Configure alert thresholds and notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Temperature Alerts</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="temp-min" className="text-xs">
                      Min (°C)
                    </Label>
                    <Input id="temp-min" type="number" defaultValue="15" />
                  </div>
                  <div>
                    <Label htmlFor="temp-max" className="text-xs">
                      Max (°C)
                    </Label>
                    <Input id="temp-max" type="number" defaultValue="35" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Humidity Alerts</Label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="humidity-min" className="text-xs">
                      Min (%)
                    </Label>
                    <Input id="humidity-min" type="number" defaultValue="30" />
                  </div>
                  <div>
                    <Label htmlFor="humidity-max" className="text-xs">
                      Max (%)
                    </Label>
                    <Input id="humidity-max" type="number" defaultValue="70" />
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch id="email-alerts" />
                <Label htmlFor="email-alerts">Email notifications</Label>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
