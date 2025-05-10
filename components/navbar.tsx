"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Activity, Calendar, Home, Menu } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const routes = [
  {
    name: "Dashboard",
    path: "/",
    icon: Home,
  },
  {
    name: "Workouts",
    path: "/workouts",
    icon: Activity,
  },
  {
    name: "Calendar",
    path: "/calendar",
    icon: Calendar,
  },
]

export function Navbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Activity className="h-6 w-6" />
            <span className="font-bold">TrainTrack</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {routes.map((route) => (
              <Link
                key={route.path}
                href={route.path}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === route.path ? "text-foreground" : "text-foreground/60",
                )}
              >
                {route.name}
              </Link>
            ))}
          </nav>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="outline" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link href="/" className="flex items-center space-x-2" onClick={() => setOpen(false)}>
              <Activity className="h-6 w-6" />
              <span className="font-bold">TrainTrack</span>
            </Link>
            <nav className="mt-8 flex flex-col space-y-3">
              {routes.map((route) => (
                <Link
                  key={route.path}
                  href={route.path}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1 text-base hover:text-foreground/80",
                    pathname === route.path ? "text-foreground font-medium" : "text-foreground/60",
                  )}
                >
                  <route.icon className="h-5 w-5" />
                  {route.name}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Link href="/" className="mr-6 flex items-center space-x-2 md:hidden">
              <Activity className="h-6 w-6" />
              <span className="font-bold">TrainTrack</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
