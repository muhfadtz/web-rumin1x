// hooks/use-sensor-data.ts
'use client'; // Penting untuk hook yang menggunakan useEffect dan useState

import { useState, useEffect } from 'react';
import { dbRTDB } from '../lib/firebase'; // Sesuaikan path jika perlu
import { ref, onValue, off } from 'firebase/database';

// Definisikan tipe untuk data sensor Anda agar lebih aman
interface SensorData {
    gas_ppm: number;
    humidity: number;
    light_lux: number;
    temperature: number;
    // Tambahkan properti lain jika ada
}

export function useSensorData() {
    const [sensorData, setSensorData] = useState<SensorData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const sensorRef = ref(dbRTDB, 'sensor'); // 'sensor' adalah nama node di database Anda

        // Listener untuk data real-time
        const listener = onValue(sensorRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                setSensorData(data as SensorData);
                setError(null);
            } else {
                setSensorData(null);
                setError('Data sensor tidak ditemukan.');
            }
            setLoading(false);
        }, (err) => {
            console.error("Firebase onValue error:", err);
            setError('Gagal mengambil data dari Firebase.');
            setSensorData(null);
            setLoading(false);
        });

        // Cleanup listener saat komponen di-unmount
        return () => {
            off(sensorRef, 'value', listener);
        };
    }, []); // Array dependensi kosong agar useEffect hanya berjalan sekali (saat mount)

    return { sensorData, error, loading };
}