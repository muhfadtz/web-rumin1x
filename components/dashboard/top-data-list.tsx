"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SensorData } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Thermometer, Droplets, Sun, Wind } from "lucide-react"

interface TopDataListProps {
  data: SensorData[]
  type: string
  title: string
  limit?: number
}

export function TopDataList({ data, type, title, limit = 10 }: TopDataListProps) {
  // Filter data by type and get top values
  const filteredData = data
    .filter((item) => item.type === type)
    .sort((a, b) => b.value - a.value)
    .slice(0, limit)

  const sensorIcons = {
    temperature: Thermometer,
    humidity: Droplets,
    light: Sun,
    gas: Wind,
  }

  const Icon = sensorIcons[type as keyof typeof sensorIcons]

  const formatValue = (value: number, type: string) => {
    switch (type) {
      case "temperature":
        return `${value.toFixed(1)}°C`
      case "humidity":
        return `${value.toFixed(1)}%`
      case "light":
        return `${value.toFixed(0)} lux`
      case "gas":
        return `${value.toFixed(2)} ppm`
      default:
        return `${value.toFixed(2)}`
    }
  }

  return (
    <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 flex items-center justify-center shadow-md">
            <Icon className="h-4 w-4 text-white" />
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="space-y-1 max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all"
              >
                <div className="flex items-center gap-2">
                  <Badge
                    className={`w-6 h-6 flex items-center justify-center p-0 bg-gray-${900 - index * 70} text-white border-0`}
                  >
                    {index + 1}
                  </Badge>
                  <span className="font-medium text-gray-800">{formatValue(item.value, type)}</span>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-500">{item.location || "Unknown"}</div>
                  <div className="text-xs text-gray-400">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">No data available</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
