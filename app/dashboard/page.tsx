"use client"

import { useEffect, useState } from "react"
import { CalendarClock, Filter, LineChart, Plus, Utensils } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DashboardHeader from "@/components/dashboard-header"
import MealCard from "@/components/meal-card"
import AddMealDialog from "@/components/add-meal-dialog"
import type { Meal } from "@/lib/types"
import { MealsService } from "@/services/meal-service"
import { Progress } from "@/components/ui/progress"
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { apiRoutes } from "../../constants/api-routes"
import { DashboardService } from "@/services/dashboard-service"

export default function DashboardPage() {
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>([])
  const [activeTab, setActiveTab] = useState<string>("all")
  const [isAddMealOpen, setIsAddMealOpen] = useState(false)

  const queryClient = useQueryClient();

  const { data: meals, isLoading } = useQuery(
    apiRoutes.listMeals(),
    async () => {
      const { data } = await MealsService.listMeals();
      return data;
    }
  )

  const { data: dashboardData, isLoading: dashboardIsLoading } = useQuery(
    apiRoutes.getDashboardData(),
    async () => {
      const data = await DashboardService.getDashboardData();
      return data;
    }
  )

  useEffect(() => {
    if (!meals) return;
    if (activeTab === "all") {
      setFilteredMeals(meals)
    } else {
      setFilteredMeals(meals.filter((meal) => meal.type.toLowerCase() === activeTab))
    }
  }, [activeTab, meals])

  const handleCreateMeal = (meal: Meal) => {
    createMeal.mutate(meal);
  }

  const createMeal = useMutation(
    (meal: Meal) => MealsService.createMeal(meal),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: apiRoutes.listMeals() });
        queryClient.invalidateQueries({ queryKey: apiRoutes.getDashboardData() });
      },
    }
  )

  const deleteMeal = useMutation(
    (mealId: string) => MealsService.deleteMeal(mealId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: apiRoutes.listMeals() });
        queryClient.invalidateQueries({ queryKey: apiRoutes.getDashboardData() });
      },
    }
  );

  const favoriteMeal = useMutation(
    (mealId: string) => MealsService.favoriteMeal(mealId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: apiRoutes.listMeals() });
        queryClient.invalidateQueries({ queryKey: apiRoutes.getDashboardData() });
      }
    }
  )

  const handleDeleteMeal = (id: string) => {
    deleteMeal.mutate(id)
  }

  const handleToggleFavorite = async (id: string) => {
    favoriteMeal.mutate(id)
  }

  const calculateTodayCalories = () => {
    if (!meals) return 0;
    const today = new Date().toISOString().split("T")[0]
    return meals.filter((meal) => meal.date.startsWith(today)).reduce((total, meal) => total + meal.calories, 0)
  }

  let calorieProgress;
  if (dashboardData) {
    calorieProgress = Math.min(Math.round((calculateTodayCalories() / dashboardData.dailyCalorieGoal) * 100), 100)
  }


  if (isLoading || dashboardIsLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Carregando suas refeições...</p>
        </div>
      </div>
    )
  }

  console.log(dashboardData)

  return (
    <div className="flex min-h-screen flex-col bg-wellness-gradient">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Bem-vindo ao Seu Painel</h1>
          <p className="text-muted-foreground">Acompanhe suas refeições e monitore seus objetivos nutricionais.</p>
        </div>

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
                <div className="text-2xl font-bold">{calculateTodayCalories()} kcal</div>
                <div className="text-sm text-muted-foreground">Meta: {dashboardData.dailyCalorieGoal} kcal</div>
              </div>
              <Progress value={calorieProgress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-2">{calorieProgress && calculateTodayCalories() > dashboardData.dailyCalorieGoal ? `Ops! Você ultrapassou seu objetivo diário. Tente equilibrar nas próximas refeições 🧘‍♂️` : `${calorieProgress}% do seu objetivo diário`}</p>
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
                    {meals.filter((m) => m.type === "Breakfast").length} Café da manhã
                  </div>
                  <div className="text-xs px-2 py-1 rounded-full bg-secondary/10 text-secondary">
                    {meals.filter((m) => m.type === "Lunch").length} Almoço
                  </div>
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
                  const isActive = index < dashboardData.streak;

                  return (
                    <div
                      key={index}
                      className={`w-5 h-5 rounded-full flex items-center justify-center -ml-1 first:ml-0 border-2 border-white dark:border-gray-900 ${isActive ? 'bg-primary' : 'bg-muted'
                        }`}
                    >
                      <CalendarClock
                        className={`h-3 w-3 ${isActive ? 'text-primary-foreground' : 'text-muted-foreground'
                          }`}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">Suas Refeições</h2>
            <Button onClick={() => setIsAddMealOpen(true)} className="rounded-full">
              <Plus className="mr-2 h-4 w-4" /> Adicionar Refeição
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <div className="flex items-center">
              <Filter className="mr-2 h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium text-muted-foreground mr-4">Filtrar:</span>
              <TabsList className="rounded-full">
                <TabsTrigger value="all" className="rounded-full">
                  Todas
                </TabsTrigger>
                <TabsTrigger value="breakfast" className="rounded-full">
                  Café da manhã
                </TabsTrigger>
                <TabsTrigger value="lunch" className="rounded-full">
                  Almoço
                </TabsTrigger>
                <TabsTrigger value="snack" className="rounded-full">
                  Lanche
                </TabsTrigger>
                <TabsTrigger value="dinner" className="rounded-full">
                  Janta
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="mt-4">
              {filteredMeals.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center bg-background/50 backdrop-blur-sm">
                  <div className="rounded-full bg-primary/10 p-3 mb-4">
                    <CalendarClock className="h-10 w-10 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">Nenhuma refeição encontrada</h3>
                  <p className="mt-2 text-sm text-muted-foreground max-w-md">
                    {activeTab === "all"
                      ? "You haven't added any meals yet. Click the 'Add Meal' button to get started."
                      : `You don't have any ${activeTab} meals. Add one to see it here.`}
                  </p>
                  <Button onClick={() => setIsAddMealOpen(true)} className="mt-4 rounded-full">
                    <Plus className="mr-2 h-4 w-4" /> Adicionar Refeição
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredMeals.map((meal) => (
                    <MealCard
                      key={meal._id}
                      meal={meal}
                      onDelete={() => handleDeleteMeal(meal._id)}
                      onToggleFavorite={() => handleToggleFavorite(meal._id)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <AddMealDialog open={isAddMealOpen} onOpenChange={setIsAddMealOpen} onCreateMeal={handleCreateMeal} />
    </div>
  )
}
