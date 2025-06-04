// services/sensorService.ts (atau file serupa)
import { dbRTDB } from '@/lib/firebase'; // Pastikan path ke konfigurasi Firebase RTDB Anda benar
import { ref, query, orderByChild, limitToLast, get } from "firebase/database";
import type { SensorData } from "@/lib/types";

// Mapping dari key di Firebase ke 'type' yang digunakan di aplikasi
const SENSOR_KEY_TO_TYPE_MAP: Record<string, string> = {
  temperature: "temperature",
  humidity: "humidity",
  light_lux: "light", // light_lux di Firebase menjadi type 'light'
  gas_ppm: "gas",     // gas_ppm di Firebase menjadi type 'gas'
};

export async function fetchAllHistoricalSensorDataFromRTDB(maxHistoryEntries = 50): Promise<SensorData[]> {
  const sensorHistoryRef = ref(dbRTDB, '/sensorHistory');
  // Ambil 'maxHistoryEntries' entri terbaru berdasarkan timestamp
  // Jika Anda menyimpan data dengan push() ID standar Firebase, mereka sudah time-ordered.
  // Jika tidak, dan Anda punya field 'timestamp' di tiap entri, order by that.
  // Untuk contoh ini, kita order by 'timestamp' child.
  const q = query(sensorHistoryRef, orderByChild('timestamp'), limitToLast(maxHistoryEntries));

  try {
    const snapshot = await get(q);
    const transformedReadings: SensorData[] = [];

    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        const logEntryKey = childSnapshot.key; // ID unik dari entri log, misal: -ORV5EhiT_NeX0ouakx0
        const historicalData = childSnapshot.val(); // Data di dalam entri log
        const entryTimestamp = historicalData.timestamp; // Timestamp spesifik entri ini

        if (!entryTimestamp) return; // Lewati jika tidak ada timestamp

        // Iterasi melalui setiap jenis sensor dalam satu entri history
        for (const keyInFirebase in historicalData) {
          if (SENSOR_KEY_TO_TYPE_MAP[keyInFirebase]) {
            const sensorType = SENSOR_KEY_TO_TYPE_MAP[keyInFirebase];
            let value = historicalData[keyInFirebase];

            // Pastikan value adalah angka
            const numericValue = parseFloat(value);
            if (isNaN(numericValue)) continue; // Lewati jika value tidak valid

            transformedReadings.push({
              id: `${logEntryKey}_${sensorType}`, // Buat ID unik
              type: sensorType,
              value: numericValue,
              timestamp: entryTimestamp,
              // location: historicalData.location, // jika ada field location
            });
          }
        }
      });
    }
    // Data dari limitToLast + orderByChild('timestamp') akan urut menaik berdasarkan timestamp.
    // Jika Anda ingin data terbaru (timestamp terbesar) di awal array, bisa di-reverse:
    // return transformedReadings.reverse();
    // Namun, TopDataList akan melakukan sorting sendiri berdasarkan value, jadi urutan awal di sini kurang krusial.
    return transformedReadings;
  } catch (error) {
    console.error("Error fetching historical sensor data from RTDB:", error);
    return [];
  }
}