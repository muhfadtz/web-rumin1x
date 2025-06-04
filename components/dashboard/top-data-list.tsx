"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { SensorData } from "@/lib/types" // Ensure SensorData includes id, value (number), timestamp, location?
import { Badge } from "@/components/ui/badge"
import { Thermometer, Droplets, Sun, Wind } from "lucide-react"

interface TopDataListProps {
  data: SensorData[]
  type: string
  title: string
  limit?: number
}

export function TopDataList({ data, type, title, limit = 10 }: TopDataListProps) {
  const filteredData = data
    .filter((item) => item.type === type && typeof item.value === 'number') // Ensure value is a number for sorting
    .sort((a, b) => (b.value as number) - (a.value as number)) // Type assertion for clarity
    .slice(0, limit)

  const sensorIcons = {
    temperature: Thermometer,
    humidity: Droplets,
    light: Sun,
    gas: Wind,
  }

  const IconComponent = sensorIcons[type as keyof typeof sensorIcons] || Wind; // Fallback icon

  const formatValue = (value: number, sensorType: string) => {
    switch (sensorType) {
      case "temperature":
        return `${value.toFixed(1)}°C`
      case "humidity":
        return `${value.toFixed(1)}%`
      case "light":
        return `${value.toFixed(0)} lux`
      case "gas":
        return `${value.toFixed(2)} ppm` // Or .toFixed(0) for consistency with SensorCard if desired
      default:
        return `${value.toFixed(2)}`
    }
  }

  // For badge background colors
  const rankBadgeColors: { [key: number]: string } = {
    0: "bg-slate-900", // Rank 1 (Using slate for a slightly softer black)
    1: "bg-slate-800", // Rank 2
    2: "bg-slate-700", // Rank 3
    3: "bg-slate-600", // Rank 4
    // Add more if limit is often > 4, or use default for others
  };
  const defaultBadgeColor = "bg-slate-500";


  return (
    <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-300 hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-gray-900 text-base md:text-lg"> {/* Adjusted title size */}
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 flex items-center justify-center shadow-md">
            <IconComponent className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" /> {/* Adjusted icon size */}
          </div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-3 md:px-4 pb-3 md:pb-4"> {/* Adjusted padding */}
        <div className="space-y-1.5 max-h-[250px] md:max-h-[300px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"> {/* Adjusted max-height and spacing */}
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <div
                key={item.id || `top-item-${type}-${index}`} // Fallback key if id is missing
                className="flex items-center justify-between p-2 bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all text-sm"
              >
                <div className="flex items-center gap-2">
                  <Badge
                    className={`w-5 h-5 md:w-6 md:h-6 flex items-center justify-center p-0 ${rankBadgeColors[index] || defaultBadgeColor} text-white border-0 text-xs`} // Adjusted badge size
                  >
                    {index + 1}
                  </Badge>
                  <span className="font-medium text-gray-800">{formatValue(item.value as number, type)}</span>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">
                    {item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "No time"}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500 text-sm">No data available</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}