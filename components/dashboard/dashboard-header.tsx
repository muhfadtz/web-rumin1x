"use client"

import { Button } from "@/components/ui/button"
import { Bell, Settings } from "lucide-react"
import { MobileNav } from "./mobile-nav"
import Link from "next/link"

export function DashboardHeader() {
  return (
    <header className="border-b border-gray-200 bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex items-center">
          <MobileNav />
          <div className="hidden md:block">
            <h1 className="text-lg font-semibold text-gray-900">Smart Dashboard</h1>
            <p className="text-xs text-gray-500">Real-time IoT monitoring</p>
          </div>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none"></div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative hover:bg-gray-100">
              <Bell className="h-4 w-4" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-900 rounded-full"></div>
              <span className="sr-only">Notifications</span>
            </Button>
            <Button variant="ghost" size="icon" className="hover:bg-gray-100" asChild>
              <Link href="/dashboard/settings">
                <Settings className="h-4 w-4" />
                <span className="sr-only">Settings</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
