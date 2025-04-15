"use client"

import React, { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import toast from "react-hot-toast"

interface OnboardingContainerProps {
  children: React.ReactNode[]
  onComplete: (data: any) => void
  initialData?: any
}

export default function OnboardingContainer({ children, onComplete, initialData = {} }: OnboardingContainerProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState(initialData)
  const [isCompleting, setIsCompleting] = useState(false)
  const router = useRouter()

  // Usar useCallback para evitar recriações desnecessárias da função
  // que poderiam causar loops infinitos em useEffect dos componentes filhos
  const updateFormData = useCallback((data: any) => {
    setFormData((prev: any) => ({ ...prev, ...data }))
  }, [])

  const handleNext = () => {
    if (currentStep < children.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsCompleting(true)
      onComplete(formData)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      const defaultData = { ...formData }
      setIsCompleting(true)
      onComplete(defaultData)
    }
  }

  const handleSkip = () => {
    // Definir um valor padrão para a meta calórica
    const defaultData = { ...formData }
    toast.success("Você pode atualizar suas preferências a qualquer momento nas configurações.", {
      duration: 4000,
      position: 'bottom-center',
    });
    setIsCompleting(true)
    onComplete(defaultData)
  }

  // Clonar o filho atual e passar as props necessárias
  // Importante: Não recriamos o componente filho a cada renderização
  const currentChild = React.Children.toArray(children)[currentStep]

  // Usar React.cloneElement com props estáveis
  const childWithProps = React.isValidElement(currentChild)
    ? React.cloneElement(currentChild, {
      formData,
      updateFormData,
      onNext: handleNext,
    })
    : currentChild

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center">
            {currentStep > 0 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBack}
                className="mr-2 h-8 w-8 rounded-full"
                disabled={isCompleting}
              >
                <ChevronLeft className="h-4 w-4" />
                <span className="sr-only">Voltar</span>
              </Button>
            )}
            <div className="text-sm font-medium text-gray-500">
              Passo {currentStep + 1} de {children.length}
            </div>
          </div>
          {currentStep < children.length - 1 && (
            <Button variant="ghost" onClick={handleSkip} disabled={isCompleting} className="text-sm">
              Pular
            </Button>
          )}
        </div>

        <div className="mb-6">
          <div className="flex w-full space-x-1">
            {React.Children.map(children, (_, index) => (
              <div
                key={index}
                className={`h-1 flex-1 rounded-full ${index <= currentStep ? "bg-primary" : "bg-gray-200"
                  } transition-all duration-300`}
              ></div>
            ))}
          </div>
        </div>

        <div className="min-h-[300px]">{childWithProps}</div>

        <div className="mt-6 flex justify-between">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={isCompleting}
            className="rounded-md chakra-button chakra-button-outline"
          >
            {currentStep === 0 ? "Pular" : "Voltar"}
          </Button>
          <Button
            onClick={handleNext}
            disabled={isCompleting}
            className="rounded-md chakra-button chakra-button-primary"
          >
            {currentStep === children.length - 1 ? "Concluir" : "Próximo"}
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </Card>
    </div>
  )
}
