// app/dashboard/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";

// Komponen UI
import { SensorCard } from "@/components/dashboard/sensor-card";
import { TopDataList } from "@/components/dashboard/top-data-list";
import { SensorChart } from "@/components/dashboard/sensor-chart";
import { SystemHealth } from "@/components/dashboard/system-health";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, Sparkles, DownloadCloud } from "lucide-react";

// Hook untuk data terbaru
import { useSensorData as useLatestSensorData } from "@/hooks/use-sensor-data";

// Firebase
import { dbRTDB } from "@/lib/firebase"; // Pastikan path ini benar
import { ref, query, orderByChild, limitToLast, get } from "firebase/database";

// Tipe Data
import type { SensorData as AppSensorData, ChartData } from "@/lib/types";

// FileSaver untuk download CSV
import { saveAs } from 'file-saver';

// Tipe untuk data mentah dari RTDB
interface RawLatestSensorValues {
  temperature?: string;
  humidity?: string;
  light_lux?: string;
  gas_ppm?: number;
  last_updated?: number;
}

export interface RawHistoricalEntry {
  temperature?: string;
  humidity?: string;
  light_lux?: string;
  gas_ppm?: number;
  timestamp: number;
  id?: string;
  // location?: string; // Dihapus
}

// Mapping key Firebase ke tipe sensor standar
const SENSOR_KEY_TO_TYPE_MAP: Record<string, AppSensorData['type']> = {
  temperature: "temperature",
  humidity: "humidity",
  light_lux: "light",
  gas_ppm: "gas",
};
const CHART_SENSOR_KEY_TO_DISPLAY_NAME: Record<string, string> = {
  temperature: "Temperature Level",
  humidity: "Humidity Percentage",
  light: "Light Intensity",
  gas: "Gas Concentration",
};

// --- Fungsi Helper untuk Fetch & Transformasi Data ---
async function fetchRawHistoricalSnapshots(maxHistoryEntries = 100): Promise<RawHistoricalEntry[]> {
  const sensorHistoryRef = ref(dbRTDB, '/sensorHistory');
  const q = query(sensorHistoryRef, orderByChild('timestamp'), limitToLast(maxHistoryEntries));
  try {
    const snapshot = await get(q);
    const entries: RawHistoricalEntry[] = [];
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        // Pastikan untuk tidak mencoba mengakses data.location jika sudah dihapus dari tipe
        const entryData: Omit<RawHistoricalEntry, 'location'> & { location?: string } = data;
        delete entryData.location; // Hapus properti location jika masih ada di data mentah
        entries.push({ ...entryData, id: childSnapshot.key } as RawHistoricalEntry);
      });
    }
    return entries.sort((a, b) => a.timestamp - b.timestamp);
  } catch (error) {
    console.error("RTDB Error: Fetching raw historical snapshots:", error);
    throw error;
  }
}

function transformSnapshotsToAppSensorData(snapshots: RawHistoricalEntry[]): AppSensorData[] {
  const transformedReadings: AppSensorData[] = [];
  snapshots.forEach(snapshot => {
    const logEntryKey = snapshot.id || String(snapshot.timestamp);
    const entryTimestampNumber = snapshot.timestamp;
    if (typeof entryTimestampNumber !== 'number') return;

    for (const keyInFirebase in snapshot) {
      if (SENSOR_KEY_TO_TYPE_MAP[keyInFirebase]) {
        const sensorType = SENSOR_KEY_TO_TYPE_MAP[keyInFirebase];
        const rawValue = snapshot[keyInFirebase as keyof Omit<RawHistoricalEntry, 'location'>]; // Disesuaikan
        const numericValue = parseFloat(String(rawValue));
        if (isNaN(numericValue)) continue;

        let unit = "";
        switch (sensorType) {
          case "temperature": unit = "°C"; break;
          case "humidity": unit = "%"; break;
          case "light": unit = "lux"; break;
          case "gas": unit = "ppm"; break;
        }
        transformedReadings.push({
          id: `${logEntryKey}_${sensorType}`,
          type: sensorType,
          value: numericValue,
          timestamp: new Date(entryTimestampNumber),
          unit: unit,
          // location: snapshot.location, // Dihapus
          // deviceId: "YOUR_DEVICE_ID", // Jika Anda memiliki deviceId
        });
      }
    }
  });
  return transformedReadings;
}

