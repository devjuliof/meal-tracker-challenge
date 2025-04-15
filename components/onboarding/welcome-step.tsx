import { Utensils } from "lucide-react"

interface WelcomeStepProps {
  formData?: any
  updateFormData?: (data: any) => void
  onNext?: () => void
}

export default function WelcomeStep({ onNext }: WelcomeStepProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        <Utensils className="h-8 w-8 text-primary" />
      </div>
      <h2 className="mb-2 text-2xl font-bold">Bem-vindo ao MealTracker!</h2>
      <p className="mb-6 text-gray-600">
        Vamos configurar algumas preferências para personalizar sua experiência. Isso levará apenas alguns minutos.
      </p>
      <div className="w-full space-y-4">
        <div className="rounded-lg bg-blue-50 p-4 text-left">
          <h3 className="mb-1 font-medium text-blue-700">Personalização completa</h3>
          <p className="text-sm text-blue-600">
            Configuraremos suas metas calóricas e preferências para ajudá-lo a alcançar seus objetivos de saúde.
          </p>
        </div>
      </div>
    </div>
  )
}
