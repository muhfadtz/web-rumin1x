"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { generateSampleData } from "@/lib/sample-data"
import { Loader2, Database, CheckCircle, AlertCircle } from "lucide-react"

export function DataGenerator() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null)

  const handleGenerateData = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await generateSampleData()
      setResult(response)
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Unknown error occurred",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Sample Data Generator
        </CardTitle>
        <CardDescription>Generate additional sample IoT sensor data for testing the dashboard</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {result && (
          <Alert variant={result.success ? "default" : "destructive"}>
            {result.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
            <AlertDescription>{result.message}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            This will generate 50 additional sample sensor readings across all sensor types (temperature, humidity,
            light, gas) with random values and recent timestamps.
          </p>

          <Button onClick={handleGenerateData} disabled={loading} className="w-full">
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Generate Sample Data
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
