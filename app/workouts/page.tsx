"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { CalendarIcon, Dumbbell, Plus, Search, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useWorkouts } from "@/components/workout-provider"

export default function WorkoutsPage() {
  const { workouts, deleteWorkout } = useWorkouts()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredWorkouts = workouts.filter(
    (workout) =>
      workout.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      workout.exercises.some((exercise) => exercise.name.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const sortedWorkouts = [...filteredWorkouts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Workouts</h1>
          <p className="text-muted-foreground">Manage your training sessions</p>
        </div>
        <Link href="/workouts/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Workout
          </Button>
        </Link>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search workouts or exercises..."
          className="pl-8"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {sortedWorkouts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <Dumbbell className="h-10 w-10 text-muted-foreground mb-4" />
            <CardTitle className="text-xl mb-2">No workouts found</CardTitle>
            <CardDescription className="mb-4">
              {workouts.length === 0
                ? "You haven't created any workouts yet."
                : "No workouts match your search criteria."}
            </CardDescription>
            {workouts.length === 0 && (
              <Link href="/workouts/new">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Workout
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {sortedWorkouts.map((workout) => (
            <Card key={workout.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{workout.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <CalendarIcon className="mr-1 h-3 w-3" />
                      {format(new Date(workout.date), "MMMM d, yyyy")}
                    </CardDescription>
                  </div>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete workout</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this workout? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteWorkout(workout.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {workout.exercises.slice(0, 3).map((exercise) => (
                    <div key={exercise.id} className="text-sm">
                      <span className="font-medium">{exercise.name}</span>
                      <span className="text-muted-foreground"> • {exercise.sets.length} sets</span>
                    </div>
                  ))}
                  {workout.exercises.length > 3 && (
                    <div className="text-sm text-muted-foreground">+{workout.exercises.length - 3} more exercises</div>
                  )}
                </div>
                <div className="mt-4 flex justify-end">
                  <Link href={`/workouts/${workout.id}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
