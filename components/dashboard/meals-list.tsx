"use client"

import { useState, useEffect } from "react"
import { CalendarClock, Filter, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import MealCard from "@/components/meal-card"
import type { Meal } from "@/lib/types"

interface MealsListProps {
  meals: Meal[]
  onAddMeal: () => void
  onDeleteMeal: (id: string) => void
  onToggleFavorite: (id: string) => void
}

export default function MealsList({ meals, onAddMeal, onDeleteMeal, onToggleFavorite }: MealsListProps) {
  const [activeTab, setActiveTab] = useState<string>("all")
  const [filteredMeals, setFilteredMeals] = useState<Meal[]>([])

  useEffect(() => {
    if (!meals) return

    if (activeTab === "all") {
      setFilteredMeals(meals)
    } else if (activeTab === "favorites") {
      setFilteredMeals(meals.filter((meal) => meal.isFavorite === true))
    } else {
      setFilteredMeals(meals.filter((meal) => meal.type.toLowerCase() === activeTab))
    }
  }, [activeTab, meals])


  return (
    <div className="mt-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Suas Refeições</h2>
        <Button onClick={onAddMeal} className="rounded-full">
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
            <TabsTrigger value="favorites" className="rounded-full">
              Favoritas
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-4">
          {filteredMeals.length === 0 ? (
            <EmptyMealState activeTab={activeTab} onAddMeal={onAddMeal} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredMeals.map((meal) => (
                <MealCard
                  key={meal._id}
                  meal={meal}
                  onDelete={() => onDeleteMeal(meal._id)}
                  onToggleFavorite={() => onToggleFavorite(meal._id)}
                />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface EmptyMealStateProps {
  activeTab: string
  onAddMeal: () => void
}

function EmptyMealState({ activeTab, onAddMeal }: EmptyMealStateProps) {
  const tabLabels: Record<string, string> = {
    all: "todas as categorias",
    breakfast: "café da manhã",
    lunch: "almoço",
    snack: "lanche",
    dinner: "janta",
  }

  const translatedTab = tabLabels[activeTab] || activeTab

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center bg-background/50 backdrop-blur-sm">
      <div className="rounded-full bg-primary/10 p-3 mb-4">
        <CalendarClock className="h-10 w-10 text-primary" />
      </div>
      <h3 className="text-lg font-semibold">Nenhuma refeição encontrada</h3>
      <p className="mt-2 text-sm text-muted-foreground max-w-md">
        {activeTab === "all"
          ? "Você ainda não adicionou nenhuma refeição. Clique no botão 'Adicionar Refeição' para começar."
          : `Você não tem nenhuma refeição de ${translatedTab}. Adicione uma para vê-la aqui.`}
      </p>
      <Button onClick={onAddMeal} className="mt-4 rounded-full">
        <Plus className="mr-2 h-4 w-4" /> Adicionar Refeição
      </Button>
    </div>
  )
}