"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import type { SensorData } from "@/lib/types"
import { downloadCSV, formatDateForFilename } from "@/lib/csv-export"
import { FileDown, BarChart3, Calendar } from "lucide-react"

interface DailyReportProps {
  data: SensorData[]
}

export function DailyReport({ data }: DailyReportProps) {
  const [isExporting, setIsExporting] = useState(false)

  // Get data from the last 24 hours
  const oneDayAgo = new Date()
  oneDayAgo.setDate(oneDayAgo.getDate() - 1)
  const dailyData = data.filter((item) => new Date(item.timestamp) >= oneDayAgo)

  // Calculate statistics
  const sensorTypes = ["temperature", "humidity", "light", "gas"] as const
  const stats = sensorTypes.reduce(
    (acc, type) => {
      const typeData = dailyData.filter((item) => item.type === type)
      if (typeData.length === 0) {
        acc[type] = { count: 0, avg: 0, min: 0, max: 0 }
        return acc
      }

      const values = typeData.map((item) => item.value)
      acc[type] = {
        count: typeData.length,
        avg: values.reduce((sum, val) => sum + val, 0) / values.length,
        min: Math.min(...values),
        max: Math.max(...values),
      }
      return acc
    },
    {} as Record<string, { count: number; avg: number; min: number; max: number }>,
  )

  const handleExportCSV = () => {
    setIsExporting(true)
    try {
      const today = new Date()
      const filename = `iot_data_${formatDateForFilename(today)}`
      downloadCSV(dailyData, filename)
    } catch (error) {
      console.error("Error exporting CSV:", error)
    } finally {
      setTimeout(() => setIsExporting(false), 1000)
    }
  }

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-gray-700 to-gray-900 flex items-center justify-center shadow-md">
              <BarChart3 className="h-4 w-4 text-white" />
            </div>
            Daily Report
          </CardTitle>
          <Button
            onClick={handleExportCSV}
            disabled={isExporting || dailyData.length === 0}
            className="bg-gray-900 hover:bg-gray-800 text-white flex items-center gap-2"
          >
            <FileDown className="h-4 w-4" />
            {isExporting ? "Exporting..." : "Export to CSV"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4 text-sm text-gray-600">
          <Calendar className="h-4 w-4" />
          <span>
            Last 24 hours: {new Date(oneDayAgo).toLocaleDateString()} - {new Date().toLocaleDateString()}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {sensorTypes.map((type) => (
            <div
              key={type}
              className="bg-white p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-all"
            >
              <h3 className="text-sm font-semibold text-gray-700 capitalize mb-2">{type}</h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-gray-500 text-xs">Readings</div>
                  <div className="font-medium text-gray-900">{stats[type]?.count || 0}</div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-gray-500 text-xs">Average</div>
                  <div className="font-medium text-gray-900">
                    {stats[type]?.count ? formatValue(stats[type].avg, type) : "N/A"}
                  </div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-gray-500 text-xs">Min</div>
                  <div className="font-medium text-gray-900">
                    {stats[type]?.count ? formatValue(stats[type].min, type) : "N/A"}
                  </div>
                </div>
                <div className="bg-gray-50 p-2 rounded">
                  <div className="text-gray-500 text-xs">Max</div>
                  <div className="font-medium text-gray-900">
                    {stats[type]?.count ? formatValue(stats[type].max, type) : "N/A"}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
