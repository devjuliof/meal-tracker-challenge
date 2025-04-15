"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { CalendarClock, Clock, Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Meal, MealType } from "@/lib/types"
import { useMutation, useQueryClient } from 'react-query';
import { MealsService } from "@/services/meal-service"
import { apiRoutes } from "@/constants/api-routes"
import toast from "react-hot-toast"

interface EditMealDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  meal: Meal
}

export default function EditMealDialog({ open, onOpenChange, meal }: EditMealDialogProps) {
  const [name, setName] = useState(meal.name)
  const [description, setDescription] = useState(meal.description)
  const [calories, setCalories] = useState(meal.calories.toString())
  const [type, setType] = useState<MealType>(meal.type)
  const [date, setDate] = useState(meal.date)
  const [time, setTime] = useState(meal.time)
  const [image, setImage] = useState(meal.image)

  const queryClient = useQueryClient();

  useEffect(() => {
    if (open) {
      setName(meal.name)
      setDescription(meal.description)
      setCalories(meal.calories.toString())
      setType(meal.type)
      setDate(meal.date)
      setTime(meal.time)
      setImage(meal.image)
    }
  }, [open, meal])

  const updateMeal = useMutation(
    (meal: Meal) => MealsService.editMeal(meal),
    {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: apiRoutes.listMeals() });
      }
    }
  )

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const updatedMeal: Meal = {
      ...meal,
      name,
      description,
      calories: Number.parseInt(calories),
      type,
      date,
      time,
      image: image || "/placeholder.svg?height=200&width=400",
    }

    updateMeal.mutate(updatedMeal);
    toast.success(`${name} has been updated successfully.`, {
      duration: 3000,
      position: 'bottom-center',
    });

    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-xl p-0 overflow-hidden">
        <div className="bg-secondary/10 p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center">
              <Pencil className="mr-2 h-5 w-5 text-secondary" />
              Edit Meal
            </DialogTitle>
            <DialogDescription>Make changes to your meal. Click save when you're done.</DialogDescription>
          </DialogHeader>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-description" className="text-right">
                Description
              </Label>
              <Textarea
                id="edit-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-calories" className="text-right">
                Calories
              </Label>
              <Input
                id="edit-calories"
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-type" className="text-right">
                Type
              </Label>
              <Select value={type} onValueChange={(value) => setType(value as MealType)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select meal type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Breakfast">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-orange-500 mr-2"></div>
                      Breakfast
                    </div>
                  </SelectItem>
                  <SelectItem value="Lunch">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                      Lunch
                    </div>
                  </SelectItem>
                  <SelectItem value="Snack">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
                      Snack
                    </div>
                  </SelectItem>
                  <SelectItem value="Dinner">
                    <div className="flex items-center">
                      <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                      Dinner
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-date" className="text-right flex items-center justify-end">
                <CalendarClock className="mr-2 h-4 w-4 text-muted-foreground" />
                Date
              </Label>
              <Input
                id="edit-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-time" className="text-right flex items-center justify-end">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                Time
              </Label>
              <Input
                id="edit-time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-image" className="text-right">
                Image URL
              </Label>
              <Input
                id="edit-image"
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="col-span-3"
                placeholder="https://example.com/image.jpg (optional)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="rounded-full">
              Cancel
            </Button>
            <Button type="submit" className="rounded-full">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
