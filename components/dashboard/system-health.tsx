"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLatestSensorValues } from "@/hooks/use-sensor-data"
import { Wifi, WifiOff, Activity, AlertTriangle } from "lucide-react"

export function SystemHealth() {
  const { values, loading } = useLatestSensorValues()

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const sensorTypes = ["temperature", "humidity", "light", "gas"]
  const activeSensors = sensorTypes.filter((type) => values[type])
  const inactiveSensors = sensorTypes.filter((type) => !values[type])

  const getHealthStatus = () => {
    const activeCount = activeSensors.length
    if (activeCount === sensorTypes.length) return { status: "healthy", color: "bg-green-500" }
    if (activeCount >= sensorTypes.length / 2) return { status: "warning", color: "bg-yellow-500" }
    return { status: "critical", color: "bg-red-500" }
  }

  const health = getHealthStatus()

  const getDataFreshness = () => {
    const now = new Date()
    let oldestData = now

    Object.values(values).forEach((sensor) => {
      if (sensor && sensor.timestamp < oldestData) {
        oldestData = sensor.timestamp
      }
    })

    const minutesOld = Math.floor((now.getTime() - oldestData.getTime()) / (1000 * 60))

    if (minutesOld < 5) return { status: "fresh", text: "Real-time", color: "text-green-600" }
    if (minutesOld < 30) return { status: "recent", text: `${minutesOld}m ago`, color: "text-yellow-600" }
    return { status: "stale", text: `${minutesOld}m ago`, color: "text-red-600" }
  }

  const freshness = getDataFreshness()

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          System Health
        </CardTitle>
        <CardDescription>Real-time status of your IoT infrastructure</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Overall Health */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${health.color}`}></div>
            <span className="font-medium">System Status</span>
          </div>
          <Badge
            variant={
              health.status === "healthy" ? "default" : health.status === "warning" ? "secondary" : "destructive"
            }
          >
            {health.status.charAt(0).toUpperCase() + health.status.slice(1)}
          </Badge>
        </div>

        {/* Data Freshness */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4" />
            <span className="font-medium">Data Freshness</span>
          </div>
          <span className={`text-sm font-medium ${freshness.color}`}>{freshness.text}</span>
        </div>

        {/* Active Sensors */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Sensor Status</h4>
          <div className="grid grid-cols-2 gap-2">
            {sensorTypes.map((type) => {
              const isActive = activeSensors.includes(type)
              return (
                <div key={type} className="flex items-center gap-2 text-sm">
                  {isActive ? (
                    <Wifi className="h-4 w-4 text-green-500" />
                  ) : (
                    <WifiOff className="h-4 w-4 text-red-500" />
                  )}
                  <span className={isActive ? "text-green-700" : "text-red-700"}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Alerts */}
        {inactiveSensors.length > 0 && (
          <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800">Sensors Offline</p>
              <p className="text-yellow-700">
                {inactiveSensors.join(", ")} {inactiveSensors.length === 1 ? "sensor is" : "sensors are"} not reporting
                data
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
