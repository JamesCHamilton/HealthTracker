import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { CalorieChart } from "@/components/dashboard/calorie-chart"

export default function NutritionPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">Nutrition</h1>
          <p className="text-muted-foreground">Track your nutrition and manage your diet</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Log Meal
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Daily Calories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2,100 / 2,400</div>
            <Progress value={87.5} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">300 calories remaining</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Protein</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">180g / 200g</div>
            <Progress value={90} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">20g remaining</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Water Intake</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.5L / 3.0L</div>
            <Progress value={83.3} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">0.5L remaining</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="macros">Macros</TabsTrigger>
          <TabsTrigger value="meals">Meal Log</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>Calorie Intake</CardTitle>
              <CardDescription>Your calorie consumption over the last 7 days</CardDescription>
            </CardHeader>
            <CardContent>
              <CalorieChart />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="macros">
          <Card>
            <CardHeader>
              <CardTitle>Macronutrient Breakdown</CardTitle>
              <CardDescription>Your daily macronutrient targets and consumption</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Protein</div>
                      <div className="text-sm text-muted-foreground">180g / 200g</div>
                    </div>
                    <Progress value={90} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      Protein is essential for muscle repair and growth. Aim for 1g per pound of body weight.
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Carbohydrates</div>
                      <div className="text-sm text-muted-foreground">220g / 250g</div>
                    </div>
                    <Progress value={88} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      Carbs are your body's primary energy source. Focus on complex carbs for sustained energy.
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">Fats</div>
                      <div className="text-sm text-muted-foreground">65g / 80g</div>
                    </div>
                    <Progress value={81.25} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      Healthy fats support hormone production and nutrient absorption. Prioritize unsaturated fats.
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="font-medium mb-4">Macronutrient Distribution</h3>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="space-y-2">
                      <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
                        <div className="bg-blue-500 h-full" style={{ width: "33%" }}></div>
                      </div>
                      <div className="text-sm font-medium">33% Protein</div>
                      <div className="text-xs text-muted-foreground">720 calories</div>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
                        <div className="bg-green-500 h-full" style={{ width: "42%" }}></div>
                      </div>
                      <div className="text-sm font-medium">42% Carbs</div>
                      <div className="text-xs text-muted-foreground">880 calories</div>
                    </div>
                    <div className="space-y-2">
                      <div className="w-full h-4 bg-muted rounded-full overflow-hidden">
                        <div className="bg-yellow-500 h-full" style={{ width: "25%" }}></div>
                      </div>
                      <div className="text-sm font-medium">25% Fats</div>
                      <div className="text-xs text-muted-foreground">585 calories</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="meals">
          <Card>
            <CardHeader>
              <CardTitle>Today's Meals</CardTitle>
              <CardDescription>Your food intake for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  {
                    meal: "Breakfast",
                    time: "7:30 AM",
                    calories: 550,
                    items: [
                      { name: "Oatmeal with berries", calories: 320, protein: 12, carbs: 54, fats: 6 },
                      { name: "Greek yogurt", calories: 150, protein: 15, carbs: 8, fats: 5 },
                      { name: "Black coffee", calories: 5, protein: 0, carbs: 1, fats: 0 },
                      { name: "Protein shake", calories: 120, protein: 25, carbs: 3, fats: 1 },
                    ],
                  },
                  {
                    meal: "Lunch",
                    time: "12:30 PM",
                    calories: 750,
                    items: [
                      { name: "Grilled chicken breast", calories: 280, protein: 52, carbs: 0, fats: 6 },
                      { name: "Brown rice", calories: 220, protein: 5, carbs: 46, fats: 2 },
                      { name: "Steamed broccoli", calories: 55, protein: 4, carbs: 11, fats: 0 },
                      { name: "Olive oil (1 tbsp)", calories: 120, protein: 0, carbs: 0, fats: 14 },
                      { name: "Apple", calories: 95, protein: 0, carbs: 25, fats: 0 },
                    ],
                  },
                  {
                    meal: "Snack",
                    time: "3:30 PM",
                    calories: 250,
                    items: [
                      { name: "Protein bar", calories: 210, protein: 20, carbs: 25, fats: 5 },
                      { name: "Green tea", calories: 0, protein: 0, carbs: 0, fats: 0 },
                    ],
                  },
                  {
                    meal: "Dinner",
                    time: "7:00 PM",
                    calories: 650,
                    items: [
                      { name: "Salmon fillet", calories: 350, protein: 40, carbs: 0, fats: 20 },
                      { name: "Sweet potato", calories: 180, protein: 4, carbs: 41, fats: 0 },
                      { name: "Mixed vegetables", calories: 70, protein: 3, carbs: 15, fats: 0 },
                      { name: "Quinoa", calories: 120, protein: 4, carbs: 21, fats: 2 },
                    ],
                  },
                ].map((meal) => (
                  <div key={meal.meal} className="border rounded-md overflow-hidden">
                    <div className="bg-muted/50 p-4 flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{meal.meal}</h3>
                        <p className="text-sm text-muted-foreground">{meal.time}</p>
                      </div>
                      <div className="text-sm font-medium">{meal.calories} calories</div>
                    </div>
                    <div className="p-4">
                      <div className="space-y-2">
                        {meal.items.map((item) => (
                          <div key={item.name} className="flex justify-between items-center text-sm">
                            <div>{item.name}</div>
                            <div className="text-muted-foreground">
                              {item.calories} cal | P: {item.protein}g | C: {item.carbs}g | F: {item.fats}g
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

