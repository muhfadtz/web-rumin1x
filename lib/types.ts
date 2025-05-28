export interface SensorData {
  id: string
  type: "temperature" | "humidity" | "light" | "gas"
  value: number
  unit: string
  timestamp: Date
  deviceId: string
  location?: string
}

export interface Device {
  id: string
  name: string
  location: string
  isOnline: boolean
  lastSeen: Date
}

export interface SensorReading {
  timestamp: number
  value: number
}

export interface ChartData {
  time: string
  temperature?: number
  humidity?: number
  light?: number
  gas?: number
}
