"use client"

import { useRouter } from "next/navigation"
import OnboardingContainer from "@/components/onboarding/onboarding-container"
import WelcomeStep from "@/components/onboarding/welcome-step"
import CalorieGoalStep from "@/components/onboarding/calorie-goal-step"
import PreferencesStep from "@/components/onboarding/preferences-step"
import CompletionStep from "@/components/onboarding/completion-step"
import { UsersService } from "@/services/user.service"
import toast from "react-hot-toast"

export default function OnboardingPage() {
  const router = useRouter()

  const handleOnboardingComplete = async (data: any) => {
    await UsersService.updateUser(data)

    toast.success("Configuração concluída! Suas preferências foram salvas com sucesso.", {
      duration: 3000,
      position: "bottom-center",
    })

    router.push("/dashboard")
  }

  return (
    <OnboardingContainer onComplete={handleOnboardingComplete}>
      <WelcomeStep />
      <CalorieGoalStep />
      <PreferencesStep />
      <CompletionStep />
    </OnboardingContainer>
  )
}
