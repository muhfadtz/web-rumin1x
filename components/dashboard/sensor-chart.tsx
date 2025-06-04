// components/dashboard/sensor-chart.tsx
"use client";

import { useRef } from "react"; // Impor useRef
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; // Impor Button
import { Download } from "lucide-react"; // Impor ikon Download
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { ChartData } from "@/lib/types";
import html2canvas from 'html2canvas'; // Impor html2canvas
import { saveAs } from 'file-saver'; // Impor file-saver

interface SensorChartProps {
  data: ChartData[];
  title?: string;
  sensorKeyToDisplay?: keyof Omit<ChartData, 'time'>;
}

const SENSOR_COLORS: Record<string, string> = {
  temperature: "#FF6384",
  humidity: "#36A2EB",
  light: "#FFCE56",
  gas: "#4BC0C0",
  default: "#8884d8",
};

export function SensorChart({ data, title = "Sensor Trend", sensorKeyToDisplay }: SensorChartProps) {
  const chartRef = useRef<HTMLDivElement>(null); // Ref untuk elemen chart

  const handleExportChart = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current, {
        useCORS: true, // Jika chart Anda menggunakan gambar eksternal
        logging: true,
        scale: 2, // Meningkatkan resolusi gambar
        backgroundColor: '#ffffff', // Set background putih agar transparan tidak jadi hitam
      }).then(canvas => {
        canvas.toBlob(function(blob) {
          if (blob) {
            const fileName = `${title.replace(/\s+/g, '_').toLowerCase() || 'sensor_chart'}.png`;
            saveAs(blob, fileName);
          }
        });
      }).catch(err => {
        console.error("Error exporting chart:", err);
        alert("Sorry, an error occurred while exporting the chart.");
      });
    } else {
      console.error("Chart ref is not available.");
      alert("Chart element not found for export.");
    }
  };

  if (!data || data.length === 0) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-base md:text-lg text-gray-700">{title}</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-gray-500">No data available for chart.</p>
        </CardContent>
      </Card>
    );
  }

  let keysToRender: (keyof Omit<ChartData, 'time'>)[];

  if (sensorKeyToDisplay) {
    if (data[0] && data[0].hasOwnProperty(sensorKeyToDisplay)) {
      keysToRender = [sensorKeyToDisplay];
    } else {
      console.warn(`Sensor key "${sensorKeyToDisplay}" not found in chart data. Rendering all available sensors.`);
      keysToRender = Object.keys(data[0] || {}).filter(
        (key) => key !== "time" && (data[0] as ChartData).hasOwnProperty(key as keyof ChartData) && SENSOR_COLORS[key]
      ) as (keyof Omit<ChartData, 'time'>)[];
    }
  } else {
    keysToRender = Object.keys(data[0] || {}).filter(
      (key) => key !== "time" && (data[0] as ChartData).hasOwnProperty(key as keyof ChartData) && SENSOR_COLORS[key]
    ) as (keyof Omit<ChartData, 'time'>)[];
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between"> {/* Header dibuat flex */}
        <CardTitle className="text-base md:text-lg text-gray-800">{title}</CardTitle>
        <Button variant="outline" size="sm" onClick={handleExportChart} className="ml-auto">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </CardHeader>
      <CardContent className="pr-0 md:pr-2">
        <div ref={chartRef}> {/* Div yang akan di-screenshot, membungkus ResponsiveContainer */}
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis dataKey="time" fontSize={12} tick={{ fill: "#666" }} stroke="#999" />
              <YAxis fontSize={12} tick={{ fill: "#666" }} stroke="#999" domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)", // Background tooltip sedikit lebih solid
                  border: "1px solid #ccc", borderRadius: "4px", fontSize: "13px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
                }}
                itemStyle={{paddingTop: 2, paddingBottom: 2}}
              />
              {keysToRender.length > 1 && <Legend wrapperStyle={{fontSize: "13px", paddingTop: "10px"}} /> }
              {keysToRender.map((key) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stroke={SENSOR_COLORS[key] || SENSOR_COLORS.default}
                  strokeWidth={2}
                  dot={{ r: 2, strokeWidth: 1, fill: SENSOR_COLORS[key] || SENSOR_COLORS.default }}
                  activeDot={{ r: 5, strokeWidth: 2, stroke: SENSOR_COLORS[key] || SENSOR_COLORS.default, fill: SENSOR_COLORS[key] || SENSOR_COLORS.default }}
                  name={key.charAt(0).toUpperCase() + key.slice(1)}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
