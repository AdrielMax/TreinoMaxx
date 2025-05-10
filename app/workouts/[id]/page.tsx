"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { ArrowLeft, Calendar, Edit, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { useWorkouts, type Workout } from "@/components/workout-provider"

export default function WorkoutDetailsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { getWorkout, deleteWorkout } = useWorkouts()
  const [workout, setWorkout] = useState<Workout | undefined>(undefined)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const foundWorkout = getWorkout(params.id)
    setWorkout(foundWorkout)
    setLoading(false)

    if (!foundWorkout) {
      // Redirect to workouts page if workout not found
      setTimeout(() => {
        router.push("/workouts")
      }, 2000)
    }
  }, [params.id, getWorkout, router])

  const handleDelete = () => {
    deleteWorkout(params.id)
    router.push("/workouts")
  }

  if (loading) {
    return (
      <div className="container mx-auto py-6 flex items-center justify-center min-h-[50vh]">
        <p>Loading workout details...</p>
      </div>
    )
  }

  if (!workout) {
    return (
      <div className="container mx-auto py-6 flex flex-col items-center justify-center min-h-[50vh]">
        <h1 className="text-2xl font-bold mb-2">Workout not found</h1>
        <p className="text-muted-foreground mb-4">The workout you're looking for doesn't exist or has been deleted.</p>
        <Link href="/workouts">
          <Button>Go to Workouts</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Link href="/workouts">
          <Button variant="ghost" size="sm" className="gap-1">
            <ArrowLeft className="h-4 w-4" />
            Back to Workouts
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{workout.name}</h1>
          <div className="flex items-center text-muted-foreground mt-1">
            <Calendar className="h-4 w-4 mr-1" />
            <span>{format(new Date(workout.date), "EEEE, MMMM d, yyyy")}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/workouts/${params.id}/edit`}>
            <Button variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          </Link>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete
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
                  onClick={handleDelete}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {workout.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-line">{workout.notes}</p>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Exercises</CardTitle>
          <CardDescription>
            {workout.exercises.length} {workout.exercises.length === 1 ? "exercise" : "exercises"} in this workout
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {workout.exercises.map((exercise, index) => (
              <div key={exercise.id} className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
                    {index + 1}
                  </span>
                  <h3 className="text-lg font-medium">{exercise.name}</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[400px]">
                    <thead>
                      <tr className="border-b text-sm text-muted-foreground">
                        <th className="pb-2 pr-4 text-left font-medium">Set</th>
                        <th className="pb-2 px-4 text-left font-medium">Weight</th>
                        <th className="pb-2 px-4 text-left font-medium">Reps</th>
                        <th className="pb-2 pl-4 text-left font-medium">Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {exercise.sets.map((set, setIndex) => (
                        <tr key={set.id} className="border-b last:border-0">
                          <td className="py-3 pr-4 text-left">{setIndex + 1}</td>
                          <td className="py-3 px-4 text-left">{set.weight} kg</td>
                          <td className="py-3 px-4 text-left">{set.reps}</td>
                          <td className="py-3 pl-4 text-left text-muted-foreground">{set.notes || "-"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
