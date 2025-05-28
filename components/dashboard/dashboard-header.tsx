"use client"

import { Button } from "@/components/ui/button"
import { Settings } from "lucide-react"
import { MobileNav } from "./mobile-nav"
import Link from "next/link"

export function DashboardHeader() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex items-center">
          <MobileNav />
          <h1 className="text-lg font-semibold ml-2 md:ml-0">IoT Dashboard</h1>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">{/* Search or other controls can go here */}</div>
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/settings">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
