// components/dashboard/quick-stats.tsx
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSensorData } from "@/hooks/use-sensor-data" // Pastikan ini adalah hook yang mengembalikan objek nilai terbaru
import { TrendingUp, TrendingDown, Activity, Clock, Zap, Wifi } from "lucide-react"

export function QuickStats() {
  const { sensorData: latestValues, loading, error } = useSensorData(); // Mengganti nama 'data' menjadi 'latestValues' agar lebih jelas

  if (loading) {
    return (
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-gradient-to-br from-gray-50 to-gray-100 animate-pulse border-2 border-gray-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-300 rounded w-20 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-16"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (error || !latestValues) { // Tambahkan pemeriksaan jika latestValues null/undefined
    // Tampilkan pesan error atau placeholder jika data tidak ada atau error
    return (
      <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-gray-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-red-600">Data Error</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-red-500">{error ? error : "Quick stats data not available."}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  // Karena 'latestValues' adalah OBJEK nilai terbaru, bukan array historis,
  // logika di bawah ini TIDAK AKAN BEKERJA seperti yang diharapkan.
  // Anda perlu sumber data berupa ARRAY HISTORIS untuk statistik ini.

  // Untuk sementara, agar tidak crash, kita bisa berikan nilai default atau tampilkan pesan.
  const stats = [
    {
      title: "Temperature",
      value: latestValues.temperature !== undefined ? `${latestValues.temperature}°C` : "N/A",
      description: "Current reading",
      icon: Activity, // Ganti ikon sesuai relevansi
      gradient: "from-gray-700 to-gray-900",
      bgGradient: "from-gray-50 to-gray-100",
      borderColor: "border-gray-300",
    },
    {
      title: "Humidity",
      value: latestValues.humidity !== undefined ? `${latestValues.humidity}%` : "N/A",
      description: "Current reading",
      icon: Clock, // Ganti ikon
      gradient: "from-gray-600 to-gray-800",
      bgGradient: "from-gray-50 to-gray-100",
      borderColor: "border-gray-300",
    },
    {
      title: "Light Lux",
      value: latestValues.light_lux !== undefined ? `${latestValues.light_lux.toFixed(2)} lux` : "N/A",
      description: "Current reading",
      icon: Wifi, // Ganti ikon
      gradient: "from-gray-800 to-black",
      bgGradient: "from-gray-50 to-gray-100",
      borderColor: "border-gray-300",
    },
    {
      title: "Gas PPM",
      value: latestValues.gas_ppm !== undefined ? `${latestValues.gas_ppm} ppm` : "N/A",
      description: "Current reading",
      icon: Zap, // Ganti ikon
      gradient: "from-gray-500 to-gray-700",
      bgGradient: "from-gray-50 to-gray-100",
      borderColor: "border-gray-300",
    },
  ];

  // Logika asli Anda untuk recentData, dailyData, dll., tidak bisa digunakan
  // dengan 'latestValues' yang merupakan objek tunggal.
  // const now = new Date()
  // const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000)
  // const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  // const recentData = latestValues.filter.... // INI AKAN ERROR

  return (
    <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card
          key={index}
          className={`bg-gradient-to-br ${stat.bgGradient} border-2 ${stat.borderColor} hover:shadow-xl transition-all duration-300 hover:scale-105 hover:border-gray-400`}
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 md:pb-3">
            <CardTitle className="text-sm font-semibold text-gray-700">{stat.title}</CardTitle>
            <div
              className={`w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-gradient-to-r ${stat.gradient} flex items-center justify-center shadow-lg`}
            >
              <stat.icon className="h-4 w-4 md:h-5 md:w-5 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 md:gap-3">
              <div className="text-xl md:text-3xl font-bold text-gray-900">{stat.value}</div>
              {stat.trend &&
                (stat.trend === "up" ? (
                  <TrendingUp className="h-4 w-4 md:h-5 md:w-5 text-gray-700" />
                ) : (
                  <TrendingDown className="h-4 w-4 md:h-5 md:w-5 text-gray-500" />
                ))}
            </div>
            <p className="text-xs md:text-sm text-gray-600 mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}