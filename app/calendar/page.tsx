"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from "date-fns"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWorkouts } from "@/components/workout-provider"

export default function CalendarPage() {
  const { workouts } = useWorkouts()
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [calendarDays, setCalendarDays] = useState<Date[]>([])

  useEffect(() => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd })
    setCalendarDays(days)
  }, [currentMonth])

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const getWorkoutsForDay = (date: Date) => {
    return workouts.filter((workout) => {
      const workoutDate = new Date(workout.date)
      return isSameDay(workoutDate, date)
    })
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Training Calendar</h1>
          <p className="text-muted-foreground">View and manage your workout schedule</p>
        </div>
        <Link href="/workouts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Workout
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>{format(currentMonth, "MMMM yyyy")}</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous month</span>
            </Button>
            <Button variant="outline" size="icon" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next month</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="text-sm font-medium text-muted-foreground py-1">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before the start of the month */}
            {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() || 7 }).map(
              (_, index) => (
                <div key={`empty-start-${index}`} className="h-24 border rounded-md p-1 bg-muted/20" />
              ),
            )}

            {/* Calendar days */}
            {calendarDays.map((day) => {
              const dayWorkouts = getWorkoutsForDay(day)
              const isToday = isSameDay(day, new Date())

              return (
                <div
                  key={day.toString()}
                  className={`h-24 border rounded-md p-1 overflow-hidden ${isToday ? "border-primary" : ""}`}
                >
                  <div className="flex flex-col h-full">
                    <div className="text-sm font-medium mb-1">
                      {format(day, "d")}
                      {isToday && <span className="ml-1 inline-flex h-2 w-2 rounded-full bg-primary"></span>}
                    </div>
                    <div className="flex-1 overflow-y-auto space-y-1">
                      {dayWorkouts.map((workout) => (
                        <Link key={workout.id} href={`/workouts/${workout.id}`}>
                          <div className="text-xs bg-primary/10 text-primary rounded px-1 py-0.5 truncate hover:bg-primary/20 transition-colors">
                            {workout.name}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )
            })}

            {/* Empty cells for days after the end of the month */}
            {Array.from({
              length:
                (7 - ((new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDay() + 1) % 7)) % 7,
            }).map((_, index) => (
              <div key={`empty-end-${index}`} className="h-24 border rounded-md p-1 bg-muted/20" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
