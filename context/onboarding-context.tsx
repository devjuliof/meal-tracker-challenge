"use client"

import { createContext, useState, useContext, type ReactNode, useCallback } from "react"

interface OnboardingContextType {
  currentStep: number
  formData: any
  isCompleting: boolean
  updateFormData: (data: any) => void
  nextStep: () => void
  prevStep: () => void
  skipOnboarding: () => void
  totalSteps: number
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined)

interface OnboardingProviderProps {
  children: ReactNode
  initialData?: any
  totalSteps: number
  onComplete: (data: any) => void
}

export function OnboardingProvider({ children, initialData = {}, totalSteps, onComplete }: OnboardingProviderProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState(initialData)
  const [isCompleting, setIsCompleting] = useState(false)

  const updateFormData = useCallback((data: any) => {
    setFormData((prev: any) => ({ ...prev, ...data }))
  }, [])

  const nextStep = useCallback(() => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsCompleting(true)
      onComplete(formData)
    }
  }, [currentStep, totalSteps, formData, onComplete])

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    } else {
      const defaultData = { ...formData }
      setIsCompleting(true)
      onComplete(defaultData)
    }
  }, [currentStep, formData, onComplete])

  const skipOnboarding = useCallback(() => {
    const defaultData = { ...formData }
    setIsCompleting(true)
    onComplete(defaultData)
  }, [formData, onComplete])

  return (
    <OnboardingContext.Provider
      value={{
        currentStep,
        formData,
        isCompleting,
        updateFormData,
        nextStep,
        prevStep,
        skipOnboarding,
        totalSteps,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export function useOnboarding() {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error("useOnboarding must be used within an OnboardingProvider")
  }
  return context
}
