"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dumbbell } from "lucide-react"

type WorkoutDay = {
  day: string
  name: string
  exercises: {
    name: string
    sets: number
    reps: number
    weight: number
  }[]
}

const workoutSchedule: WorkoutDay[] = [
  {
    day: "Monday",
    name: "Chest & Triceps",
    exercises: [
      { name: "Bench Press", sets: 4, reps: 8, weight: 225 },
      { name: "Incline Dumbbell Press", sets: 3, reps: 10, weight: 70 },
      { name: "Cable Flyes", sets: 3, reps: 12, weight: 50 },
      { name: "Tricep Pushdowns", sets: 3, reps: 12, weight: 70 },
      { name: "Skull Crushers", sets: 3, reps: 10, weight: 65 },
    ],
  },
  {
    day: "Tuesday",
    name: "Rest Day",
    exercises: [],
  },
  {
    day: "Wednesday",
    name: "Back & Biceps",
    exercises: [
      { name: "Deadlift", sets: 4, reps: 6, weight: 315 },
      { name: "Pull-ups", sets: 3, reps: 10, weight: 0 },
      { name: "Barbell Rows", sets: 3, reps: 8, weight: 185 },
      { name: "Barbell Curls", sets: 3, reps: 10, weight: 95 },
      { name: "Hammer Curls", sets: 3, reps: 12, weight: 35 },
    ],
  },
  {
    day: "Thursday",
    name: "Rest Day",
    exercises: [],
  },
  {
    day: "Friday",
    name: "Legs & Shoulders",
    exercises: [
      { name: "Squats", sets: 4, reps: 8, weight: 275 },
      { name: "Leg Press", sets: 3, reps: 10, weight: 360 },
      { name: "Romanian Deadlift", sets: 3, reps: 10, weight: 225 },
      { name: "Shoulder Press", sets: 4, reps: 8, weight: 135 },
      { name: "Lateral Raises", sets: 3, reps: 12, weight: 25 },
    ],
  },
  {
    day: "Saturday",
    name: "Full Body",
    exercises: [
      { name: "Bench Press", sets: 3, reps: 8, weight: 205 },
      { name: "Pull-ups", sets: 3, reps: 8, weight: 0 },
      { name: "Squats", sets: 3, reps: 8, weight: 245 },
      { name: "Shoulder Press", sets: 3, reps: 8, weight: 125 },
      { name: "Barbell Curls", sets: 3, reps: 10, weight: 85 },
    ],
  },
  {
    day: "Sunday",
    name: "Rest Day",
    exercises: [],
  },
]

export function UpcomingWorkouts({ fullView = false }: { fullView?: boolean }) {
  // Get today's day name
  const today = new Date().toLocaleDateString("en-US", { weekday: "long" })

  // Reorder the workout schedule to start with today
  const todayIndex = workoutSchedule.findIndex((workout) => workout.day === today)
  const reorderedSchedule = [...workoutSchedule.slice(todayIndex), ...workoutSchedule.slice(0, todayIndex)].slice(
    0,
    fullView ? 7 : 4,
  )

  return (
    <div className="space-y-4">
      {reorderedSchedule.map((workout, index) => (
        <Card key={workout.day} className={index === 0 ? "border-primary" : ""}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dumbbell className={`h-5 w-5 ${index === 0 ? "text-primary" : "text-muted-foreground"}`} />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{workout.day}</span>
                    {index === 0 && (
                      <Badge variant="outline" className="text-xs">
                        Today
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{workout.name}</p>
                </div>
              </div>
              {workout.exercises.length > 0 && (
                <span className="text-sm text-muted-foreground">{workout.exercises.length} exercises</span>
              )}
            </div>

            {fullView && workout.exercises.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {workout.exercises.map((exercise) => (
                    <div key={exercise.name} className="rounded-md border p-2">
                      <div className="font-medium">{exercise.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {exercise.sets} sets × {exercise.reps} reps @ {exercise.weight} lbs
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

