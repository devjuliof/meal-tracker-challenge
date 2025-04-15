"use client"

import { useState } from "react"
import Image from "next/image"
import { Clock, Heart, MoreHorizontal, Pencil, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import type { Meal } from "@/lib/types"
import EditMealDialog from "./edit-meal-dialog"

interface MealCardProps {
  meal: Meal
  onDelete: (id: string) => void
  onToggleFavorite: (id: string) => void
}

export default function MealCard({ meal, onDelete, onToggleFavorite }: MealCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      month: "short",
      day: "numeric",
      year: "numeric",
    })
  }

  const formatTime = (timeString: string) => {
    const time = new Date(`2000-01-01T${timeString}`)
    return time.toLocaleTimeString("pt-BR", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getMealTypeClass = () => {
    switch (meal.type.toLowerCase()) {
      case "breakfast":
        return "bg-meal-card-breakfast"
      case "lunch":
        return "bg-meal-card-lunch"
      case "snack":
        return "bg-meal-card-snack"
      case "dinner":
        return "bg-meal-card-dinner"
      default:
        return ""
    }
  }

  const getMealTypeColor = () => {
    switch (meal.type.toLowerCase()) {
      case "breakfast":
        return "text-orange-500 bg-orange-100"
      case "lunch":
        return "text-green-500 bg-green-100"
      case "snack":
        return "text-purple-500 bg-purple-100"
      case "dinner":
        return "text-blue-500 bg-blue-100"
      default:
        return "text-gray-500 bg-gray-100"
    }
  }

  return (
    <>
      <Card className={`overflow-hidden border-none shadow-md transition-all hover:shadow-lg ${getMealTypeClass()}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <Badge variant="outline" className={`mb-2 ${getMealTypeColor()}`}>
                {meal.type}
              </Badge>
              <CardTitle>{meal.name}</CardTitle>
              <CardDescription className="flex items-center mt-1">
                <Clock className="h-3 w-3 mr-1" />
                {formatTime(meal.time)} • {formatDate(meal.date)}
              </CardDescription>
            </div>
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-background/80"
                onClick={() => onToggleFavorite(meal._id)}
              >
                <Heart className={`h-4 w-4 ${meal.isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                <span className="sr-only">Favorite</span>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-background/80">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">More</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)} className="text-red-600">
                    <Trash className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {meal.image && (
            <div className="relative h-32 w-full mb-3 rounded-md overflow-hidden">
              <Image src={meal.image || "/placeholder.svg"} alt={meal.name} fill className="object-cover" />
            </div>
          )}
          <p className="text-sm text-muted-foreground">{meal.description}</p>
        </CardContent>
        <CardFooter className="flex justify-between pt-2 border-t">
          <div className="text-sm text-muted-foreground">{formatDate(meal.date)}</div>
          <div className="font-medium px-2 py-1 rounded-full bg-primary/10 text-primary text-xs">
            {meal.calories} kcal
          </div>
        </CardFooter>
      </Card>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>This will permanently delete this meal from your records.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-full">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => onDelete(meal._id)} className="bg-red-600 hover:bg-red-700 rounded-full">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <EditMealDialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen} meal={meal} />
    </>
  )
}
