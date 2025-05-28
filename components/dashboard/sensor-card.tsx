"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { SensorData } from "@/lib/types"
import { Thermometer, Droplets, Sun, Wind } from "lucide-react"

interface SensorCardProps {
  sensorData: SensorData
  trend?: "up" | "down" | "stable"
}

const sensorConfig = {
  temperature: {
    icon: Thermometer,
    gradient: "from-gray-700 to-gray-900",
    bgGradient: "from-gray-50 to-gray-100",
    borderColor: "border-gray-300",
    textColor: "text-gray-700",
  },
  humidity: {
    icon: Droplets,
    gradient: "from-gray-600 to-gray-800",
    bgGradient: "from-gray-50 to-gray-100",
    borderColor: "border-gray-300",
    textColor: "text-gray-700",
  },
  light: {
    icon: Sun,
    gradient: "from-gray-800 to-black",
    bgGradient: "from-gray-50 to-gray-100",
    borderColor: "border-gray-300",
    textColor: "text-gray-700",
  },
  gas: {
    icon: Wind,
    gradient: "from-gray-500 to-gray-700",
    bgGradient: "from-gray-50 to-gray-100",
    borderColor: "border-gray-300",
    textColor: "text-gray-700",
  },
}

export function SensorCard({ sensorData, trend }: SensorCardProps) {
  const config = sensorConfig[sensorData.type]
  const Icon = config.icon

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
        return `${value.toFixed(2)} ${sensorData.unit}`
    }
  }

  const getTrendBadge = () => {
    if (!trend) return null

    const variants = {
      up: "bg-gray-900 text-white",
      down: "bg-gray-700 text-white",
      stable: "bg-gray-500 text-white",
    }

    const symbols = {
      up: "↗",
      down: "↘",
      stable: "→",
    }

    return (
      <Badge className={`${variants[trend]} border-0 shadow-sm text-xs`}>
        {symbols[trend]} {trend}
      </Badge>
    )
  }

  return (
    <Card
      className={`relative overflow-hidden bg-gradient-to-br ${config.bgGradient} border-2 ${config.borderColor} hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-gray-400`}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 md:pb-3">
        <CardTitle className="text-xs md:text-sm font-semibold capitalize text-gray-700">{sensorData.type}</CardTitle>
        <div
          className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-r ${config.gradient} flex items-center justify-center shadow-lg`}
        >
          <Icon className="h-4 w-4 md:h-5 md:w-5 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 md:space-y-3">
          <div className="flex items-center justify-between">
            <div className="text-xl md:text-3xl font-bold text-gray-900">
              {formatValue(sensorData.value, sensorData.type)}
            </div>
            {getTrendBadge()}
          </div>
          <div className="space-y-1">
            <p className="text-xs md:text-sm font-medium text-gray-600">
              📍 {sensorData.location || "Unknown location"}
            </p>
            <p className="text-xs text-gray-500">🕒 {new Date(sensorData.timestamp).toLocaleTimeString()}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
