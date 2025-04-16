"use client"

import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "react-query"

import DashboardHeader from "@/components/dashboard-header"
import DashboardMetrics from "@/components/dashboard/dashboard-metrics"
import MealsList from "@/components/dashboard/meals-list"
import AddMealDialog from "@/components/add-meal-dialog"
import { apiRoutes } from "@/constants/api-routes"
import { MealsService } from "@/services/meal-service"
import { DashboardService } from "@/services/dashboard-service"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import type { Meal } from "@/lib/types"

export default function DashboardPage() {
  const [isAddMealOpen, setIsAddMealOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data: meals, isLoading: mealsLoading } = useQuery(apiRoutes.listMeals(), async () => {
    const { data } = await MealsService.listMeals()
    return data
  })

  const { data: dashboardData, isLoading: dashboardLoading } = useQuery(apiRoutes.getDashboardData(), async () => {
    const data = await DashboardService.getDashboardData()
    return data
  })

  const invalidateQueries = () => {
    queryClient.invalidateQueries({ queryKey: apiRoutes.listMeals() })
    queryClient.invalidateQueries({ queryKey: apiRoutes.getDashboardData() })
  }

  const createMeal = useMutation((meal: Meal) => MealsService.createMeal(meal), {
    onSuccess: () => {
      invalidateQueries()
      setIsAddMealOpen(false)
    },
  })

  const deleteMeal = useMutation((mealId: string) => MealsService.deleteMeal(mealId), {
    onSuccess: () => invalidateQueries(),
  })

  const favoriteMeal = useMutation((mealId: string) => MealsService.favoriteMeal(mealId), {
    onSuccess: () => invalidateQueries(),
  })

  const calculateTodayCalories = () => {
    if (!meals) return 0
    const today = new Date().toISOString().split("T")[0]
    return meals.filter((meal) => meal.date.startsWith(today)).reduce((total, meal) => total + meal.calories, 0)
  }

  if (mealsLoading || dashboardLoading) {
    return <LoadingSpinner message="Carregando suas refeições..." />
  }

  return (
    <div className="flex min-h-screen flex-col bg-wellness-gradient">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">Bem-vindo ao Seu Painel</h1>
          <p className="text-muted-foreground">Acompanhe suas refeições e monitore seus objetivos nutricionais.</p>
        </div>

        <DashboardMetrics meals={meals!} dashboardData={dashboardData} todayCalories={calculateTodayCalories()} />

        <MealsList
          meals={meals!}
          onAddMeal={() => setIsAddMealOpen(true)}
          onDeleteMeal={(id) => deleteMeal.mutate(id)}
          onToggleFavorite={(id) => favoriteMeal.mutate(id)}
        />
      </main>

      <AddMealDialog
        open={isAddMealOpen}
        onOpenChange={setIsAddMealOpen}
        onCreateMeal={(meal) => createMeal.mutate(meal)}
      />
    </div>
  )
}
