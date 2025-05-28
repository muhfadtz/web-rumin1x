# IoT Dashboard

A modern, responsive web application for monitoring real-time IoT sensor data built with Next.js 14 and Tailwind CSS. This version uses mock data for immediate testing and demonstration.

## Features

- 📊 **Real-time Data** - Live sensor data updates with mock data simulation
- 📱 **Responsive Design** - Works perfectly on desktop and mobile
- ♿ **Accessible** - ARIA labels, keyboard navigation, screen reader friendly
- 🎨 **Modern UI** - Clean design with shadcn/ui components
- 📈 **Data Visualization** - Interactive charts and gauges
- 🔧 **Extensible** - Easy to add new sensor types and features
- 🚀 **No Setup Required** - Works immediately with mock data

## Sensor Types Supported

- 🌡️ **Temperature** - Celsius readings with trend analysis
- 💧 **Humidity** - Percentage readings with historical data
- ☀️ **Light** - Lux measurements for ambient lighting
- 💨 **Gas** - PPM readings for air quality monitoring

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Data**: Mock data with real-time simulation
- **Styling**: Tailwind CSS, shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ 

## Installation & Development

1. **Install dependencies**:
   \`\`\`bash
   npm install
   \`\`\`
2. **Start development server**:
   \`\`\`bash
   npm run dev
   \`\`\`
3. **Open your browser** to `http://localhost:3000`

## Features

### Real-time Data Simulation
- Automatic data generation every 5 seconds
- 200+ historical data points
- Realistic sensor value ranges
- Multiple device locations

### Sample Data Generator
- Generate additional test data on demand
- Configurable sensor types and ranges
- Immediate dashboard updates

### Dashboard Components
- **Overview**: Real-time sensor cards and trends
- **Individual Sensor Pages**: Detailed views for each sensor type
- **System Health**: Status monitoring and alerts
- **Settings**: Data management and preferences

## Project Structure

\`\`\`
├── app/                    # Next.js App Router pages
│   └── dashboard/         # Dashboard pages
├── components/           # Reusable components
│   ├── dashboard/       # Dashboard-specific components
│   └── ui/              # shadcn/ui components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and mock data
└── public/             # Static assets
\`\`\`

## Key Components

### Data Management
- `useSensorData` - Hook for fetching sensor data
- `useLatestSensorValues` - Hook for current sensor values
- `mock-data.ts` - Mock data generation and management

### Dashboard
- `SensorCard` - Individual sensor value display
- `SensorChart` - Time-series data visualization
- `SystemHealth` - Overall system status
- `QuickStats` - Key metrics overview

## Extending the Dashboard

### Adding New Sensor Types

1. **Update types** in `lib/types.ts`:
   \`\`\`typescript
   export interface SensorData {
     type: "temperature" | "humidity" | "light" | "gas" | "pressure" // Add new type
     // ... other properties
   }
   \`\`\`

2. **Add sensor configuration** in `lib/mock-data.ts`:
   \`\`\`typescript
   const getSensorValue = (type: string) => {
     switch (type) {
       // ... existing cases
       case "pressure":
         return Math.random() * 50 + 950 // 950-1000 hPa
     }
   }
   \`\`\`

3. **Update sensor card** in `components/dashboard/sensor-card.tsx`
4. **Create dedicated page** in `app/dashboard/[sensor-type]/page.tsx`
5. **Update navigation** in `components/dashboard/dashboard-sidebar.tsx`

### Connecting Real IoT Devices

To connect real IoT devices, replace the mock data system with:

1. **WebSocket connections** for real-time data
2. **REST API endpoints** for device management
3. **Database integration** (PostgreSQL, MongoDB, etc.)
4. **MQTT broker** for IoT device communication

### Adding Features

- **Alerts/Notifications**: Threshold-based alerts
- **Data Export**: CSV/PDF export functionality
- **Device Management**: Device registration and configuration
- **Historical Analytics**: Advanced data analysis and reporting
- **User Management**: Multi-user support with permissions

## Deployment

This project is optimized for deployment on Vercel:

1. **Connect your repository** to Vercel
2. **Deploy** - Vercel will automatically build and deploy
3. **No environment variables required** for mock data version

## Performance Optimizations

- ✅ Server Components for static content
- ✅ Automatic data cleanup (keeps last 200 readings)
- ✅ Efficient re-rendering with React hooks
- ✅ Code splitting with App Router
- ✅ Responsive design for mobile performance

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## License

This project is licensed under the MIT License.
