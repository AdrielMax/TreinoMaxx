"use client"

import Link from "next/link"
import { format } from "date-fns"
import { ArrowRight, Dumbbell } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useWorkouts } from "@/components/workout-provider"

export function RecentWorkouts() {
  const { workouts } = useWorkouts()

  // Get the 5 most recent workouts
  const recentWorkouts = [...workouts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  if (workouts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-muted-foreground">No workouts recorded yet</p>
        <Link href="/workouts/new" className="mt-2">
          <Button variant="outline" size="sm">
            Create Your First Workout
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {recentWorkouts.map((workout) => (
        <Link key={workout.id} href={`/workouts/${workout.id}`} className="block">
          <div className="group flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Dumbbell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{workout.name}</h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(workout.date), "MMM d, yyyy")} • {workout.exercises.length} exercises
                </p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </div>
        </Link>
      ))}
    </div>
  )
}
