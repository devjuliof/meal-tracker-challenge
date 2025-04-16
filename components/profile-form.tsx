"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { Loader2, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { UsersService } from "@/services/user.service"
import { ActivityLevelEnum, type UserType } from "@/lib/models/User"
import { apiRoutes } from "@/constants/api-routes"
import { useQueryClient, useQuery, useMutation } from "react-query"

type ActivityLevel = (typeof ActivityLevelEnum)[keyof typeof ActivityLevelEnum]

interface ProfileFormData {
  name: string
  email?: string
  dailyCalorieGoal?: string
  age?: string
  weight?: string
  height?: string
  activityLevel?: ActivityLevel
}

interface FormErrors {
  name?: string
  dailyCalorieGoal?: string
  age?: string
  weight?: string
  height?: string
  activityLevel?: string
}

export function ProfileForm() {
  const queryClient = useQueryClient()
  const [formData, setFormData] = useState<ProfileFormData>({ name: "" })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isDirty, setIsDirty] = useState(false)
  const [originalData, setOriginalData] = useState<ProfileFormData>({ name: "" })

  const { data: userData, isLoading: userDataIsLoading } = useQuery({
    queryKey: [apiRoutes.getUserData()],
    queryFn: async () => {
      const data = await UsersService.getUserData()
      return data
    },
    staleTime: 5 * 60 * 1000,
    onSuccess: (data) => {
      if (data) {
        const formattedData = {
          name: data.name || "",
          email: data.email || "",
          dailyCalorieGoal: data.dailyCalorieGoal?.toString() || "",
          age: data.age?.toString() || "",
          weight: data.weight?.toString() || "",
          height: data.height?.toString() || "",
          activityLevel: data.activityLevel,
        }
        setFormData(formattedData)
        setOriginalData(formattedData)
      }
    },
  })

  useEffect(() => {
    if (userData) {
      const formattedData = {
        name: userData.name || "",
        email: userData.email || "",
        dailyCalorieGoal: userData.dailyCalorieGoal?.toString() || "",
        age: userData.age?.toString() || "",
        weight: userData.weight?.toString() || "",
        height: userData.height?.toString() || "",
        activityLevel: userData.activityLevel,
      }
      setFormData(formattedData)
      setOriginalData(formattedData)
    }
  }, [userData])

  useEffect(() => {
    const hasChanges = Object.keys(formData).some((key) => {
      const k = key as keyof ProfileFormData
      return formData[k] !== originalData[k]
    })

    setIsDirty(hasChanges)
  }, [formData, originalData])

  const updateUserMutation = useMutation({
    mutationFn: (userData: Partial<UserType>) => UsersService.updateUser(userData),
    onSuccess: (data) => {
      if (data.success) {
        toast.success("Perfil atualizado com sucesso!")
        setIsDirty(false)
        setOriginalData({ ...formData })
        queryClient.invalidateQueries({ queryKey: [apiRoutes.getUserData()] })
      } else {
        toast.error(data.message || "Falha ao atualizar o perfil")
      }
    },
    onError: (error) => {
      toast.error("Falha ao atualizar o perfil")
    },
  })

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const resetForm = () => {
    setFormData({ ...originalData })
    setErrors({})
    setIsDirty(false)
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name?.trim()) {
      newErrors.name = "Nome é obrigatório"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Nome deve ter pelo menos 2 caracteres"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const userData: Partial<UserType> = {
      name: formData.name,
      dailyCalorieGoal: formData.dailyCalorieGoal ? Number(formData.dailyCalorieGoal) : undefined,
      age: formData.age ? Number(formData.age) : undefined,
      weight: formData.weight ? Number(formData.weight) : undefined,
      height: formData.height ? Number(formData.height) : undefined,
      activityLevel: formData.activityLevel,
    }

    updateUserMutation.mutate(userData, {
      onSuccess: () => {
        queryClient.invalidateQueries([apiRoutes.getUserData()])
      },
    })
  }

  if (userDataIsLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span>Carregando dados do perfil...</span>
        <p className="text-sm text-muted-foreground">Aguarde enquanto buscamos suas informações</p>
      </div>
    )
  }

  if (!userData) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Não foi possível carregar os dados do perfil.</p>
        <Button onClick={() => queryClient.invalidateQueries({ queryKey: [apiRoutes.getUserData()] })} className="mt-4">
          Tentar novamente
        </Button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-8">
        <div className="space-y-8">
          <Card className="border border-green-100 bg-white/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-semibold tracking-tight text-green-800">Informações Pessoais</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pb-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Seu nome completo"
                    className={`border-green-100 focus-visible:ring-green-500 ${errors.name ? "border-red-500" : ""}`}
                  />
                  {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="age">Idade</Label>
                  <Input
                    id="age"
                    type="number"
                    value={formData.age || ""}
                    onChange={(e) => handleInputChange("age", e.target.value)}
                    placeholder="Sua idade"
                    className={`border-green-100 focus-visible:ring-green-500 ${errors.age ? "border-red-500" : ""}`}
                  />
                  {errors.age && <p className="text-red-500 text-sm">{errors.age}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex h-10 w-full rounded-md border border-green-100 bg-background px-3 py-2 text-sm text-muted-foreground">
                  {formData.email}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-green-100 bg-white/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" />
                  <path d="M2 20h20" />
                  <path d="M14 12v.01" />
                </svg>
                <h3 className="text-xl font-semibold tracking-tight text-green-800">Informações Nutricionais</h3>
              </div>
            </CardHeader>
            <CardContent className="space-y-6 pb-8">
              <div className="space-y-2">
                <Label htmlFor="dailyCalorieGoal">Meta Diária de Calorias</Label>
                <Input
                  id="dailyCalorieGoal"
                  type="number"
                  value={formData.dailyCalorieGoal || ""}
                  onChange={(e) => handleInputChange("dailyCalorieGoal", e.target.value)}
                  placeholder="2000"
                  className={`border-green-100 focus-visible:ring-green-500 ${errors.dailyCalorieGoal ? "border-red-500" : ""}`}
                />
                {errors.dailyCalorieGoal && <p className="text-red-500 text-sm">{errors.dailyCalorieGoal}</p>}
                <p className="text-xs text-muted-foreground">Calorias por dia</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="weight">Peso (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    value={formData.weight || ""}
                    onChange={(e) => handleInputChange("weight", e.target.value)}
                    placeholder="Seu peso"
                    className={`border-green-100 focus-visible:ring-green-500 ${errors.weight ? "border-red-500" : ""}`}
                  />
                  {errors.weight && <p className="text-red-500 text-sm">{errors.weight}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="height">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    value={formData.height || ""}
                    onChange={(e) => handleInputChange("height", e.target.value)}
                    placeholder="Sua altura"
                    className={`border-green-100 focus-visible:ring-green-500 ${errors.height ? "border-red-500" : ""}`}
                  />
                  {errors.height && <p className="text-red-500 text-sm">{errors.height}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="activityLevel">Nível de Atividade Física</Label>
                <Select
                  value={formData.activityLevel}
                  onValueChange={(value) => handleInputChange("activityLevel", value as ActivityLevel)}
                >
                  <SelectTrigger
                    id="activityLevel"
                    className={`border-green-100 focus-visible:ring-green-500 ${errors.activityLevel ? "border-red-500" : ""}`}
                  >
                    <SelectValue placeholder="Selecione seu nível de atividade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ActivityLevelEnum.SEDENTARY}>Sedentário (pouco ou nenhum exercício)</SelectItem>
                    <SelectItem value={ActivityLevelEnum.LIGHT}>Leve (exercícios leves 1-3 dias/semana)</SelectItem>
                    <SelectItem value={ActivityLevelEnum.MODERATE}>
                      Moderado (exercícios moderados 3-5 dias/semana)
                    </SelectItem>
                    <SelectItem value={ActivityLevelEnum.ACTIVE}>
                      Ativo (exercícios intensos 6-7 dias/semana)
                    </SelectItem>
                    <SelectItem value={ActivityLevelEnum.VERY_ACTIVE}>
                      Muito Ativo (exercícios intensos diários)
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.activityLevel && <p className="text-red-500 text-sm">{errors.activityLevel}</p>}
              </div>
            </CardContent>
          </Card>

          <CardFooter className="flex justify-end gap-4 px-0">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
              className="rounded-full border-green-200 hover:bg-green-50 hover:text-green-900"
              disabled={!isDirty}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={!isDirty}
              className="rounded-full bg-green-600 text-white hover:bg-green-700"
            >
              Salvar Alterações
            </Button>
          </CardFooter>
        </div>
      </div>
    </form>
  )
}
