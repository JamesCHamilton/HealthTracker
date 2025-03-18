"use client"
import { Progress } from "@/components/ui/progress"

const strengthData = [
  {
    exercise: "Bench Press",
    currentMax: 225,
    previousMax: 215,
    improvement: 4.7,
  },
  {
    exercise: "Squat",
    currentMax: 315,
    previousMax: 295,
    improvement: 6.8,
  },
  {
    exercise: "Deadlift",
    currentMax: 365,
    previousMax: 350,
    improvement: 4.3,
  },
  {
    exercise: "Shoulder Press",
    currentMax: 145,
    previousMax: 135,
    improvement: 7.4,
  },
]

export function StrengthProgress() {
  return (
    <div className="space-y-4">
      {strengthData.map((item) => (
        <div key={item.exercise} className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-medium">{item.exercise}</span>
            <span className="text-sm text-muted-foreground">
              {item.currentMax} lbs
              <span className="ml-2 text-green-500">↑ {item.improvement}%</span>
            </span>
          </div>
          <Progress value={item.improvement * 10} className="h-2" />
        </div>
      ))}
    </div>
  )
}

