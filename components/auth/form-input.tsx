"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { ReactNode } from "react"

interface FormInputProps {
  id: string
  label: string
  type: string
  placeholder?: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  error?: string
  rightElement?: ReactNode
}

export function FormInput({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  required = false,
  error,
  rightElement,
}: FormInputProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id}>{label}</Label>
        {rightElement}
      </div>
      <Input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`rounded-lg ${error ? "border-destructive" : ""}`}
        required={required}
      />
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  )
}
