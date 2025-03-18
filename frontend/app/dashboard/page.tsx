import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { CalorieChart } from "@/components/dashboard/calorie-chart"
import { WeightChart } from "@/components/dashboard/weight-chart"
import { StrengthProgress } from "@/components/dashboard/strength-progress"
import { UpcomingWorkouts } from "@/components/dashboard/upcoming-workouts"

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, John! Here's an overview of your fitness journey.</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
          <TabsTrigger value="workouts">Workouts</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Current Weight</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">185 lbs</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-500">↓ 2.5 lbs</span> from last week
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Daily Calories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,100 / 2,400</div>
                <Progress value={87.5} className="h-2 mt-2" />
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Workouts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4 / 5</div>
                <p className="text-xs text-muted-foreground">Completed this week</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Strength Gain</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+5.2%</div>
                <p className="text-xs text-muted-foreground">Average across all exercises</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4">
              <CardHeader>
                <CardTitle>Weight Progress</CardTitle>
                <CardDescription>Your weight trend over the last 8 weeks</CardDescription>
              </CardHeader>
              <CardContent>
                <WeightChart />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Upcoming Workouts</CardTitle>
                <CardDescription>Your scheduled workouts for the next 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <UpcomingWorkouts />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Calorie Intake</CardTitle>
                <CardDescription>Your calorie consumption over the last 7 days</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <CalorieChart />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Macronutrient Goals</CardTitle>
                <CardDescription>Your daily macronutrient targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Protein</div>
                      <div className="text-sm text-muted-foreground">180g / 200g</div>
                    </div>
                    <Progress value={90} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Carbs</div>
                      <div className="text-sm text-muted-foreground">220g / 250g</div>
                    </div>
                    <Progress value={88} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="text-sm font-medium">Fats</div>
                      <div className="text-sm text-muted-foreground">65g / 80g</div>
                    </div>
                    <Progress value={81.25} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="workouts" className="space-y-4">
          <UpcomingWorkouts fullView={true} />
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
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
      </Tabs>
    </div>
  )
}

