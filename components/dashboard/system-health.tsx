"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useLatestSensorValues } from "@/hooks/use-sensor-data"
import { Wifi, WifiOff, Activity, AlertTriangle, Heart } from "lucide-react"

export function SystemHealth() {
  const { values, loading } = useLatestSensorValues()

  if (loading) {
    return (
      <Card className="bg-gradient-to-br from-gray-50 to-gray-100 animate-pulse border-2 border-gray-200">
        <CardHeader>
          <CardTitle>System Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
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
    if (activeCount === sensorTypes.length)
      return {
        status: "healthy",
        color: "bg-gradient-to-r from-gray-700 to-gray-900",
        bgColor: "from-gray-50 to-gray-100",
        borderColor: "border-gray-300",
      }
    if (activeCount >= sensorTypes.length / 2)
      return {
        status: "warning",
        color: "bg-gradient-to-r from-gray-500 to-gray-700",
        bgColor: "from-gray-100 to-gray-200",
        borderColor: "border-gray-400",
      }
    return {
      status: "critical",
      color: "bg-gradient-to-r from-gray-800 to-black",
      bgColor: "from-gray-200 to-gray-300",
      borderColor: "border-gray-500",
    }
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

    if (minutesOld < 5) return { status: "fresh", text: "Real-time", color: "text-gray-900" }
    if (minutesOld < 30) return { status: "recent", text: `${minutesOld}m ago`, color: "text-gray-700" }
    return { status: "stale", text: `${minutesOld}m ago`, color: "text-gray-500" }
  }

  const freshness = getDataFreshness()

  return (
    <Card
      className={`bg-gradient-to-br ${health.bgColor} border-2 ${health.borderColor} hover:shadow-xl transition-all duration-300`}
    >
      <CardHeader className="pb-2 md:pb-4">
        <CardTitle className="flex items-center gap-2 md:gap-3">
          <div
            className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl ${health.color} flex items-center justify-center shadow-lg`}
          >
            <Heart className="h-4 w-4 md:h-5 md:w-5 text-white" />
          </div>
          <div>
            <div className="text-base md:text-lg font-bold text-gray-900">System Health</div>
            <div className="text-xs md:text-sm text-gray-600">IoT infrastructure status</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 md:space-y-6">
        {/* Overall Health */}
        <div className="flex items-center justify-between p-3 md:p-4 bg-white/70 rounded-lg md:rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 md:gap-3">
            <div className={`w-3 h-3 md:w-4 md:h-4 rounded-full ${health.color}`}></div>
            <span className="text-sm md:text-base font-semibold text-gray-800">System Status</span>
          </div>
          <Badge className={`${health.color} text-white border-0 shadow-sm text-xs md:text-sm`}>
            {health.status.charAt(0).toUpperCase() + health.status.slice(1)}
          </Badge>
        </div>

        {/* Data Freshness */}
        <div className="flex items-center justify-between p-3 md:p-4 bg-white/70 rounded-lg md:rounded-xl border border-gray-200">
          <div className="flex items-center gap-2 md:gap-3">
            <Activity className="h-3 w-3 md:h-4 md:w-4 text-gray-600" />
            <span className="text-sm md:text-base font-semibold text-gray-800">Data Freshness</span>
          </div>
          <span className={`text-xs md:text-sm font-semibold ${freshness.color}`}>{freshness.text}</span>
        </div>

        {/* Active Sensors */}
        <div className="space-y-2 md:space-y-3">
          <h4 className="text-xs md:text-sm font-semibold text-gray-800">Sensor Status</h4>
          <div className="grid grid-cols-2 gap-2 md:gap-3">
            {sensorTypes.map((type) => {
              const isActive = activeSensors.includes(type)
              return (
                <div
                  key={type}
                  className="flex items-center gap-2 p-2 md:p-3 bg-white/70 rounded-lg border border-gray-200"
                >
                  {isActive ? (
                    <Wifi className="h-3 w-3 md:h-4 md:w-4 text-gray-700" />
                  ) : (
                    <WifiOff className="h-3 w-3 md:h-4 md:w-4 text-gray-400" />
                  )}
                  <span className={`text-xs md:text-sm font-medium ${isActive ? "text-gray-800" : "text-gray-500"}`}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Alerts */}
        {inactiveSensors.length > 0 && (
          <div className="flex items-start gap-2 md:gap-3 p-3 md:p-4 bg-gray-100 rounded-lg md:rounded-xl border-2 border-gray-300">
            <AlertTriangle className="h-4 w-4 md:h-5 md:w-5 text-gray-600 mt-0.5" />
            <div className="text-xs md:text-sm">
              <p className="font-semibold text-gray-800">⚠️ Sensors Offline</p>
              <p className="text-gray-700">
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
