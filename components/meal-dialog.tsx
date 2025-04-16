"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { CalendarClock, Clock, Pencil, Utensils } from "lucide-react"

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
import UploadComponent from "./upload-form"
import { useMutation, useQueryClient } from "react-query"
import { MealsService } from "@/services/meal-service"
import { apiRoutes } from "@/constants/api-routes"
import toast from "react-hot-toast"

interface MealDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreateMeal?: (meal: Meal) => void
  meal?: Meal
  mode: "add" | "edit"
}

const DEFAULT_FORM_STATE = {
  name: "",
  description: "",
  calories: "",
  type: "Breakfast" as MealType,
  date: new Date().toISOString().split("T")[0],
  time: new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }),
  image: "",
}

export default function MealDialog({ open, onOpenChange, onCreateMeal, meal, mode }: MealDialogProps) {
  const [formData, setFormData] = useState(DEFAULT_FORM_STATE)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [dateError, setDateError] = useState("")

  const queryClient = useQueryClient()

  const isEditMode = mode === "edit"

  // Initialize form data based on mode
  useEffect(() => {
    if (open) {
      if (isEditMode && meal) {
        setFormData({
          name: meal.name,
          description: meal.description,
          calories: meal.calories.toString(),
          type: meal.type,
          date: meal.date,
          time: meal.time,
          image: meal.image,
        })
      } else {
        setFormData(DEFAULT_FORM_STATE)
      }
      setDateError("")
    }
  }, [open, meal, isEditMode])

  const updateMeal = useMutation((updatedMeal: Meal) => MealsService.editMeal(updatedMeal), {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: apiRoutes.listMeals() })
    },
  })

  const handleInputChange = useCallback((field: keyof typeof DEFAULT_FORM_STATE, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (field === "date") {
      setDateError("")
    }
  }, [])

  const handleCaloriesChange = useCallback(
    (value: string) => {
      const numValue = Number(value)
      if (numValue < 0) return
      handleInputChange("calories", value)
    },
    [handleInputChange],
  )

  const resetForm = useCallback(() => {
    setFormData(DEFAULT_FORM_STATE)
    setDateError("")
  }, [])

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()

      if (isFutureDateTime(formData.date)) {
        setDateError("A data selecionado não pode estar no futuro.")
        return
      }

      if (isEditMode && meal) {
        // Edit existing meal
        const updatedMeal: Meal = {
          ...meal,
          name: formData.name,
          description: formData.description,
          calories: Number.parseInt(formData.calories),
          type: formData.type,
          date: formData.date,
          time: formData.time,
          image: formData.image || "/placeholder.svg?height=200&width=400",
        }

        updateMeal.mutate(updatedMeal)
        toast.success(`${formData.name} has been updated successfully.`, {
          duration: 3000,
          position: "bottom-center",
        })
      } else {
        // Create new meal
        const newMeal: Meal = {
          _id: uuidv4(),
          name: formData.name,
          description: formData.description,
          calories: Number.parseInt(formData.calories),
          type: formData.type,
          date: formData.date,
          time: formData.time,
          image: formData.image || "/placeholder.svg?height=200&width=400",
          isFavorite: false,
        }

        onCreateMeal?.(newMeal)
      }

      resetForm()
      onOpenChange(false)
    },
    [formData, onCreateMeal, onOpenChange, resetForm, isEditMode, meal, updateMeal],
  )

  const handleDialogClose = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        resetForm()
      }
      onOpenChange(isOpen)
    },
    [onOpenChange, resetForm],
  )

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[500px] rounded-xl p-0 overflow-hidden">
        <div className={`${isEditMode ? "bg-secondary/10" : "bg-primary/10"} p-6`}>
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center">
              {isEditMode ? (
                <>
                  <Pencil className="mr-2 h-5 w-5 text-secondary" />
                  Edit Meal
                </>
              ) : (
                <>
                  <Utensils className="mr-2 h-5 w-5 text-primary" />
                  Add New Meal
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Make changes to your meal. Click save when you're done."
                : "Enter the details of your meal. Click save when you're done."}
            </DialogDescription>
          </DialogHeader>
        </div>
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid gap-4 py-4">
            <FormField
              id="name"
              label="Name"
              required
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />

            <FormField
              id="description"
              label="Description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              component={
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="col-span-3"
                />
              }
            />

            <FormField
              id="calories"
              label="Calories"
              required
              type="number"
              value={formData.calories}
              onChange={(e) => handleCaloriesChange(e.target.value)}
            />

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="type" className="text-right">
                Type
              </Label>
              <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value as MealType)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select meal type" />
                </SelectTrigger>
                <SelectContent>
                  <MealTypeOption value="Breakfast" color="bg-orange-500" />
                  <MealTypeOption value="Lunch" color="bg-green-500" />
                  <MealTypeOption value="Snack" color="bg-purple-500" />
                  <MealTypeOption value="Dinner" color="bg-blue-500" />
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
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className="col-span-3"
                required
              />
              {dateError && <p className="text-red-500 text-sm col-span-4 col-start-2">{dateError}</p>}
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right flex items-center justify-end">
                <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                Time
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
                className="col-span-3"
                required
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Image
              </Label>
              <div className="col-span-3">
                <UploadComponent
                  setIsUploading={setIsUploading}
                  onUploadComplete={(url) => setFormData((prev) => ({ ...prev, image: url }))}
                />
                {formData.image && (
                  <img
                    src={formData.image || "/placeholder.svg"}
                    alt="Uploaded meal"
                    className="mt-2 h-24 rounded-md object-cover"
                  />
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => handleDialogClose(false)} className="rounded-full">
              Cancel
            </Button>
            <Button disabled={isUploading} type="submit" className="rounded-full">
              {isEditMode ? "Save Changes" : "Save Meal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface FormFieldProps {
  id: string
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  type?: string
  placeholder?: string
  component?: React.ReactNode
}

function FormField({
  id,
  label,
  value,
  onChange,
  required = false,
  type = "text",
  placeholder,
  component,
}: FormFieldProps) {
  return (
    <div className="grid grid-cols-4 items-center gap-4">
      <Label htmlFor={id} className="text-right">
        {label}
      </Label>
      {component || (
        <Input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          className="col-span-3"
          placeholder={placeholder}
          required={required}
        />
      )}
    </div>
  )
}

interface MealTypeOptionProps {
  value: string
  color: string
}

function MealTypeOption({ value, color }: MealTypeOptionProps) {
  return (
    <SelectItem value={value}>
      <div className="flex items-center">
        <div className={`w-3 h-3 rounded-full ${color} mr-2`}></div>
        {value}
      </div>
    </SelectItem>
  )
}
