"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, BarChart3, Zap } from "lucide-react"

const navigation = [
  {
    name: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },

]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="pb-12 w-72 bg-gradient-to-b from-gray-50 to-white border-r border-gray-200">
      <div className="space-y-4 py-6">
        <div className="px-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black rounded-xl flex items-center justify-center shadow-lg">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Rumin1x</h1>
              <p className="text-xs text-gray-500">Smart Monitoring Farm</p>
            </div>
          </div>

          <div className="space-y-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Button
                  key={item.href}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-12 rounded-xl transition-all duration-200",
                    isActive
                      ? "bg-gray-900 text-white shadow-lg hover:bg-gray-800"
                      : "hover:bg-gray-100 text-gray-600 hover:text-gray-900",
                  )}
                  asChild
                >
                  <Link href={item.href}>
                    <div
                      className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center mr-3",
                        isActive ? "bg-white text-gray-900" : "bg-gray-200 text-gray-500",
                      )}
                    >
                      <item.icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </Link>
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
