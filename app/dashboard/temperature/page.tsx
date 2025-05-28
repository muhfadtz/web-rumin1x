"use client"

import { SensorChart } from "@/components/dashboard/sensor-chart"
import { useSensorData } from "@/hooks/use-sensor-data"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, Thermometer } from "lucide-react"

export default function TemperaturePage() {
  const { data, loading, error } = useSensorData("temperature")

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Thermometer className="h-6 w-6" />
          <h1 className="text-3xl font-bold tracking-tight">Temperature</h1>
        </div>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Error loading temperature data: {error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  const latestReading = data[0]
  const averageTemp = data.length > 0 ? data.reduce((sum, reading) => sum + reading.value, 0) / data.length : 0
  const minTemp = data.length > 0 ? Math.min(...data.map((d) => d.value)) : 0
  const maxTemp = data.length > 0 ? Math.max(...data.map((d) => d.value)) : 0

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Thermometer className="h-6 w-6" />
        <h1 className="text-3xl font-bold tracking-tight">Temperature</h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {latestReading ? `${latestReading.value.toFixed(1)}°C` : "No data"}
            </div>
            <p className="text-xs text-muted-foreground">
              {latestReading ? new Date(latestReading.timestamp).toLocaleString() : ""}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageTemp.toFixed(1)}°C</div>
            <p className="text-xs text-muted-foreground">Last 100 readings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Minimum</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{minTemp.toFixed(1)}°C</div>
            <p className="text-xs text-muted-foreground">Lowest recorded</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Maximum</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{maxTemp.toFixed(1)}°C</div>
            <p className="text-xs text-muted-foreground">Highest recorded</p>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <SensorChart
        data={data}
        title="Temperature Over Time"
        description="Real-time temperature readings from your sensors"
      />

      {/* Recent Readings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Readings</CardTitle>
          <CardDescription>Latest temperature measurements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {data.slice(0, 10).map((reading, index) => (
              <div key={reading.id} className="flex justify-between items-center py-2 border-b last:border-b-0">
                <div>
                  <p className="font-medium">{reading.value.toFixed(1)}°C</p>
                  <p className="text-sm text-muted-foreground">{reading.location || "Unknown location"}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm">{new Date(reading.timestamp).toLocaleTimeString()}</p>
                  <p className="text-xs text-muted-foreground">{new Date(reading.timestamp).toLocaleDateString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
