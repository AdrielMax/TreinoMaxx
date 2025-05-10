"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { format, startOfWeek, addDays, isSameDay } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useWorkouts } from "@/components/workout-provider"
import { cn } from "@/lib/utils"

export function WeeklyOverview() {
  const { workouts } = useWorkouts()
  const [weekDays, setWeekDays] = useState<Date[]>([])

  useEffect(() => {
    const today = new Date()
    const startDay = startOfWeek(today, { weekStartsOn: 1 }) // Start from Monday
    const days = Array.from({ length: 7 }, (_, i) => addDays(startDay, i))
    setWeekDays(days)
  }, [])

  const getWorkoutsForDay = (date: Date) => {
    return workouts.filter((workout) => {
      const workoutDate = new Date(workout.date)
      return isSameDay(workoutDate, date)
    })
  }

  if (weekDays.length === 0) {
    return <div className="flex justify-center py-8">Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-7 gap-1">
        {weekDays.map((day, index) => {
          const dayWorkouts = getWorkoutsForDay(day)
          const isToday = isSameDay(day, new Date())

          return (
            <div key={index} className="flex flex-col items-center">
              <div className="text-xs text-muted-foreground">{format(day, "EEE")}</div>
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-sm",
                  isToday && "bg-primary text-primary-foreground font-medium",
                )}
              >
                {format(day, "d")}
              </div>
              {dayWorkouts.length > 0 && <div className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />}
            </div>
          )
        })}
      </div>

      <div className="space-y-2">
        {weekDays.map((day, index) => {
          const dayWorkouts = getWorkoutsForDay(day)
          if (dayWorkouts.length === 0) return null

          return (
            <div key={index} className="space-y-1">
              <div className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">{format(day, "EEEE, MMMM d")}</span>
              </div>
              <div className="space-y-1 pl-6">
                {dayWorkouts.map((workout) => (
                  <Link key={workout.id} href={`/workouts/${workout.id}`}>
                    <Button variant="ghost" className="h-auto w-full justify-start px-2 py-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {workout.exercises.length} exercises
                        </Badge>
                        <span>{workout.name}</span>
                      </div>
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {workouts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-muted-foreground">No workouts scheduled this week</p>
          <Link href="/workouts/new" className="mt-2">
            <Button variant="outline" size="sm">
              Create Your First Workout
            </Button>
          </Link>
        </div>
      )}
    </div>
  )
}
