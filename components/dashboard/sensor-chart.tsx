"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Area, AreaChart } from "recharts"
import type { SensorData } from "@/lib/types"

interface SensorChartProps {
  data: SensorData[]
  title: string
  description?: string
  type?: "line" | "area"
  shade?: "light" | "medium" | "dark"
}

export function SensorChart({ data, title, description, type = "area", shade = "medium" }: SensorChartProps) {
  const chartData = data
    .slice(-20)
    .map((item) => ({
      time: new Date(item.timestamp).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      value: item.value,
      timestamp: item.timestamp,
    }))
    .reverse()

  const shadeMap = {
    light: { stroke: "#6b7280", fill: "#f3f4f6" },
    medium: { stroke: "#374151", fill: "#e5e7eb" },
    dark: { stroke: "#111827", fill: "#d1d5db" },
  }

  const currentShade = shadeMap[shade]

  const chartConfig = {
    value: {
      label: title,
      color: currentShade.stroke,
    },
  }

  return (
    <Card className="bg-gradient-to-br from-white to-gray-50 border-2 border-gray-200 hover:shadow-xl transition-all duration-300 hover:border-gray-300">
      <CardHeader className="pb-2 md:pb-4">
        <div className="flex items-center gap-3">
          <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: currentShade.stroke }}></div>
          <CardTitle className="text-base md:text-lg font-bold text-gray-900">{title}</CardTitle>
        </div>
        {description && <CardDescription className="text-xs md:text-sm text-gray-600">{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <ResponsiveContainer width="100%" height={250}>
            {type === "area" ? (
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id={`gradient-${shade}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={currentShade.stroke} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={currentShade.stroke} stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 10, fill: "#6b7280" }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                  minTickGap={10}
                />
                <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={false} width={30} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke={currentShade.stroke}
                  strokeWidth={2}
                  fill={`url(#gradient-${shade})`}
                />
              </AreaChart>
            ) : (
              <LineChart data={chartData}>
                <XAxis
                  dataKey="time"
                  tick={{ fontSize: 10, fill: "#6b7280" }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                  minTickGap={10}
                />
                <YAxis tick={{ fontSize: 10, fill: "#6b7280" }} tickLine={false} axisLine={false} width={30} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke={currentShade.stroke}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 5, fill: currentShade.stroke }}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
