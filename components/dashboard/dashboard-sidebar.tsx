"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LayoutDashboard, Thermometer, Droplets, Sun, Wind, Settings, BarChart3 } from "lucide-react"

const navigation = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Temperature",
    href: "/dashboard/temperature",
    icon: Thermometer,
  },
  {
    name: "Humidity",
    href: "/dashboard/humidity",
    icon: Droplets,
  },
  {
    name: "Light",
    href: "/dashboard/light",
    icon: Sun,
  },
  {
    name: "Gas",
    href: "/dashboard/gas",
    icon: Wind,
  },
  {
    name: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="pb-12 w-64">
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Sensors</h2>
          <ScrollArea className="h-[300px] px-1">
            <div className="space-y-1">
              {navigation.map((item) => (
                <Button
                  key={item.href}
                  variant={pathname === item.href ? "secondary" : "ghost"}
                  className={cn("w-full justify-start", pathname === item.href && "bg-muted")}
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Link>
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
