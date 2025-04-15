"use client"

import { CheckCircle, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CompletionStepProps {
  formData: any
  updateFormData?: (data: any) => void
  onNext?: () => void
}

export default function CompletionStep({ formData, onNext }: CompletionStepProps) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <CheckCircle className="h-8 w-8 text-green-600" />
      </div>
      <h2 className="mb-2 text-2xl font-bold">Configuração Concluída!</h2>
      <p className="mb-6 text-gray-600">
        Sua meta calórica diária de <span className="font-bold text-primary">{formData.dailyCalorieGoal} kcal</span> foi
        definida. Agora você pode começar a acompanhar suas refeições.
      </p>

      <div className="w-full space-y-4">
        <div className="rounded-lg bg-blue-50 p-4 text-left">
          <h3 className="mb-1 font-medium text-blue-700">Próximos passos</h3>
          <ul className="ml-5 list-disc space-y-1 text-sm text-blue-600">
            <li>Adicione sua primeira refeição</li>
            <li>Explore o painel para ver suas estatísticas</li>
            <li>Configure lembretes para manter o hábito</li>
          </ul>
        </div>

        {onNext && (
          <Button onClick={onNext} className="mt-4 w-full rounded-md chakra-button chakra-button-primary">
            Ir para o Painel
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
