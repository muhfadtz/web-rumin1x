import type { SensorData } from "./types"

// Generate mock sensor data
const generateMockSensorData = (): SensorData[] => {
  const sensorTypes = ["temperature", "humidity", "light", "gas"] as const
  const locations = ["Living Room", "Kitchen", "Bedroom", "Office", "Garage"]
  const deviceIds = ["sensor-001", "sensor-002", "sensor-003", "sensor-004"]
  const data: SensorData[] = []

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

  // Generate data for the last 24 hours
  for (let i = 0; i < 200; i++) {
    const randomType = sensorTypes[Math.floor(Math.random() * sensorTypes.length)]
    const randomLocation = locations[Math.floor(Math.random() * locations.length)]
    const randomDeviceId = deviceIds[Math.floor(Math.random() * deviceIds.length)]

    // Create timestamps going back in time
    const hoursAgo = Math.random() * 24
    const timestamp = new Date(Date.now() - hoursAgo * 60 * 60 * 1000)

    data.push({
      id: `mock-${i}`,
      type: randomType,
      value: getSensorValue(randomType),
      unit: getUnit(randomType),
      timestamp: timestamp,
      deviceId: randomDeviceId,
      location: randomLocation,
    })
  }

  // Sort by timestamp (newest first)
  return data.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
}

// Store mock data globally
let mockSensorData: SensorData[] = generateMockSensorData()

// Simulate real-time updates
setInterval(() => {
  const sensorTypes = ["temperature", "humidity", "light", "gas"] as const
  const locations = ["Living Room", "Kitchen", "Bedroom", "Office", "Garage"]
  const deviceIds = ["sensor-001", "sensor-002", "sensor-003", "sensor-004"]

  const getSensorValue = (type: string) => {
    switch (type) {
      case "temperature":
        return Math.random() * 15 + 18
      case "humidity":
        return Math.random() * 40 + 30
      case "light":
        return Math.random() * 800 + 200
      case "gas":
        return Math.random() * 50 + 10
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

  // Add a new random reading every 5 seconds
  const randomType = sensorTypes[Math.floor(Math.random() * sensorTypes.length)]
  const randomLocation = locations[Math.floor(Math.random() * locations.length)]
  const randomDeviceId = deviceIds[Math.floor(Math.random() * deviceIds.length)]

  const newReading: SensorData = {
    id: `mock-${Date.now()}`,
    type: randomType,
    value: getSensorValue(randomType),
    unit: getUnit(randomType),
    timestamp: new Date(),
    deviceId: randomDeviceId,
    location: randomLocation,
  }

  // Add new reading and keep only last 200 readings
  mockSensorData = [newReading, ...mockSensorData.slice(0, 199)]
}, 5000)

export const getMockSensorData = () => mockSensorData

export const addMockSensorData = (data: Omit<SensorData, "id">) => {
  const newReading: SensorData = {
    ...data,
    id: `mock-${Date.now()}`,
  }
  mockSensorData = [newReading, ...mockSensorData.slice(0, 199)]
  return newReading
}
