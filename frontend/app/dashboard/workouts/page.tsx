import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { UpcomingWorkouts } from "@/components/dashboard/upcoming-workouts"

export default function WorkoutsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Workout Schedule</h1>
          <p className="text-muted-foreground">View and manage your weekly workout routine</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Workout
        </Button>
      </div>

      <Tabs defaultValue="schedule" className="space-y-4">
        <TabsList>
          <TabsTrigger value="schedule">Weekly Schedule</TabsTrigger>
          <TabsTrigger value="templates">Workout Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Workout Schedule</CardTitle>
              <CardDescription>Your planned workouts for the week</CardDescription>
            </CardHeader>
            <CardContent>
              <UpcomingWorkouts fullView={true} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Workout Templates</CardTitle>
              <CardDescription>Saved workout routines you can add to your schedule</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="flex flex-col">
                  <CardHeader>
                    <CardTitle>Push Day</CardTitle>
                    <CardDescription>Chest, Shoulders, Triceps</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Bench Press: 4 sets × 8 reps</li>
                      <li>Overhead Press: 3 sets × 10 reps</li>
                      <li>Incline Dumbbell Press: 3 sets × 10 reps</li>
                      <li>Lateral Raises: 3 sets × 12 reps</li>
                      <li>Tricep Pushdowns: 3 sets × 12 reps</li>
                    </ul>
                  </CardContent>
                  <div className="p-4 pt-0 mt-auto">
                    <Button variant="outline" className="w-full">
                      Add to Schedule
                    </Button>
                  </div>
                </Card>

                <Card className="flex flex-col">
                  <CardHeader>
                    <CardTitle>Pull Day</CardTitle>
                    <CardDescription>Back, Biceps, Rear Delts</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Deadlifts: 4 sets × 6 reps</li>
                      <li>Pull-ups: 3 sets × 8-10 reps</li>
                      <li>Barbell Rows: 3 sets × 10 reps</li>
                      <li>Face Pulls: 3 sets × 15 reps</li>
                      <li>Barbell Curls: 3 sets × 10 reps</li>
                    </ul>
                  </CardContent>
                  <div className="p-4 pt-0 mt-auto">
                    <Button variant="outline" className="w-full">
                      Add to Schedule
                    </Button>
                  </div>
                </Card>

                <Card className="flex flex-col">
                  <CardHeader>
                    <CardTitle>Leg Day</CardTitle>
                    <CardDescription>Quads, Hamstrings, Calves</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="list-disc pl-5 space-y-1 text-sm">
                      <li>Squats: 4 sets × 8 reps</li>
                      <li>Romanian Deadlifts: 3 sets × 10 reps</li>
                      <li>Leg Press: 3 sets × 12 reps</li>
                      <li>Leg Extensions: 3 sets × 15 reps</li>
                      <li>Calf Raises: 4 sets × 15 reps</li>
                    </ul>
                  </CardContent>
                  <div className="p-4 pt-0 mt-auto">
                    <Button variant="outline" className="w-full">
                      Add to Schedule
                    </Button>
                  </div>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

