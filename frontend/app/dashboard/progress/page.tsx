import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { WeightChart } from "@/components/dashboard/weight-chart"
import { StrengthProgress } from "@/components/dashboard/strength-progress"

const progressLogs = [
  {
    date: "Feb 19, 2025",
    weight: 185,
    strengthProgress: [
      { exercise: "Bench Press", maxWeight: 225, reps: 8 },
      { exercise: "Squat", maxWeight: 315, reps: 6 },
      { exercise: "Deadlift", maxWeight: 365, reps: 5 },
    ],
    notes: "Feeling stronger today. Increased bench press by 10 pounds.",
  },
  {
    date: "Feb 12, 2025",
    weight: 185.5,
    strengthProgress: [
      { exercise: "Bench Press", maxWeight: 215, reps: 8 },
      { exercise: "Squat", maxWeight: 305, reps: 6 },
      { exercise: "Deadlift", maxWeight: 355, reps: 5 },
    ],
    notes: "Good energy levels. Focus on form for deadlifts.",
  },
  {
    date: "Feb 5, 2025",
    weight: 186,
    strengthProgress: [
      { exercise: "Bench Press", maxWeight: 215, reps: 7 },
      { exercise: "Squat", maxWeight: 295, reps: 6 },
      { exercise: "Deadlift", maxWeight: 345, reps: 5 },
    ],
    notes: "Slight plateau on bench press. Need to adjust nutrition.",
  },
]

export default function ProgressPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Progress Tracking</h1>
          <p className="text-muted-foreground">Monitor your fitness journey and track improvements</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Log Progress
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="weight">Weight</TabsTrigger>
          <TabsTrigger value="strength">Strength</TabsTrigger>
          <TabsTrigger value="logs">Progress Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Weight Progress</CardTitle>
                <CardDescription>Your weight trend over time</CardDescription>
              </CardHeader>
              <CardContent>
                <WeightChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Strength Progress</CardTitle>
                <CardDescription>Your strength improvements by exercise</CardDescription>
              </CardHeader>
              <CardContent>
                <StrengthProgress />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="weight">
          <Card>
            <CardHeader>
              <CardTitle>Weight Tracking</CardTitle>
              <CardDescription>Detailed view of your weight changes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <WeightChart />
                <div className="border rounded-md">
                  <div className="grid grid-cols-3 font-medium p-4 border-b">
                    <div>Date</div>
                    <div>Weight</div>
                    <div>Change</div>
                  </div>
                  {progressLogs.map((log, index) => {
                    const prevWeight = index < progressLogs.length - 1 ? progressLogs[index + 1].weight : log.weight
                    const change = log.weight - prevWeight

                    return (
                      <div key={log.date} className="grid grid-cols-3 p-4 border-b last:border-0">
                        <div>{log.date}</div>
                        <div>{log.weight} lbs</div>
                        <div className={change < 0 ? "text-green-500" : change > 0 ? "text-red-500" : "text-gray-500"}>
                          {change === 0 ? "No change" : `${change > 0 ? "+" : ""}${change} lbs`}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="strength">
          <Card>
            <CardHeader>
              <CardTitle>Strength Progress</CardTitle>
              <CardDescription>Track your strength gains over time</CardDescription>
            </CardHeader>
            <CardContent>
              <StrengthProgress />

              <div className="mt-8 border rounded-md">
                <div className="grid grid-cols-4 font-medium p-4 border-b">
                  <div>Exercise</div>
                  <div>Starting Max</div>
                  <div>Current Max</div>
                  <div>Improvement</div>
                </div>
                {[
                  { exercise: "Bench Press", starting: 185, current: 225, improvement: 21.6 },
                  { exercise: "Squat", starting: 245, current: 315, improvement: 28.6 },
                  { exercise: "Deadlift", starting: 275, current: 365, improvement: 32.7 },
                  { exercise: "Shoulder Press", starting: 115, current: 145, improvement: 26.1 },
                ].map((item) => (
                  <div key={item.exercise} className="grid grid-cols-4 p-4 border-b last:border-0">
                    <div>{item.exercise}</div>
                    <div>{item.starting} lbs</div>
                    <div>{item.current} lbs</div>
                    <div className="text-green-500">+{item.improvement}%</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Progress Logs</CardTitle>
              <CardDescription>Your detailed progress entries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {progressLogs.map((log) => (
                  <Card key={log.date} className="overflow-hidden">
                    <CardHeader className="bg-muted/50 pb-3">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-lg">{log.date}</CardTitle>
                        <div className="text-sm font-medium">Weight: {log.weight} lbs</div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-medium mb-2">Strength Progress:</h4>
                          <div className="grid grid-cols-3 gap-2">
                            {log.strengthProgress.map((item) => (
                              <div key={item.exercise} className="border rounded-md p-2">
                                <div className="font-medium">{item.exercise}</div>
                                <div className="text-sm text-muted-foreground">
                                  {item.maxWeight} lbs × {item.reps} reps
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        {log.notes && (
                          <div>
                            <h4 className="font-medium mb-1">Notes:</h4>
                            <p className="text-sm text-muted-foreground">{log.notes}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

