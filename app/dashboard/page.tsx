"use client"

import { SensorCard } from "@/components/dashboard/sensor-card"
import { SensorChart } from "@/components/dashboard/sensor-chart"
import { useLatestSensorValues, useSensorData } from "@/hooks/use-sensor-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import { QuickStats } from "@/components/dashboard/quick-stats"
import { SystemHealth } from "@/components/dashboard/system-health"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const { values: latestValues, loading: valuesLoading } = useLatestSensorValues()
  const { data: allSensorData, loading: dataLoading, error } = useSensorData()

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Real-time monitoring of your IoT sensors</p>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            <div className="space-y-2">
              <p>Error loading sensor data: {error}</p>
              <p className="text-sm">
                This might be due to Firebase configuration issues. Please check the Settings page for connection
                status.
              </p>
            </div>
          </AlertDescription>
        </Alert>
        <div className="flex gap-4">
          <Button asChild>
            <Link href="/dashboard/settings">Check Firebase Status</Link>
          </Button>
        </div>
      </div>
    )
  }

  if (valuesLoading || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const sensorTypes = ["temperature", "humidity", "light", "gas"] as const

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Real-time monitoring of your IoT sensors</p>
      </div>

      {/* Quick Stats */}
      <QuickStats />

      {/* Current Values Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {sensorTypes.map((type) => {
          const sensorData = latestValues[type]
          if (!sensorData) {
            return (
              <Card key={type}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium capitalize">{type}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-muted-foreground">No data</div>
                </CardContent>
              </Card>
            )
          }
          return <SensorCard key={type} sensorData={sensorData} />
        })}
      </div>

      {/* Charts and System Health */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Charts take up 2/3 of the space */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            {sensorTypes.map((type) => {
              const typeData = allSensorData.filter((d) => d.type === type)
              if (typeData.length === 0) return null

              return (
                <SensorChart
                  key={type}
                  data={typeData}
                  title={`${type.charAt(0).toUpperCase() + type.slice(1)} Trends`}
                  description={`Last 20 ${type} readings`}
                />
              )
            })}
          </div>
        </div>

        {/* System Health takes up 1/3 */}
        <div className="space-y-6">
          <SystemHealth />
        </div>
      </div>
    </div>
  )
}
