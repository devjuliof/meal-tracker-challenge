"use client"

import { useState, useEffect, useCallback } from "react"
import { Activity, Flame, Info } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ActivityLevelEnum, GenderEnum } from "@/lib/models/User"

interface CalorieGoalStepProps {
  formData: any
  updateFormData: (data: any) => void
  onNext?: () => void
}

export default function CalorieGoalStep({ formData, updateFormData, onNext }: CalorieGoalStepProps) {
  const [goalType, setGoalType] = useState(formData.goalType || "recommended")
  const [activityLevel, setActivityLevel] = useState<ActivityLevelEnum>(ActivityLevelEnum.MODERATE)
  const [customCalories, setCustomCalories] = useState(formData.dailyCalorieGoal?.toString() || "2000")
  const [recommendedCalories, setRecommendedCalories] = useState(2000)
  const [gender, setGender] = useState<GenderEnum>(GenderEnum.FEMALE)
  const [age, setAge] = useState(formData.age || 30)
  const [weight, setWeight] = useState(formData.weight || 70)
  const [height, setHeight] = useState(formData.height || 170)

  useEffect(() => {
    let bmr = 0
    if (gender === GenderEnum.MALE) {
      bmr = 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
    } else {
      bmr = 447.593 + 9.247 * weight + 3.098 * height - 4.33 * age
    }

    let tdee = 0
    switch (activityLevel) {
      case ActivityLevelEnum.SEDENTARY:
        tdee = bmr * 1.2
        break
      case ActivityLevelEnum.LIGHT:
        tdee = bmr * 1.375
        break
      case ActivityLevelEnum.MODERATE:
        tdee = bmr * 1.55
        break
      case ActivityLevelEnum.ACTIVE:
        tdee = bmr * 1.725
        break
      case ActivityLevelEnum.VERY_ACTIVE:
        tdee = bmr * 1.9
        break
      default:
        tdee = bmr * 1.55
    }

    setRecommendedCalories(Math.round(tdee))
  }, [gender, age, weight, height, activityLevel])

  const updateParentFormData = useCallback(() => {
    const calorieGoal = goalType === "custom" ? Number.parseInt(customCalories) : recommendedCalories
    updateFormData({
      goalType,
      activityLevel,
      dailyCalorieGoal: calorieGoal,
      gender,
      age,
      weight,
      height,
    })
  }, [goalType, activityLevel, customCalories, recommendedCalories, gender, age, weight, height, updateFormData])

  useEffect(() => {
    updateParentFormData()
  }, [updateParentFormData])

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold">Defina sua Meta Calórica Diária</h2>
        <p className="text-gray-600">Isso nos ajudará a personalizar sua experiência e acompanhar seu progresso.</p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="gender" className="text-sm font-medium">
            Gênero
          </Label>
          <div className="flex space-x-4">
            <Label
              htmlFor="gender-female"
              className={`cursor-pointer rounded-full px-3 py-1 text-sm ${gender === GenderEnum.FEMALE ? "bg-primary text-white" : "bg-gray-100"
                }`}
            >
              <input
                type="radio"
                id="gender-female"
                name="gender"
                className="sr-only"
                checked={gender === GenderEnum.FEMALE}
                onChange={() => setGender(GenderEnum.FEMALE)}
              />
              Feminino
            </Label>
            <Label
              htmlFor="gender-male"
              className={`cursor-pointer rounded-full px-3 py-1 text-sm ${gender === GenderEnum.MALE ? "bg-primary text-white" : "bg-gray-100"
                }`}
            >
              <input
                type="radio"
                id="gender-male"
                name="gender"
                className="sr-only"
                checked={gender === GenderEnum.MALE}
                onChange={() => setGender(GenderEnum.MALE)}
              />
              Masculino
            </Label>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label htmlFor="age" className="text-sm font-medium">
              Idade
            </Label>
            <Input
              id="age"
              type="number"
              min="18"
              max="100"
              value={age}
              onChange={(e) => setAge(Number.parseInt(e.target.value))}
              className="chakra-input"
            />
          </div>
          <div>
            <Label htmlFor="weight" className="text-sm font-medium">
              Peso (kg)
            </Label>
            <Input
              id="weight"
              type="number"
              min="40"
              max="200"
              value={weight}
              onChange={(e) => setWeight(Number.parseInt(e.target.value))}
              className="chakra-input"
            />
          </div>
          <div>
            <Label htmlFor="height" className="text-sm font-medium">
              Altura (cm)
            </Label>
            <Input
              id="height"
              type="number"
              min="140"
              max="220"
              value={height}
              onChange={(e) => setHeight(Number.parseInt(e.target.value))}
              className="chakra-input"
            />
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <Label htmlFor="activity-level" className="text-sm font-medium">
              Nível de Atividade
            </Label>

            <TooltipProvider>
              <Tooltip>
                <TooltipContent>
                  <p className="max-w-xs text-xs">
                    Sedentário: pouco ou nenhum exercício
                    <br />
                    Leve: exercício leve 1-3 dias/semana
                    <br />
                    Moderado: exercício moderado 3-5 dias/semana
                    <br />
                    Ativo: exercício intenso 6-7 dias/semana
                    <br />
                    Muito ativo: exercício muito intenso diariamente
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex flex-wrap justify-between gap-2">
            {[
              { value: ActivityLevelEnum.SEDENTARY, label: "Sedentário" },
              { value: ActivityLevelEnum.LIGHT, label: "Leve" },
              { value: ActivityLevelEnum.MODERATE, label: "Moderado" },
              { value: ActivityLevelEnum.ACTIVE, label: "Ativo" },
              { value: ActivityLevelEnum.VERY_ACTIVE, label: "Muito Ativo" },
            ].map((level) => (
              <div key={level.value} className="flex flex-col items-center">
                <input
                  type="radio"
                  id={level.value}
                  name="activityLevel"
                  className="sr-only"
                  checked={activityLevel === level.value}
                  onChange={() => setActivityLevel(level.value)}
                />
                <Label
                  htmlFor={level.value}
                  className={`cursor-pointer rounded-lg p-2 text-center text-xs ${activityLevel === level.value ? "bg-primary/10 text-primary" : "bg-gray-100"
                    }`}
                >
                  <Activity className="mb-1 h-4 w-4" />
                  {level.label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4 rounded-lg bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Flame className="mr-2 h-5 w-5 text-primary" />
              <Label className="text-sm font-medium">Meta Calórica Diária</Label>
            </div>
            <div className="text-sm font-bold text-primary">
              {goalType === "custom" ? customCalories : recommendedCalories} kcal
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="recommended"
                name="goalType"
                checked={goalType === "recommended"}
                onChange={() => setGoalType("recommended")}
                className="h-4 w-4 rounded-full border border-primary text-primary"
              />
              <Label htmlFor="recommended" className="text-sm">
                Recomendado ({recommendedCalories} kcal)
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="custom"
                name="goalType"
                checked={goalType === "custom"}
                onChange={() => setGoalType("custom")}
                className="h-4 w-4 rounded-full border border-primary text-primary"
              />
              <Label htmlFor="custom" className="text-sm">
                Personalizado
              </Label>
            </div>
          </div>

          {goalType === "custom" && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">1200 kcal</span>
                <span className="text-xs text-gray-500">4000 kcal</span>
              </div>
              <Slider
                value={[Number.parseInt(customCalories) || 2000]}
                min={1200}
                max={4000}
                step={50}
                onValueChange={(value) => setCustomCalories(value[0].toString())}
              />
              <div className="flex items-center">
                <Input
                  type="number"
                  min="1200"
                  max="4000"
                  value={customCalories}
                  onChange={(e) => setCustomCalories(e.target.value)}
                  className="chakra-input w-24"
                />
                <span className="ml-2 text-sm text-gray-500">kcal</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
