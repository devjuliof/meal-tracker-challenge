import { CalendarClock, LineChart, Utensils } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Meal } from "@/lib/types"

interface DashboardMetricsProps {
  meals: Meal[]
  dashboardData: any
  todayCalories: number
}

export default function DashboardMetrics({ meals, dashboardData, todayCalories }: DashboardMetricsProps) {
  const calorieProgress = Math.min(Math.round((todayCalories / dashboardData.dailyCalorieGoal) * 100), 100)

  const breakfastCount = meals?.filter((m) => m.type === "Breakfast").length || 0
  const lunchCount = meals?.filter((m) => m.type === "Lunch").length || 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="overflow-hidden border-none shadow-md">
        <CardHeader className="pb-2 bg-primary/5">
          <CardTitle className="text-sm font-medium flex items-center">
            <Utensils className="h-4 w-4 mr-2 text-primary" />
            Calorias de Hoje
          </CardTitle>
          <CardDescription>Progresso do consumo diário</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="flex justify-between items-center mb-2">
            <div className="text-2xl font-bold">{todayCalories} kcal</div>
            <div className="text-sm text-muted-foreground">Meta: {dashboardData.dailyCalorieGoal} kcal</div>
          </div>
          <Progress value={calorieProgress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">
            {todayCalories > dashboardData.dailyCalorieGoal
              ? `Ops! Você ultrapassou seu objetivo diário. Tente equilibrar nas próximas refeições 🧘‍♂️`
              : `${calorieProgress}% do seu objetivo diário`}
          </p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-none shadow-md">
        <CardHeader className="pb-2 bg-secondary/5">
          <CardTitle className="text-sm font-medium flex items-center">
            <CalendarClock className="h-4 w-4 mr-2 text-secondary" />
            Total de Refeições
          </CardTitle>
          <CardDescription>Todas as refeições registradas</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-2xl font-bold">{dashboardData.totalMeals}</div>
          {meals && (
            <div className="flex items-center gap-2 mt-2">
              <div className="text-xs px-2 py-1 rounded-full bg-secondary/10 text-secondary">
                {breakfastCount} Café da manhã
              </div>
              <div className="text-xs px-2 py-1 rounded-full bg-secondary/10 text-secondary">{lunchCount} Almoço</div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-none shadow-md">
        <CardHeader className="pb-2 bg-accent/5">
          <CardTitle className="text-sm font-medium flex items-center">
            <LineChart className="h-4 w-4 mr-2 text-accent" />
            Refeições Favoritas
          </CardTitle>
          <CardDescription>Suas refeições favoritas salvas</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-2xl font-bold">{dashboardData.totalFavoriteMeals}</div>
          <p className="text-xs text-muted-foreground mt-2">
            {dashboardData.favoriteMeals
              ? "Quick access to your favorite meals"
              : "Mark meals as favorites for quick access"}
          </p>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-none shadow-md">
        <CardHeader className="pb-2 bg-primary/5">
          <CardTitle className="text-sm font-medium flex items-center">
            <CalendarClock className="h-4 w-4 mr-2 text-primary" />
            Sua sequência de conquistas
          </CardTitle>
          <CardDescription>Dias com refeições registradas</CardDescription>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="text-2xl font-bold">{dashboardData.streak}</div>
          <div className="flex mt-2">
            {[...Array(7)].map((_, index) => {
              const isActive = index < dashboardData.streak
              return (
                <div
                  key={index}
                  className={`w-5 h-5 rounded-full flex items-center justify-center -ml-1 first:ml-0 border-2 border-white ${isActive ? "bg-primary" : "bg-muted"
                    }`}
                >
                  <CalendarClock
                    className={`h-3 w-3 ${isActive ? "text-primary-foreground" : "text-muted-foreground"}`}
                  />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
