import type { SensorData } from "./types"

export function formatDateForFilename(date: Date): string {
  return date.toISOString().split("T")[0]
}

export function downloadCSV(data: SensorData[], filename: string): void {
  // Filter data for the last 24 hours
  const oneDayAgo = new Date()
  oneDayAgo.setDate(oneDayAgo.getDate() - 1)

  const filteredData = data.filter((item) => new Date(item.timestamp) >= oneDayAgo)

  // Create CSV header
  const headers = ["id", "type", "value", "unit", "timestamp", "deviceId", "location"]

  // Create CSV content
  const csvContent = [
    headers.join(","),
    ...filteredData.map((item) =>
      [
        item.id,
        item.type,
        item.value,
        item.unit,
        new Date(item.timestamp).toISOString(),
        item.deviceId,
        item.location || "Unknown",
      ].join(","),
    ),
  ].join("\n")

  // Create a blob and download
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.setAttribute("href", url)
  link.setAttribute("download", `${filename}.csv`)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
