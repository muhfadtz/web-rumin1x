"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { SensorData } from "@/lib/types"
import { Thermometer, Droplets, Sun, Wind } from "lucide-react"

interface SensorCardProps {
  sensorData: SensorData
  trend?: "up" | "down" | "stable"
}

const sensorIcons = {
  temperature: Thermometer,
  humidity: Droplets,
  light: Sun,
  gas: Wind,
}

const sensorColors = {
  temperature: "text-red-500",
  humidity: "text-blue-500",
  light: "text-yellow-500",
  gas: "text-green-500",
}

export function SensorCard({ sensorData, trend }: SensorCardProps) {
  const Icon = sensorIcons[sensorData.type]
  const colorClass = sensorColors[sensorData.type]

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
      up: "bg-green-100 text-green-800",
      down: "bg-red-100 text-red-800",
      stable: "bg-gray-100 text-gray-800",
    }

    const symbols = {
      up: "↗",
      down: "↘",
      stable: "→",
    }

    return (
      <Badge variant="secondary" className={variants[trend]}>
        {symbols[trend]} {trend}
      </Badge>
    )
  }

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium capitalize">{sensorData.type}</CardTitle>
        <Icon className={`h-4 w-4 ${colorClass}`} />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-2xl font-bold">{formatValue(sensorData.value, sensorData.type)}</div>
            <p className="text-xs text-muted-foreground">{sensorData.location || "Unknown location"}</p>
            <p className="text-xs text-muted-foreground">{new Date(sensorData.timestamp).toLocaleTimeString()}</p>
          </div>
          {getTrendBadge()}
        </div>
      </CardContent>
    </Card>
  )
}
