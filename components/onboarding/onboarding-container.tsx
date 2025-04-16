"use client"

import React from "react"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import toast from "react-hot-toast"
import { OnboardingProvider, useOnboarding } from "@/context/onboarding-context"

interface OnboardingContainerProps {
  children: React.ReactNode[]
  onComplete: (data: any) => void
  initialData?: any
}

function OnboardingProgress() {
  const { currentStep, totalSteps } = useOnboarding()

  return (
    <div className="mb-6">
      <div className="flex w-full space-x-1">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <div
            key={index}
            className={`h-1 flex-1 rounded-full ${index <= currentStep ? "bg-primary" : "bg-gray-200"
              } transition-all duration-300`}
          ></div>
        ))}
      </div>
    </div>
  )
}

function OnboardingNavigation() {
  const { currentStep, totalSteps, isCompleting, skipOnboarding, nextStep } = useOnboarding()

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm font-medium text-gray-500">
          Passo {currentStep + 1} de {totalSteps}
        </div>
        {currentStep < totalSteps - 1 && (
          <Button variant="ghost" onClick={skipOnboarding} disabled={isCompleting} className="text-sm">
            Pular
          </Button>
        )}
      </div>
    </>
  )
}

function OnboardingContainerInner({ children }: { children: React.ReactNode[] }) {
  const { currentStep, totalSteps, nextStep, isCompleting } = useOnboarding()
  const childrenArray = React.Children.toArray(children)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
      <Card className="w-full max-w-md p-6 shadow-lg">
        <OnboardingNavigation />
        <OnboardingProgress />
        <div className="min-h-[300px] mb-6">{childrenArray[currentStep]}</div>

        <div className="mt-auto">
          <Button onClick={nextStep} disabled={isCompleting} className="w-full py-6 rounded-md text-base font-medium">
            {currentStep === totalSteps - 1 ? "Concluir" : "Próximo"}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default function OnboardingContainer({ children, onComplete, initialData = {} }: OnboardingContainerProps) {
  const handleComplete = (data: any) => {
    onComplete(data)
  }

  return (
    <OnboardingProvider
      initialData={initialData}
      totalSteps={React.Children.count(children)}
      onComplete={handleComplete}
    >
      <OnboardingContainerInner children={children} />
    </OnboardingProvider>
  )
}
