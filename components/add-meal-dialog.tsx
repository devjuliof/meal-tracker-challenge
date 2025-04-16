"use client"

import type { Meal } from "@/lib/types"
import MealDialog from "./meal-dialog"

interface AddMealDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateMeal: (meal: Meal) => void
}

export default function AddMealDialog({ open, onOpenChange, onCreateMeal }: AddMealDialogProps) {
  return <MealDialog mode="add" open={open} onOpenChange={onOpenChange} onCreateMeal={onCreateMeal} />
}
