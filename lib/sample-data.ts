import { db } from "./firebase"
import { addMockSensorData } from "./mock-data"

// Generate sample sensor data for testing
export async function generateSampleData() {
  // Check if Firebase is properly initialized
  if (!db) {
    return { success: false, message: "Firebase not initialized. Please check your configuration." }
  }

  const sensorTypes = ["temperature", "humidity", "light", "gas"] as const
  const locations = ["Living Room", "Kitchen", "Bedroom", "Office", "Garage"]
  const deviceIds = ["sensor-001", "sensor-002", "sensor-003", "sensor-004"]

  const getSensorValue = (type: string) => {
    switch (type) {
      case "temperature":
        return Math.random() * 15 + 18 // 18-33°C
      case "humidity":
        return Math.random() * 40 + 30 // 30-70%
      case "light":
        return Math.random() * 800 + 200 // 200-1000 lux
      case "gas":
        return Math.random() * 50 + 10 // 10-60 ppm
      default:
        return Math.random() * 100
    }
  }

  const getUnit = (type: string) => {
    switch (type) {
      case "temperature":
        return "°C"
      case "humidity":
        return "%"
      case "light":
        return "lux"
      case "gas":
        return "ppm"
      default:
        return ""
    }
  }

  try {
    // Generate 50 new sample readings
    for (let i = 0; i < 50; i++) {
      const randomType = sensorTypes[Math.floor(Math.random() * sensorTypes.length)]
      const randomLocation = locations[Math.floor(Math.random() * locations.length)]
      const randomDeviceId = deviceIds[Math.floor(Math.random() * deviceIds.length)]

      // Create timestamps going back in time (last 2 hours)
      const minutesAgo = Math.random() * 120
      const timestamp = new Date(Date.now() - minutesAgo * 60 * 1000)

      const sampleData = {
        type: randomType,
        value: getSensorValue(randomType),
        unit: getUnit(randomType),
        timestamp: timestamp,
        deviceId: randomDeviceId,
        location: randomLocation,
      }

      addMockSensorData(sampleData)

      // Add small delay to simulate processing
      await new Promise((resolve) => setTimeout(resolve, 10))
    }

    console.log("Sample data generated successfully!")
    return { success: true, message: "50 new sample readings generated successfully!" }
  } catch (error) {
    console.error("Error generating sample data:", error)
    return {
      success: false,
      message: "Failed to generate sample data: " + (error instanceof Error ? error.message : String(error)),
    }
  }
}
