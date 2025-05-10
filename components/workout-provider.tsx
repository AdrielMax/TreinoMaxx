"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { useToast } from "@/components/ui/use-toast"

export type Exercise = {
  id: string
  name: string
  sets: {
    id: string
    reps: number
    weight: number
    notes?: string
  }[]
}

export type Workout = {
  id: string
  name: string
  date: string
  notes?: string
  exercises: Exercise[]
}

type WorkoutContextType = {
  workouts: Workout[]
  addWorkout: (workout: Omit<Workout, "id">) => string
  updateWorkout: (id: string, workout: Omit<Workout, "id">) => void
  deleteWorkout: (id: string) => void
  getWorkout: (id: string) => Workout | undefined
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined)

export function WorkoutProvider({ children }: { children: React.ReactNode }) {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const { toast } = useToast()

  // Load workouts from localStorage on mount
  useEffect(() => {
    const savedWorkouts = localStorage.getItem("workouts")
    if (savedWorkouts) {
      try {
        setWorkouts(JSON.parse(savedWorkouts))
      } catch (error) {
        console.error("Failed to parse workouts from localStorage", error)
        toast({
          title: "Error loading workouts",
          description: "There was a problem loading your saved workouts.",
          variant: "destructive",
        })
      }
    }
  }, [toast])

  // Save workouts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("workouts", JSON.stringify(workouts))
  }, [workouts])

  const addWorkout = (workout: Omit<Workout, "id">) => {
    const id = uuidv4()
    const newWorkout = { ...workout, id }
    setWorkouts((prev) => [...prev, newWorkout])
    toast({
      title: "Workout added",
      description: "Your workout has been saved successfully.",
    })
    return id
  }

  const updateWorkout = (id: string, workout: Omit<Workout, "id">) => {
    setWorkouts((prev) => prev.map((w) => (w.id === id ? { ...workout, id } : w)))
    toast({
      title: "Workout updated",
      description: "Your workout has been updated successfully.",
    })
  }

  const deleteWorkout = (id: string) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id))
    toast({
      title: "Workout deleted",
      description: "Your workout has been deleted.",
    })
  }

  const getWorkout = (id: string) => {
    return workouts.find((w) => w.id === id)
  }

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        getWorkout,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  )
}

export function useWorkouts() {
  const context = useContext(WorkoutContext)
  if (context === undefined) {
    throw new Error("useWorkouts must be used within a WorkoutProvider")
  }
  return context
}
