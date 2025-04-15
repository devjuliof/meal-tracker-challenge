"use client"

import type React from "react"
import { useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { CalendarClock, Clock, Utensils } from "lucide-react"

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
import { isFutureDateTime } from "@/app/utils/date-utils"
import toast from "react-hot-toast"

interface AddMealDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateMeal: (meal: Meal) => void
}

export default function AddMealDialog({ open, onOpenChange, onCreateMeal }: AddMealDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [calories, setCalories] = useState("")
  const [type, setType] = useState<MealType>("Breakfast")
  const [date, setDate] = useState(new Date().toISOString().split("T")[0])
  const [time, setTime] = useState(
    new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  )
  const [image, setImage] = useState("")
  const [dateError, setDateError] = useState("")  // Estado para controle de erro

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const invalidDate = isFutureDateTime(date);
    if (invalidDate) {
      setDateError("A data selecionado não pode estar no futuro.")
      return; // Não envia o formulário se a data for inválida
    } else {
      setDateError("")  // Limpa o erro se a data for válida
    }

    const newMeal: Meal = {
      _id: uuidv4(),
      name,
      description,
      calories: Number.parseInt(calories),
      type,
      date,
      time,
      image: image || "/placeholder.svg?height=200&width=400",
      isFavorite: false,
    }

    onCreateMeal(newMeal)
    resetForm()
    onOpenChange(false)
  }

  const resetForm = () => {
    setName("")
    setDescription("")
    setCalories("")
    setType("Breakfast")
    setDate(new Date().toISOString().split("T")[0])
    setTime(
      new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    )
    setImage("")
    setDateError("") // Reseta o erro ao limpar o formulário
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-xl p-0 overflow-hidden">
        <div className="bg-primary/10 p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center">
              <Utensils className="mr-2 h-5 w-5 text-primary" />
              Add New Meal
            </DialogTitle>
            <DialogDescription>Enter the details of your meal. Click save when you're done.</DialogDescription>
          </DialogHeader>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="calories" className="text-right">
                Calories
              </Label>
              <Input
                id="calories"
                type="number"
                value={calories}
                onChange={(e) => {
                  if (Number(e.target.value) < 0) return;
                  setCalories(e.target.value)
                }}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
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
              <Label htmlFor="date" className="text-right flex items-center justify-end">
                <CalendarClock className="mr-2 h-4 w-4 text-muted-foreground" />
                Date
              </Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => {
                  setDate(e.target.value)
                }}
                className="col-span-3"
                required
              />
              {dateError && <p className="text-red-500 text-sm col-span-4">{dateError}</p>} {/* Exibe erro de data */}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right flex items-center justify-end">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image URL
              </Label>
              <Input
                id="image"
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
              Save Meal
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
