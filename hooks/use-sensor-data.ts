"use client"

import { useState, useEffect } from "react"
import { getMockSensorData } from "@/lib/mock-data"
import type { SensorData } from "@/lib/types"

export function useSensorData(sensorType?: string, deviceId?: string) {
  const [data, setData] = useState<SensorData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      try {
        let mockData = getMockSensorData()

        // Filter by sensor type if specified
        if (sensorType) {
          mockData = mockData.filter((d) => d.type === sensorType)
        }

        // Filter by device ID if specified
        if (deviceId) {
          mockData = mockData.filter((d) => d.deviceId === deviceId)
        }

        // Limit to 100 most recent readings
        setData(mockData.slice(0, 100))
        setLoading(false)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
        setLoading(false)
      }
    }, 500)

    // Set up interval to refresh data every 5 seconds
    const interval = setInterval(() => {
      try {
        let mockData = getMockSensorData()

        if (sensorType) {
          mockData = mockData.filter((d) => d.type === sensorType)
        }

        if (deviceId) {
          mockData = mockData.filter((d) => d.deviceId === deviceId)
        }

        setData(mockData.slice(0, 100))
      } catch (err) {
        console.error("Error updating sensor data:", err)
      }
    }, 5000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [sensorType, deviceId])

  return { data, loading, error }
}

export function useLatestSensorValues() {
  const [values, setValues] = useState<Record<string, SensorData>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      const mockData = getMockSensorData()
      const sensorTypes = ["temperature", "humidity", "light", "gas"]
      const latestValues: Record<string, SensorData> = {}

      // Get the latest reading for each sensor type
      sensorTypes.forEach((type) => {
        const typeData = mockData.filter((d) => d.type === type)
        if (typeData.length > 0) {
          latestValues[type] = typeData[0] // Already sorted by timestamp (newest first)
        }
      })

      setValues(latestValues)
      setLoading(false)
    }, 500)

    // Set up interval to refresh data every 5 seconds
    const interval = setInterval(() => {
      const mockData = getMockSensorData()
      const sensorTypes = ["temperature", "humidity", "light", "gas"]
      const latestValues: Record<string, SensorData> = {}

      sensorTypes.forEach((type) => {
        const typeData = mockData.filter((d) => d.type === type)
        if (typeData.length > 0) {
          latestValues[type] = typeData[0]
        }
      })

      setValues(latestValues)
    }, 5000)

    return () => {
      clearTimeout(timer)
      clearInterval(interval)
    }
  }, [])

  return { values, loading }
}
