"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSensorData } from "@/hooks/use-sensor-data"
import { Wifi, WifiOff, Activity, AlertTriangle, Heart, Loader2, Thermometer, Droplets, Lightbulb, CloudCog } from "lucide-react"

interface LatestSensorValues {
  temperature?: string | number | null;
  humidity?: string | number | null;
  light_lux?: string | number | null;
  gas_ppm?: string | number | null;
  last_updated?: number;
  [key: string]: any;
}

const sensorTypesConfig = [
  { keyFirebase: "temperature", displayName: "Temperature", Icon: Thermometer },
  { keyFirebase: "humidity", displayName: "Humidity", Icon: Droplets },
  { keyFirebase: "light_lux", displayName: "Light", Icon: Lightbulb },
  { keyFirebase: "gas_ppm", displayName: "Gas", Icon: CloudCog }
];

export function SystemHealth() {
  const { sensorData: latestValues, loading, error } = useSensorData() as { sensorData: LatestSensorValues | null, loading: boolean, error: string | null };

  if (loading) {
    return (
      <Card className="animate-pulse shadow-md">
        <CardHeader>
          <CardTitle className="h-6 bg-gray-300 rounded w-3/4 mx-auto md:mx-0 md:w-1/2"></CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 pt-2">
          <div className="h-5 bg-gray-300 rounded w-full"></div>
          <div className="h-5 bg-gray-300 rounded w-5/6"></div>
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !latestValues) {
    return (
      <Card className="border-red-400 bg-red-50 shadow-md">
        <CardHeader>
          <CardTitle className="text-red-600 flex items-center gap-2 text-base md:text-lg">
            <AlertTriangle className="h-5 w-5"/> System Health - Error
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 text-sm">{error || "Sensor data is unavailable for System Health."}</p>
        </CardContent>
      </Card>
    );
  }

  const activeSensors = sensorTypesConfig.filter(
    (sensor) => {
      const value = latestValues[sensor.keyFirebase];
      return value !== undefined &&
             value !== null && // Menangani JSON null asli
             String(value).trim() !== "" &&
             String(value).toLowerCase().trim() !== "null"; // Menangani string "null" dari Arduino
    }
  );
  const inactiveSensors = sensorTypesConfig.filter(
    (sensor) => {
      const value = latestValues[sensor.keyFirebase];
      return value === undefined ||
             value === null || // Menangani JSON null asli
             String(value).trim() === "" ||
             String(value).toLowerCase().trim() === "null"; // Menangani string "null" dari Arduino
    }
  );

  const getHealthStatus = () => {
    const activeCount = activeSensors.length;
    if (activeCount === sensorTypesConfig.length)
      return { status: "Optimal", color: "bg-gradient-to-r from-blue-500 to-sky-600", dotColor: "bg-sky-500", bgColor: "from-blue-50 to-sky-100", borderColor: "border-sky-300", textColor: "text-sky-700" };
    if (activeCount > 0 && activeCount >= Math.ceil(sensorTypesConfig.length / 2))
      return { status: "Warning", color: "bg-gradient-to-r from-amber-400 to-orange-500", dotColor: "bg-yellow-500", bgColor: "from-yellow-50 to-orange-100", borderColor: "border-yellow-300", textColor: "text-yellow-700" };
    return { status: "Critical", color: "bg-gradient-to-r from-red-500 to-rose-600", dotColor: "bg-red-500", bgColor: "from-red-50 to-rose-100", borderColor: "border-red-300", textColor: "text-red-700" };
  };

  const health = getHealthStatus();

  const getDataFreshness = () => {
    if (typeof latestValues.last_updated !== 'number' || latestValues.last_updated === 0) {
      return { status: "unknown", text: "No Timestamp", color: "text-gray-500" };
    }
    const now = Date.now();
    const lastUpdatedTimestamp = latestValues.last_updated;
    const minutesOld = Math.floor((now - lastUpdatedTimestamp) / (1000 * 60));

    if (minutesOld < 0) return { status: "error", text: "Future Data?", color: "text-orange-500 font-medium" };
    if (minutesOld < 2) return { status: "fresh", text: "Just now", color: "text-gray-700 font-semibold" };
    if (minutesOld < 5) return { status: "fresh", text: "Real-time", color: "text-gray-700 font-semibold" };
    if (minutesOld < 30) return { status: "recent", text: `${minutesOld}m ago`, color: "text-yellow-600 font-semibold" };
    return { status: "stale", text: `${minutesOld}m+ ago`, color: "text-red-600 font-semibold" };
  };

  const freshness = getDataFreshness();

  return (
    <Card
      className={`bg-gradient-to-br ${health.bgColor} border-2 ${health.borderColor} shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl overflow-hidden`}
    >
      <CardHeader className="pb-3 md:pb-4 pt-4 md:pt-5 px-4 md:px-5">
        <CardTitle className="flex items-center gap-2 md:gap-3">
          <div
            className={`w-9 h-9 md:w-10 md:h-10 rounded-lg md:rounded-xl ${health.color} flex items-center justify-center shadow-md`}
          >
            <Heart className="h-4 w-4 md:h-5 md:w-5 text-white" />
          </div>
          <div>
            <div className={`text-base md:text-lg font-bold text-gray-800`}>
              System Health
            </div>
            <div className="text-xs md:text-sm text-gray-500">Overall infrastructure status</div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 md:space-y-4 p-4 md:p-5 pt-2 md:pt-3">
        {/* Overall Health */}
        <div className="flex items-center justify-between p-3 bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200/60 shadow-sm">
          <div className="flex items-center gap-2 md:gap-3">
            <div className={`w-3 h-3 md:w-3.5 md:h-3.5 rounded-full ${health.dotColor} shadow-inner`}></div>
            <span className="text-sm md:text-base font-semibold text-gray-700">System Status</span>
          </div>
          <Badge className={`${health.color} text-white border-0 shadow-md text-xs md:text-sm px-3 py-1 rounded-md`}>
            {health.status}
          </Badge>
        </div>

        {/* Data Freshness */}
        <div className="flex items-center justify-between p-3 bg-white/70 backdrop-blur-sm rounded-lg border border-gray-200/60 shadow-sm">
          <div className="flex items-center gap-2 md:gap-3">
            <Activity className="h-4 w-4 text-gray-500" />
            <span className="text-sm md:text-base font-semibold text-gray-700">Data Freshness</span>
          </div>
          <span className={`text-xs md:text-sm ${freshness.color}`}>{freshness.text}</span>
        </div>

        {/* Sensor Status Details */}
        <div className="space-y-2 pt-1">
          <h4 className="text-xs md:text-sm font-semibold text-gray-600 px-1 mb-1.5">Sensor Details</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-2.5">
            {sensorTypesConfig.map((sensorConf) => {
              const isActive = activeSensors.some(activeSensor => activeSensor.keyFirebase === sensorConf.keyFirebase);
              const SensorIcon = sensorConf.Icon;
              return (
                <div
                  key={sensorConf.keyFirebase}
                  className={`flex items-center gap-2.5 p-2.5 rounded-lg border shadow-sm transition-all duration-200 
                              ${isActive 
                                ? `bg-white/70 border-gray-200/80`
                                : "bg-red-50/70 border-red-300/80"}`}
                >
                  <div className={`p-1.5 rounded-md ${isActive ? 'bg-gray-100' : 'bg-red-100'}`}>
                    {isActive ? (
                      <SensorIcon className={`h-4 w-4 text-gray-600 flex-shrink-0`} />
                    ) : (
                      <SensorIcon className="h-4 w-4 text-red-400 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`block text-xs md:text-sm font-medium truncate ${isActive ? "text-gray-700" : "text-red-600"}`}>
                      {sensorConf.displayName}
                    </span>
                    <span className={`block text-xs ${isActive ? "text-green-600" : "text-red-500"}`}>
                      {isActive ? "Online" : "Offline"}
                    </span>
                  </div>
                   {isActive ? (
                      <Wifi className="h-4 w-4 text-green-500 flex-shrink-0 ml-auto" />
                    ) : (
                      <WifiOff className="h-4 w-4 text-red-400 flex-shrink-0 ml-auto" />
                    )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Alerts for Inactive Sensors */}
        {inactiveSensors.length > 0 && (
          <div className="flex items-start gap-2 md:gap-3 p-3 bg-red-100/90 backdrop-blur-sm rounded-lg border-2 border-red-300/90 shadow-sm mt-3">
            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
            <div className="text-xs md:text-sm">
              <p className="font-semibold text-red-700">Sensors Offline Warning</p>
              <p className="text-red-600 leading-snug">
                The following {inactiveSensors.length === 1 ? "sensor is" : "sensors are"} not reporting data: {inactiveSensors.map(s => s.displayName).join(", ")}.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