function transformRawSnapshotsToChartData(rawSnapshots: RawHistoricalEntry[]): ChartData[] {
  if (!rawSnapshots) return [];
  return rawSnapshots.map(snapshot => {
    const chartPoint: ChartData = {
      time: new Date(snapshot.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    };
    if (snapshot.temperature !== undefined) chartPoint.temperature = parseFloat(String(snapshot.temperature));
    if (snapshot.humidity !== undefined) chartPoint.humidity = parseFloat(String(snapshot.humidity));
    if (snapshot.light_lux !== undefined) chartPoint.light = parseFloat(String(snapshot.light_lux));
    if (snapshot.gas_ppm !== undefined) chartPoint.gas = parseFloat(String(snapshot.gas_ppm));
    return chartPoint;
  });
}
// --- Akhir Fungsi Helper ---


export default function DashboardPage() {
  const {
    sensorData: rawLatestSensorData,
    loading: latestValuesLoading,
    error: latestValuesError,
  } = useLatestSensorData();

  const latestSensorValues = rawLatestSensorData as RawLatestSensorValues | null;

  const [rawHistoricalSnapshots, setRawHistoricalSnapshots] = useState<RawHistoricalEntry[]>([]);
  const [loadingHistorical, setLoadingHistorical] = useState(true);
  const [errorHistorical, setErrorHistorical] = useState<string | null>(null);

  const sensorTypesForCardsAndList: AppSensorData['type'][] = ["temperature", "humidity", "light", "gas"];
  const chartSensorKeys: (keyof Omit<ChartData, 'time'>)[] = ["temperature", "humidity", "light", "gas"];

  useEffect(() => {
    const loadHistoricalData = async () => {
      setLoadingHistorical(true);
      setErrorHistorical(null);
      try {
        const data = await fetchRawHistoricalSnapshots();
        setRawHistoricalSnapshots(data);
      } catch (err: any) {
        setErrorHistorical(err.message || "Failed to load historical sensor data.");
        console.error("useEffect Error: Loading historical data:", err);
      } finally {
        setLoadingHistorical(false);
      }
    };
    loadHistoricalData();
  }, []);

  const allHistoricalReadingsForTopList = useMemo(
    () => transformSnapshotsToAppSensorData(rawHistoricalSnapshots),
    [rawHistoricalSnapshots]
  );

  const chartDisplayData = useMemo(
    () => transformRawSnapshotsToChartData(rawHistoricalSnapshots),
    [rawHistoricalSnapshots]
  );

  const handleExportHistoricalData = () => {
    if (rawHistoricalSnapshots.length === 0) {
      alert("No historical data to export.");
      return;
    }

    // Header CSV disesuaikan, 'location' dihapus
    const headers = ["timestamp_iso", "temperature", "humidity", "light_lux", "gas_ppm", "original_id"];
    let csvContent = headers.join(",") + "\r\n";

    rawHistoricalSnapshots.forEach(entry => {
      // Baris CSV disesuaikan, 'location' dihapus
      const row = [
        new Date(entry.timestamp).toISOString(),
        entry.temperature ?? "",
        entry.humidity ?? "",
        entry.light_lux ?? "",
        entry.gas_ppm ?? "",
        entry.id ?? "",
        // entry.location ?? "" // Dihapus
      ];
      csvContent += row.join(",") + "\r\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, "ruminix_sensor_history.csv");
  };

  if (latestValuesError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
        <div className="text-center p-8 bg-white shadow-xl rounded-lg">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Oops! Something Went Wrong</h1>
          <p className="text-gray-600 mb-6">We're having trouble loading live sensor data.</p>
          <Alert className="bg-gradient-to-r from-gray-50 to-gray-100 border-2 border-gray-300 text-left">
            <AlertCircle className="h-4 w-4 text-gray-700" />
            <AlertTitle className="text-gray-800 font-semibold">Error Details</AlertTitle>
            <AlertDescription className="text-gray-700">{String(latestValuesError)}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (latestValuesLoading && !latestSensorValues && loadingHistorical && chartDisplayData.length === 0 && allHistoricalReadingsForTopList.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-gray-700 to-gray-900 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          </div>
          <p className="text-gray-600 text-lg">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  const globalLastUpdatedTimestamp = latestSensorValues?.last_updated;

  return (
    <div className="space-y-10 bg-gradient-to-br from-gray-50 to-white min-h-screen p-4 md:p-6 lg:p-8">
      <header className="text-center py-4 md:py-8">
        <div className="inline-flex items-center justify-center gap-x-3 mb-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-gray-800 to-black rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="h-5 w-5 md:h-6 md:w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-sm md:text-base text-gray-600">Real-time monitoring of your smart IoT sensors</p>
          </div>
        </div>
      </header>

      {/* Live Sensor Readings */}
      <section>
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
          <div className="w-2 h-6 md:h-8 bg-gradient-to-b from-gray-700 to-gray-900 rounded-full shadow-sm"></div>
          Live Sensor Readings
        </h2>
        <div className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {latestValuesLoading && !latestSensorValues ? (
             sensorTypesForCardsAndList.map(type => (
                <Card key={`skeleton-latest-${type}`} className="shadow-md animate-pulse bg-gray-100 border-gray-200">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between">
                    <div className="h-5 w-2/3 bg-gray-300 rounded"></div>
                    <div className="w-8 h-8 bg-gray-400 rounded-lg"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-10 w-1/2 bg-gray-300 rounded my-1"></div>
                    <div className="h-4 w-1/3 bg-gray-300 rounded"></div>
                  </CardContent>
                </Card>
             ))
          ) : latestSensorValues ? (
            sensorTypesForCardsAndList.map((type) => {
              let rawValue: string | number | undefined;
              let displayName = "";
              let unit = "";

              switch (type) {
                case "temperature": rawValue = latestSensorValues.temperature; displayName = "Temperature"; unit = "°C"; break;
                case "humidity": rawValue = latestSensorValues.humidity; displayName = "Humidity"; unit = "%"; break;
                case "light": rawValue = latestSensorValues.light_lux; displayName = "Light Lux"; unit = "lux"; break;
                case "gas": rawValue = latestSensorValues.gas_ppm; displayName = "Gas PPM"; unit = "ppm"; break;
                default: return <Card key={`unknown-${type}`}><CardContent>Unknown: {type}</CardContent></Card>;
              }

              if (rawValue === undefined || rawValue === null || String(rawValue).trim() === "" || String(rawValue).toLowerCase().trim() === "null") {
                return (
                    <Card key={`nodata-latest-${type}`} className="shadow-md bg-gray-50 border-gray-200">
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-gray-600">{displayName}</CardTitle></CardHeader>
                        <CardContent><div className="text-2xl font-bold text-gray-500">N/A</div><p className="text-xs text-gray-400">Sensor offline or no reading.</p></CardContent>
                    </Card>
                );
              }
              const numericValue = parseFloat(String(rawValue));
               if (isNaN(numericValue)) {
                 return (
                    <Card key={`invalid-latest-${type}`} className="shadow-md bg-red-50 border-red-200">
                        <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-red-700">{displayName}</CardTitle></CardHeader>
                        <CardContent><div className="text-2xl font-bold text-red-600">Invalid</div><p className="text-xs text-red-400">Incorrect sensor value.</p></CardContent>
                    </Card>
                 );
               }

              const sensorCardDataForDisplay: AppSensorData = {
                id: `latest-${type}-${globalLastUpdatedTimestamp || Date.now()}`,
                type: type, value: numericValue, unit: unit,
                timestamp: globalLastUpdatedTimestamp ? new Date(globalLastUpdatedTimestamp) : new Date(),
                name: displayName,
              };
              return <SensorCard key={`sensorcard-${type}`} sensorData={sensorCardDataForDisplay} />;
            })
          ) : (
             <div className="col-span-full text-center text-gray-500 py-10 text-lg">
                <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                No live sensor data currently available.
             </div>
          )}
        </div>
      </section>

      {/* Data Export Section */}
      <section className="mt-8 md:mt-10">
        <div className="flex justify-between items-center mb-4 md:mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
              <div className="w-2 h-6 md:h-8 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full shadow-sm"></div>
              Data Export
            </h2>
            <Button onClick={handleExportHistoricalData} variant="outline" size="sm" disabled={loadingHistorical || rawHistoricalSnapshots.length === 0}>
                <DownloadCloud className="h-4 w-4 mr-2" />
                Export Historical Data (CSV)
            </Button>
        </div>
        <Card className="bg-gray-50/50 border-gray-200/75">
            <CardContent className="p-4 text-sm text-gray-600">
                <p>Export up to 100 most recent historical sensor readings from the <code>/sensorHistory</code> path as a CSV file. This includes raw values and timestamps.</p>
            </CardContent>
        </Card>
      </section>

      {/* Sensor Trends (Charts) */}
      <section className="mt-8 md:mt-10">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
          <div className="w-2 h-6 md:h-8 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full shadow-sm"></div>
          Sensor Activity Charts
        </h2>
        {loadingHistorical && chartDisplayData.length === 0 ? (
          <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
            {chartSensorKeys.map((key, index) => (
                <Card key={`loading-chart-${key}-${index}`} className="shadow-md animate-pulse">
                    <CardHeader><div className="h-6 w-3/4 bg-gray-300 rounded mx-auto mt-2"></div></CardHeader>
                    <CardContent className="h-[300px] bg-gray-200 rounded-b-md flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </CardContent>
                </Card>
            ))}
          </div>
        ) : errorHistorical ? (
          <Alert variant="destructive" className="col-span-full text-left">
            <AlertCircle className="h-5 w-5" />
            <AlertTitle className="text-lg">Error Loading Chart Data</AlertTitle>
            <AlertDescription>{errorHistorical}</AlertDescription>
          </Alert>
        ) : chartDisplayData.length > 0 ? (
          <div className="grid gap-4 md:gap-6 grid-cols-1 lg:grid-cols-2">
            {chartSensorKeys.map((sensorKey) => {
              const chartTitle = CHART_SENSOR_KEY_TO_DISPLAY_NAME[sensorKey] || `${sensorKey.charAt(0).toUpperCase() + sensorKey.slice(1)}`;
              return (
                <SensorChart
                  key={`chart-${sensorKey}`}
                  data={chartDisplayData}
                  title={chartTitle}
                  sensorKeyToDisplay={sensorKey}
                />
              );
            })}
          </div>
        ) : (
          <Card className="shadow-md">
            <CardContent className="flex flex-col items-center justify-center h-[320px] text-gray-500">
                <Sparkles className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium">No Historical Data</p>
                <p className="text-sm">Not enough data points to display charts yet.</p>
            </CardContent>
          </Card>
        )}
      </section>

      {/* Top 10 Data Lists */}
      <section className="mt-8 md:mt-10">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
          <div className="w-2 h-6 md:h-8 bg-gradient-to-b from-gray-600 to-gray-800 rounded-full shadow-sm"></div>
          Top 10 Sensor Readings
        </h2>
        <div className="grid gap-4 md:gap-6 grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          {loadingHistorical && allHistoricalReadingsForTopList.length === 0 ? (
            sensorTypesForCardsAndList.map(type => (
              <Card key={`skeleton-top-${type}`} className="shadow-md animate-pulse bg-gray-100">
                <CardHeader className="pb-2"><div className="h-6 w-3/4 bg-gray-300 rounded"></div></CardHeader>
                <CardContent className="space-y-2 pt-2">
                  {[...Array(3)].map((_, i) => (<div key={i} className="h-8 bg-gray-200 rounded"></div>))}
                </CardContent>
              </Card>
            ))
          ) : errorHistorical ? (
            !loadingHistorical && <div className="col-span-full text-left">
              <Alert variant="destructive">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle className="text-lg">Error Loading Top Readings</AlertTitle>
                <AlertDescription>{errorHistorical}</AlertDescription>
              </Alert>
            </div>
          ) : allHistoricalReadingsForTopList.length > 0 ? (
            sensorTypesForCardsAndList.map((sensorTypeString) => (
              <TopDataList
                key={`top-list-${sensorTypeString}`}
                data={allHistoricalReadingsForTopList}
                type={sensorTypeString}
                title={`Top ${sensorTypeString.charAt(0).toUpperCase() + sensorTypeString.slice(1)}`}
              />
            ))
          ) : (
             !loadingHistorical && <div className="col-span-full text-center text-gray-500 py-10 text-lg">
                <Sparkles className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                No historical data available for top readings.
            </div>
          )}
        </div>
      </section>

      {/* System Health */}
      <section className="mt-8 md:mt-10 pb-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
          <div className="w-2 h-6 md:h-8 bg-gradient-to-b from-gray-500 to-gray-700 rounded-full shadow-sm"></div>
           System Status
         </h2>
         <SystemHealth />
       </section>
    </div>
  );
}
