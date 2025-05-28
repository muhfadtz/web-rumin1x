"use client"

import { SensorCard } from "@/components/dashboard/sensor-card"
import { SensorChart } from "@/components/dashboard/sensor-chart"
import { useLatestSensorValues, useSensorData } from "@/hooks/use-sensor-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, Sparkles } from "lucide-react"
import { QuickStats } from "@/components/dashboard/quick-stats"
import { SystemHealth } from "@/components/dashboard/system-health"
import { DailyReport } from "@/components/dashboard/daily-report"
import { TopDataList } from "@/components/dashboard/top-data-list"

export default function DashboardPage() {
  const { values: latestValues, loading: valuesLoading } = useLatestSensorValues()
  const { data: allSensorData, loading: dataLoading, error } = useSensorData()

  if (error) {
    return (
      <div className="space-y-6 p-4">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h1>
          <p className="text-gray-600">We're having trouble loading your sensor data</p>
        </div>
        <Alert className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-gray-800">Error loading sensor data: {error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (valuesLoading || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const sensorTypes = ["temperature", "humidity", "light", "gas"] as const
  const chartShades = ["light", "medium", "dark", "medium"] as const

  return (
    <div className="space-y-8 bg-gradient-to-br from-gray-50 to-white min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="text-center py-4 md:py-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-gray-800 to-black rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-sm md:text-base text-gray-600">Real-time monitoring of your smart IoT sensors</p>
          </div>
        </div>
      </div>

      {/* Daily Report */}
      <div>
        <DailyReport data={allSensorData} />
      </div>

      {/* Quick Stats */}
      <QuickStats />

      {/* Current Values Grid */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
          <div className="w-2 h-6 md:h-8 bg-gradient-to-b from-gray-700 to-gray-900 rounded-full"></div>
          Live Sensor Readings
        </h2>
        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {sensorTypes.map((type) => {
            const sensorData = latestValues[type]
            if (!sensorData) {
              return (
                <Card key={type} className="bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium capitalize text-gray-600">{type}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-gray-500">No data</div>
                    <p className="text-xs text-gray-400">Waiting for sensor...</p>
                  </CardContent>
                </Card>
              )
            }
            return <SensorCard key={type} sensorData={sensorData} />
          })}
        </div>
      </div>

      {/* Top 10 Data Lists */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
          <div className="w-2 h-6 md:h-8 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full"></div>
          Top 10 Sensor Readings
        </h2>
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          {sensorTypes.map((type) => (
            <TopDataList
              key={type}
              data={allSensorData}
              type={type}
              title={`Top ${type.charAt(0).toUpperCase() + type.slice(1)} Readings`}
            />
          ))}
        </div>
      </div>

      {/* Charts and System Health */}
      <div className="grid gap-6 md:gap-8">
        {/* Charts */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
            <div className="w-2 h-6 md:h-8 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full"></div>
            Sensor Trends
          </h2>
          <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
            {sensorTypes.map((type, index) => {
              const typeData = allSensorData.filter((d) => d.type === type)
              if (typeData.length === 0) return null

              return (
                <SensorChart
                  key={type}
                  data={typeData}
                  title={`${type.charAt(0).toUpperCase() + type.slice(1)} Trends`}
                  description={`Last 20 ${type} readings`}
                  shade={chartShades[index]}
                />
              )
            })}
          </div>
        </div>

        {/* System Health */}
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
            <div className="w-2 h-6 md:h-8 bg-gradient-to-b from-gray-500 to-gray-700 rounded-full"></div>
            System Status
          </h2>
          <SystemHealth />
        </div>
      </div>
    </div>
  )
}
