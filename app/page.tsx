import Link from "next/link"
import { CalendarDays, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { WeeklyOverview } from "@/components/weekly-overview"
import { RecentWorkouts } from "@/components/recent-workouts"

export default function Home() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Training Dashboard</h1>
          <p className="text-muted-foreground">Track and manage your workout sessions</p>
        </div>
        <Link href="/workouts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Workout
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Overview</CardTitle>
            <CardDescription>Your training schedule for this week</CardDescription>
          </CardHeader>
          <CardContent>
            <WeeklyOverview />
          </CardContent>
          <CardFooter>
            <Link href="/calendar" className="w-full">
              <Button variant="outline" className="w-full">
                <CalendarDays className="mr-2 h-4 w-4" />
                View Full Calendar
              </Button>
            </Link>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Workouts</CardTitle>
            <CardDescription>Your latest training sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentWorkouts />
          </CardContent>
          <CardFooter>
            <Link href="/workouts" className="w-full">
              <Button variant="outline" className="w-full">
                View All Workouts
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
