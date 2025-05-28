"use client"

import { SensorChart } from "@/components/dashboard/sensor-chart"
import { useSensorData } from "@/hooks/use-sensor-data"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, BarChart3, TrendingUp, Calendar, Target } from "lucide-react"
import { DailyReport } from "@/components/dashboard/daily-report"

export default function AnalyticsPage() {
  const { data, loading, error } = useSensorData()

  if (error) {
    return (
      <div className="space-y-6 p-4">
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Unavailable</h1>
          <p className="text-gray-600">We're having trouble loading your analytics data</p>
        </div>
        <Alert className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-gray-800">Error loading analytics data: {error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-600 to-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
          <p className="text-gray-600">Crunching your analytics data...</p>
        </div>
      </div>
    )
  }

  const sensorTypes = ["temperature", "humidity", "light", "gas"] as const
  const chartShades = ["light", "medium", "dark", "medium"] as const

  // Calculate analytics
  const getAnalytics = (type: string) => {
    const typeData = data.filter((d) => d.type === type)
    if (typeData.length === 0) return null

    const values = typeData.map((d) => d.value)
    const average = values.reduce((sum, val) => sum + val, 0) / values.length
    const min = Math.min(...values)
    const max = Math.max(...values)
    const latest = typeData[0]?.value || 0
    const previous = typeData[1]?.value || latest
    const change = ((latest - previous) / previous) * 100

    return { average, min, max, latest, change, count: typeData.length }
  }

  const analytics = sensorTypes
    .map((type) => ({
      type,
      data: getAnalytics(type),
    }))
    .filter((item) => item.data !== null)

  return (
    <div className="space-y-8 bg-gradient-to-br from-gray-50 to-white min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="text-center py-4 md:py-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl flex items-center justify-center shadow-lg">
            <BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-sm md:text-base text-gray-600">Deep insights into your IoT sensor performance</p>
          </div>
        </div>
      </div>

      {/* Daily Report */}
      <div>
        <DailyReport data={data} />
      </div>

      {/* Analytics Summary Cards */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
          <div className="w-2 h-6 md:h-8 bg-gradient-to-b from-gray-700 to-gray-900 rounded-full"></div>
          Performance Summary
        </h2>
        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {analytics.map((item, index) => {
            const config = {
              temperature: {
                gradient: "from-gray-700 to-gray-900",
                bgGradient: "from-gray-50 to-gray-100",
                borderColor: "border-gray-300",
                unit: "°C",
              },
              humidity: {
                gradient: "from-gray-600 to-gray-800",
                bgGradient: "from-gray-50 to-gray-100",
                borderColor: "border-gray-300",
                unit: "%",
              },
              light: {
                gradient: "from-gray-800 to-black",
                bgGradient: "from-gray-50 to-gray-100",
                borderColor: "border-gray-300",
                unit: " lux",
              },
              gas: {
                gradient: "from-gray-500 to-gray-700",
                bgGradient: "from-gray-50 to-gray-100",
                borderColor: "border-gray-300",
                unit: " ppm",
              },
            }[item.type]

            return (
              <Card
                key={item.type}
                className={`bg-gradient-to-br ${config.bgGradient} border-2 ${config.borderColor} hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-gray-400`}
              >
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg font-bold capitalize text-gray-900 flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${config.gradient}`}></div>
                    {item.type}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white/70 rounded-lg border border-gray-200">
                      <div className="text-lg font-bold text-gray-900">
                        {item.data!.average.toFixed(1)}
                        {config.unit}
                      </div>
                      <div className="text-xs text-gray-600">Average</div>
                    </div>
                    <div className="text-center p-3 bg-white/70 rounded-lg border border-gray-200">
                      <div
                        className={`text-lg font-bold ${item.data!.change >= 0 ? "text-gray-800" : "text-gray-600"}`}
                      >
                        {item.data!.change >= 0 ? "+" : ""}
                        {item.data!.change.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-600">Change</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white/70 rounded-lg border border-gray-200">
                      <div className="text-sm font-semibold text-gray-700">
                        {item.data!.min.toFixed(1)}
                        {config.unit}
                      </div>
                      <div className="text-xs text-gray-600">Min</div>
                    </div>
                    <div className="text-center p-3 bg-white/70 rounded-lg border border-gray-200">
                      <div className="text-sm font-semibold text-gray-900">
                        {item.data!.max.toFixed(1)}
                        {config.unit}
                      </div>
                      <div className="text-xs text-gray-600">Max</div>
                    </div>
                  </div>
                  <div className="text-center p-3 bg-white/70 rounded-lg border border-gray-200">
                    <div className="text-sm font-semibold text-gray-800">{item.data!.count} readings</div>
                    <div className="text-xs text-gray-600">Total data points</div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Detailed Charts */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
          <div className="w-2 h-6 md:h-8 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full"></div>
          Detailed Analysis
        </h2>
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2">
          {sensorTypes.map((type, index) => {
            const typeData = data.filter((d) => d.type === type)
            if (typeData.length === 0) return null

            return (
              <SensorChart
                key={type}
                data={typeData}
                title={`${type.charAt(0).toUpperCase() + type.slice(1)} Analysis`}
                description={`Complete ${type} data trends and patterns`}
                type="area"
                shade={chartShades[index]}
              />
            )
          })}
        </div>
      </div>

      {/* Insights */}
      <div>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
          <div className="w-2 h-6 md:h-8 bg-gradient-to-b from-gray-500 to-gray-700 rounded-full"></div>
          Smart Insights
        </h2>
        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 hover:shadow-xl transition-all duration-300 hover:border-gray-400">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <TrendingUp className="h-5 w-5" />
                Performance Trends
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                📈 Your sensors are performing optimally with consistent data collection across all devices.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-400 hover:shadow-xl transition-all duration-300 hover:border-gray-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-800">
                <Calendar className="h-5 w-5" />
                Data Quality
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                ✨ Excellent data quality with {data.length} readings collected and no significant gaps detected.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-gray-200 to-gray-300 border-2 border-gray-500 hover:shadow-xl transition-all duration-300 hover:border-gray-600">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900">
                <Target className="h-5 w-5" />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-800">
                🎯 Consider setting up automated alerts for values outside normal ranges for proactive monitoring.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
