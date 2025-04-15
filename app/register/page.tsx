"use client"

import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AuthLayout } from "@/components/auth/auth-layout"
import { FormInput } from "@/components/auth/form-input"
import { AuthError } from "@/components/auth/auth-error"
import { useForm } from "@/hooks/use-form"
import { AuthService } from "@/services/auth-service"

interface RegisterFormValues {
  name: string
  email: string
  password: string
}

export default function RegisterPage() {
  const router = useRouter()

  const validateForm = (values: RegisterFormValues) => {
    const errors: Partial<Record<keyof RegisterFormValues, string>> = {}

    if (!values.name) {
      errors.name = "Name is required"
    }

    if (!values.email) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email is invalid"
    }

    if (!values.password) {
      errors.password = "Password is required"
    } else if (values.password.length < 6) {
      errors.password = "Password must be at least 6 characters"
    }

    return errors
  }

  const handleRegister = async (values: RegisterFormValues) => {
    await AuthService.register(values)
    router.push("/onboarding")
  }

  const { values, errors, isSubmitting, generalError, handleChange, handleSubmit } = useForm<RegisterFormValues>({
    initialValues: { name: "", email: "", password: "" },
    validate: validateForm,
    onSubmit: handleRegister,
  })

  return (
    <AuthLayout title="Crie sua conta" description="Preencha suas informações para começar">
      <form onSubmit={handleSubmit} className="space-y-6">
        {generalError && <AuthError message={generalError} />}

        <div className="space-y-4">
          <FormInput
            id="name"
            label="Nome"
            type="text"
            value={values.name}
            onChange={(value) => handleChange("name", value)}
            error={errors.name}
            required
          />

          <FormInput
            id="email"
            label="Email"
            type="email"
            placeholder="ola@exemplo.com"
            value={values.email}
            onChange={(value) => handleChange("email", value)}
            error={errors.email}
            required
          />

          <FormInput
            id="password"
            label="Senha"
            type="password"
            value={values.password}
            onChange={(value) => handleChange("password", value)}
            error={errors.password}
            required
          />
        </div>

        <Button type="submit" className="w-full rounded-full" disabled={isSubmitting}>
          {isSubmitting ? "Criando conta..." : "Criar conta"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>

      <div className="mt-4 text-center text-sm">
        Já é cadastrado?{" "}
        <Link href="/login" className="text-primary hover:underline font-medium">
          Entrar
        </Link>
      </div>
    </AuthLayout>
  )
}
