// components/dashboard/sensor-card.tsx
"use client"

// ... (impor dan interface tetap sama) ...
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { SensorData } from "@/lib/types" // Pastikan SensorData memiliki 'timestamp'
import { Thermometer, Droplets, Sun, Wind, Clock, Activity } from "lucide-react" // Activity untuk ikon fallback

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
    textColor: "text-gray-700", // textColor ditambahkan jika ingin warna teks judul spesifik
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
  // Fallback jika tipe tidak ada di atas
  default: {
    icon: Activity,
    gradient: "from-gray-400 to-gray-600",
    bgGradient: "from-gray-100 to-gray-200",
    borderColor: "border-gray-300",
    textColor: "text-gray-600",
  }
}

// Fungsi helper formatRelativeTime tidak diubah, bisa dihapus jika tidak dipakai lagi
function formatRelativeTime(timestamp: number | string | Date): string {
  // ... (implementasi formatRelativeTime tetap sama)
  const now = new Date();
  const then = new Date(timestamp);
  const diffInSeconds = Math.round((now.getTime() - then.getTime()) / 1000);

  if (isNaN(then.getTime())) return "Invalid Date";

  if (diffInSeconds < 5) return "Baru saja";
  if (diffInSeconds < 60) return `${diffInSeconds} dtk lalu`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} mnt lalu`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} jam lalu`;
  if (diffInSeconds < 86400 * 2) return "Kemarin";
  if (diffInSeconds < 86400 * 7) return `${Math.floor(diffInSeconds / 86400)} hr lalu`;
  return then.toLocaleDateString("id-ID", { year: 'numeric', month: 'short', day: 'numeric' });
}


export function SensorCard({ sensorData, trend }: SensorCardProps) {
  const config = sensorConfig[sensorData.type as keyof typeof sensorConfig] || sensorConfig.default;
  const Icon = config.icon;

  const getFormattedTimestamp = () => {
    if (!sensorData.timestamp) return "No timestamp";
    try {
      // Coba parse jika timestamp adalah string angka, atau langsung gunakan jika sudah angka
      const timestampValue = typeof sensorData.timestamp === 'string'
        ? parseInt(sensorData.timestamp, 10)
        : sensorData.timestamp;

      if (isNaN(timestampValue)) return "Invalid timestamp value";
      
      // Asumsi timestamp dalam milidetik. Jika dalam detik, kalikan 1000.
      // Timestamp Unix tipikal memiliki 10 digit untuk detik, 13 untuk milidetik.
      const date = new Date(timestampValue < 100000000000 ? timestampValue * 1000 : timestampValue);
      
      if (isNaN(date.getTime())) return "Invalid Date";
      return `${date.toLocaleTimeString("id-ID", { hour: '2-digit', minute: '2-digit', second: '2-digit' })} - ${date.toLocaleDateString("id-ID", { day: 'numeric', month: 'short' })}`;
    } catch (e) {
      console.error("Timestamp formatting error:", e, "Raw timestamp:", sensorData.timestamp);
      return "Time error";
    }
  };
  const displayTime = getFormattedTimestamp();

  const formatValue = (value: any, type: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      return "N/A";
    }

    switch (type) {
      case "temperature":
        return `${numValue.toFixed(1)}°C`
      case "humidity":
        return `${numValue.toFixed(1)}%`
      case "light": // Sesuai gambar: Light Lux
        return `${numValue.toFixed(0)} lux`
      case "gas": // Sesuai gambar: Gas PPM
        return `${numValue.toFixed(0)} ppm`
      default:
        return `${numValue.toFixed(2)}${sensorData.unit ? ` ${sensorData.unit}` : ''}`
    }
  }

  const getTrendBadge = () => {
    if (!trend) return null
    const variants = {
      up: "bg-green-600 text-white",
      down: "bg-red-600 text-white",
      stable: "bg-blue-600 text-white",
    }
    const symbols = { up: "↗", down: "↘", stable: "→" }
    return (
      <Badge className={`${variants[trend]} border-0 shadow-sm text-xs px-1.5 py-0.5 md:px-2 md:py-1`}> {/* Sedikit padding adjusment */}
        {symbols[trend]} {trend}
      </Badge>
    )
  }

  return (
    <Card
      className={`relative overflow-hidden bg-gradient-to-br ${config.bgGradient} border ${config.borderColor} hover:shadow-lg transition-all duration-300 hover:scale-[1.03] hover:border-opacity-70`} // border-2 jadi border saja, hover:shadow-xl jadi hover:shadow-lg
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-1.5 md:pb-2"> {/* pb sedikit dikurangi */}
        <CardTitle className={`text-xs md:text-sm font-medium capitalize ${config.textColor || 'text-gray-700'}`}> {/* font-semibold jadi font-medium */}
          {sensorData.name || sensorData.type}
        </CardTitle>
        <div
          className={`w-7 h-7 md:w-8 md:h-8 rounded-md md:rounded-lg bg-gradient-to-r ${config.gradient} flex items-center justify-center shadow-md`} // Ukuran ikon container sedikit disesuaikan
        >
          <Icon className="h-3.5 w-3.5 md:h-4 md:w-4 text-white" /> {/* Ukuran ikon disesuaikan */}
        </div>
      </CardHeader>
      <CardContent className="pt-0 pb-2.5 md:pb-3"> {/* pt-0 agar lebih rapat, pb disesuaikan */}
        <div className="space-y-1 md:space-y-1.5"> {/* space-y disesuaikan */}
          <div className="flex items-baseline justify-between"> {/* items-baseline agar lebih rapi */}
            <div className={`text-xl md:text-2xl font-bold ${config.textColor || 'text-gray-900'}`}> {/* Ukuran font nilai utama disesuaikan */}
              {sensorData.value !== undefined ? formatValue(sensorData.value, sensorData.type) : "N/A"}
            </div>
            {getTrendBadge()}
          </div>
          
          {/* === BAGIAN LAST UPDATED === */}
          {sensorData.timestamp && displayTime !== "No timestamp" && displayTime !== "Invalid Date" && displayTime !== "Time error" && displayTime !== "Invalid timestamp value" && (
            <div className="flex items-center text-xxs md:text-xs text-gray-500 pt-0.5"> {/* pt-0.5 untuk sedikit spasi */}
              <Clock className="h-2.5 w-2.5 md:h-3 md:w-3 mr-1 md:mr-1.5" />
              <span>{displayTime}</span>
            </div>
          )}
          {/* === AKHIR BAGIAN LAST UPDATED === */}
          
        </div>
      </CardContent>
    </Card>
  )
}