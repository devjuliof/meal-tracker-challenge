"use client"

import type { Meal } from "@/lib/types"
import MealDialog from "./meal-dialog"

interface EditMealDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  meal: Meal
}

export default function EditMealDialog({ open, onOpenChange, meal }: EditMealDialogProps) {
  return <MealDialog mode="edit" open={open} onOpenChange={onOpenChange} meal={meal} />
}
