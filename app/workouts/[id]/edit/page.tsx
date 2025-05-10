"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CalendarIcon, Plus, Save, Trash, X } from "lucide-react"
import { format } from "date-fns"
import { v4 as uuidv4 } from "uuid"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { useWorkouts, type Exercise, type Workout } from "@/components/workout-provider"

export default function EditWorkoutPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { getWorkout, updateWorkout } = useWorkouts()
  const [workout, setWorkout] = useState<Workout | undefined>(undefined)
  const [date, setDate] = useState<Date>(new Date())
  const [name, setName] = useState("")
  const [notes, setNotes] = useState("")
  const [exercises, setExercises] = useState<Exercise[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const foundWorkout = getWorkout(params.id)

    if (foundWorkout) {
      setWorkout(foundWorkout)
      setName(foundWorkout.name)
      setDate(new Date(foundWorkout.date))
      setNotes(foundWorkout.notes || "")
      setExercises(JSON.parse(JSON.stringify(foundWorkout.exercises))) // Deep copy
    } else {
      // Redirect to workouts page if workout not found
      setTimeout(() => {
        router.push("/workouts")
      }, 2000)
    }

    setLoading(false)
  }, [params.id, getWorkout, router])

  const handleAddExercise = () => {
    setExercises([
      ...exercises,
      {
        id: uuidv4(),
        name: "",
        sets: [
          {
            id: uuidv4(),
            reps: 0,
            weight: 0,
          },
        ],
      },
    ])
  }

  const handleExerciseNameChange = (id: string, name: string) => {
    setExercises(exercises.map((exercise) => (exercise.id === id ? { ...exercise, name } : exercise)))
  }

  const handleAddSet = (exerciseId: string) => {
    setExercises(
      exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: [
                ...exercise.sets,
                {
                  id: uuidv4(),
                  reps: 0,
                  weight: 0,
                },
              ],
            }
          : exercise,
      ),
    )
  }

  const handleSetChange = (
    exerciseId: string,
    setId: string,
    field: "reps" | "weight" | "notes",
    value: string | number,
  ) => {
    setExercises(
      exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.map((set) =>
                set.id === setId ? { ...set, [field]: field === "notes" ? value : Number(value) } : set,
              ),
            }
          : exercise,
      ),
    )
  }

  const handleRemoveExercise = (id: string) => {
    setExercises(exercises.filter((exercise) => exercise.id !== id))
  }

  const handleRemoveSet = (exerciseId: string, setId: string) => {
    setExercises(
      exercises.map((exercise) =>
        exercise.id === exerciseId
          ? {
              ...exercise,
              sets: exercise.sets.filter((set) => set.id !== setId),
            }
          : exercise,
      ),
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (!name.trim()) {
      alert("Please enter a workout name")
      return
    }

    if (exercises.length === 0) {
      alert("Please add at least one exercise")
      return
    }

    // Check if all exercises have names
    const hasUnnamedExercises = exercises.some((ex) => !ex.name.trim())
    if (hasUnnamedExercises) {
      alert("Please name all exercises")
      return
    }

    // Check if all exercises have at least one set
    const hasEmptySets = exercises.some((ex) => ex.sets.length === 0)
    if (hasEmptySets) {
      alert("Each exercise must have at least one set")
      return
    }

    updateWorkout(params.id, {
      name,
      date: date.toISOString(),
      notes,
      exercises,
    })

    router.push(`/workouts/${params.id}`)
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
        <Button onClick={() => router.push("/workouts")}>Go to Workouts</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Edit Workout</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Workout Details</CardTitle>
            <CardDescription>Update the information about your workout</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Workout Name</Label>
              <Input
                id="name"
                placeholder="e.g., Upper Body, Leg Day, Full Body"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : "Select a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={(date) => date && setDate(date)} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes about this workout..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="space-y-1">
              <CardTitle>Exercises</CardTitle>
              <CardDescription>Update the exercises for this workout</CardDescription>
            </div>
            <Button type="button" onClick={handleAddExercise} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Exercise
            </Button>
          </CardHeader>
          <CardContent>
            {exercises.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <p className="text-muted-foreground mb-4">No exercises added yet</p>
                <Button type="button" onClick={handleAddExercise} variant="outline">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Exercise
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                {exercises.map((exercise, exerciseIndex) => (
                  <div key={exercise.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
                          {exerciseIndex + 1}
                        </span>
                        <Input
                          placeholder="Exercise name"
                          value={exercise.name}
                          onChange={(e) => handleExerciseNameChange(exercise.id, e.target.value)}
                          className="max-w-xs"
                          required
                        />
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveExercise(exercise.id)}
                      >
                        <Trash className="h-4 w-4" />
                        <span className="sr-only">Remove exercise</span>
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <div className="grid grid-cols-12 gap-2 text-sm font-medium text-muted-foreground px-1">
                        <div className="col-span-1">#</div>
                        <div className="col-span-3">Weight</div>
                        <div className="col-span-3">Reps</div>
                        <div className="col-span-4">Notes</div>
                        <div className="col-span-1"></div>
                      </div>

                      {exercise.sets.map((set, setIndex) => (
                        <div key={set.id} className="grid grid-cols-12 gap-2 items-center">
                          <div className="col-span-1 text-sm text-muted-foreground">{setIndex + 1}</div>
                          <div className="col-span-3">
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              value={set.weight || ""}
                              onChange={(e) => handleSetChange(exercise.id, set.id, "weight", e.target.value)}
                            />
                          </div>
                          <div className="col-span-3">
                            <Input
                              type="number"
                              min="0"
                              placeholder="0"
                              value={set.reps || ""}
                              onChange={(e) => handleSetChange(exercise.id, set.id, "reps", e.target.value)}
                            />
                          </div>
                          <div className="col-span-4">
                            <Input
                              placeholder="Optional"
                              value={set.notes || ""}
                              onChange={(e) => handleSetChange(exercise.id, set.id, "notes", e.target.value)}
                            />
                          </div>
                          <div className="col-span-1">
                            {exercise.sets.length > 1 && (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => handleRemoveSet(exercise.id, set.id)}
                              >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Remove set</span>
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => handleAddSet(exercise.id)}
                      >
                        <Plus className="mr-2 h-3 w-3" />
                        Add Set
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </form>
    </div>
  )
}
