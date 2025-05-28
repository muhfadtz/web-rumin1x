"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSensorData } from "@/hooks/use-sensor-data"
import { TrendingUp, TrendingDown, Activity, Clock } from "lucide-react"

export function QuickStats() {
  const { data, loading } = useSensorData()

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="animate-pulse">
                <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
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
      description: "All time",
      icon: Activity,
      trend: null,
    },
    {
      title: "Last Hour",
      value: readingsLastHour.toString(),
      description: "Recent activity",
      icon: Clock,
      trend: readingsLastHour > avgReadingsPerHour ? "up" : "down",
    },
    {
      title: "Active Devices",
      value: uniqueDevices.toString(),
      description: "Connected sensors",
      icon: Activity,
      trend: null,
    },
    {
      title: "Avg/Hour",
      value: avgReadingsPerHour.toFixed(1),
      description: "24h average",
      icon: TrendingUp,
      trend: null,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.trend &&
                (stat.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                ))}
            </div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
