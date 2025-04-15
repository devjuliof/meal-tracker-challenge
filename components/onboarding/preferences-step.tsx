"use client"

import { useState, useEffect } from "react"
import { Clock, Filter } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface PreferencesStepProps {
  formData: any
  updateFormData: (data: any) => void
  onNext?: () => void
}

export default function PreferencesStep({ formData, updateFormData, onNext }: PreferencesStepProps) {
  const [reminders, setReminders] = useState(formData.reminders || false)
  const [reminderTime, setReminderTime] = useState(formData.reminderTime || "19:00")
  const [weeklyReport, setWeeklyReport] = useState(formData.weeklyReport || true)

  useEffect(() => {
    updateFormData({
      reminders,
      reminderTime,
      weeklyReport,
    })
  }, [reminders, reminderTime, weeklyReport, updateFormData])

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold">Preferências</h2>
        <p className="text-gray-600">Personalize sua experiência com o Controle de Refeições.</p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Lembretes Diários</Label>
            <p className="text-sm text-gray-500">Receba lembretes para registrar suas refeições</p>
          </div>
          <Switch checked={reminders} onCheckedChange={setReminders} />
        </div>

        {reminders && (
          <div className="ml-6 space-y-2">
            <Label htmlFor="reminder-time" className="text-sm">
              Horário do lembrete
            </Label>
            <div className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-gray-500" />
              <input
                type="time"
                id="reminder-time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="chakra-input"
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Relatório Semanal</Label>
            <p className="text-sm text-gray-500">Receba um resumo semanal do seu progresso</p>
          </div>
          <Switch checked={weeklyReport} onCheckedChange={setWeeklyReport} />
        </div>
      </div>
    </div>
  )
}
