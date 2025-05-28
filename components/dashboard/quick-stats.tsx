"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSensorData } from "@/hooks/use-sensor-data"
import { TrendingUp, TrendingDown, Activity, Clock, Zap, Wifi } from "lucide-react"

export function QuickStats() {
  const { data, loading } = useSensorData()

  if (loading) {
    return (
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-gradient-to-br from-gray-50 to-gray-100 animate-pulse border-2 border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-300 rounded w-20 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const now = new Date()
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  const recentData = data.filter((d) => new Date(d.timestamp) > oneHourAgo)
  const dailyData = data.filter((d) => new Date(d.timestamp) > oneDayAgo)

  const totalReadings = data.length
  const readingsLastHour = recentData.length
  const uniqueDevices = new Set(data.map((d) => d.deviceId)).size
  const avgReadingsPerHour = dailyData.length / 24

  const stats = [
    {
      title: "Total Readings",
      value: totalReadings.toLocaleString(),
      description: "All time data",
      icon: Activity,
      gradient: "from-gray-700 to-gray-900",
      bgGradient: "from-gray-50 to-gray-100",
      borderColor: "border-gray-300",
    },
    {
      title: "Last Hour",
      value: readingsLastHour.toString(),
      description: "Recent activity",
      icon: Clock,
      gradient: "from-gray-600 to-gray-800",
      bgGradient: "from-gray-50 to-gray-100",
      borderColor: "border-gray-300",
      trend: readingsLastHour > avgReadingsPerHour ? "up" : "down",
    },
    {
      title: "Active Devices",
      value: uniqueDevices.toString(),
      description: "Connected sensors",
      icon: Wifi,
      gradient: "from-gray-800 to-black",
      bgGradient: "from-gray-50 to-gray-100",
      borderColor: "border-gray-300",
    },
    {
      title: "Avg/Hour",
      value: avgReadingsPerHour.toFixed(1),
      description: "24h average",
      icon: Zap,
      gradient: "from-gray-500 to-gray-700",
      bgGradient: "from-gray-50 to-gray-100",
      borderColor: "border-gray-300",
    },
  ]

  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className={`bg-gradient-to-br ${stat.bgGradient} border-2 ${stat.borderColor} hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-gray-400`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 md:pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700">{stat.title}</CardTitle>
            <div
              className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg`}
            >
              <stat.icon className="h-4 w-4 md:h-5 md:w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 md:gap-3">
              <div className="text-xl md:text-3xl font-bold text-gray-900">{stat.value}</div>
              {stat.trend &&
                (stat.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-gray-700" />
                ) : (
                  <TrendingDown className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
                ))}
            </div>
            <p className="text-xs md:text-sm text-gray-600 mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
