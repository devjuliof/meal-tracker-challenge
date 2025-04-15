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

interface LoginFormValues {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()

  const validateForm = (values: LoginFormValues) => {
    const errors: Partial<Record<keyof LoginFormValues, string>> = {}

    if (!values.email) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(values.email)) {
      errors.email = "Email is invalid"
    }

    if (!values.password) {
      errors.password = "Password is required"
    }

    return errors
  }

  const handleLogin = async (values: LoginFormValues) => {
    await AuthService.login(values)
    router.push("/dashboard")
  }

  const { values, errors, isSubmitting, generalError, handleChange, handleSubmit } = useForm<LoginFormValues>({
    initialValues: { email: "", password: "" },
    validate: validateForm,
    onSubmit: handleLogin,
  })

  return (
    <AuthLayout title="Bem-vindo de volta" description="Informe suas credenciais para acessar sua conta">
      <form onSubmit={handleSubmit} className="space-y-6">
        {generalError && <AuthError message={generalError} />}

        <div className="space-y-4">
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
            rightElement={
              <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                Esqueceu sua senha?
              </Link>
            }
          />
        </div>

        <Button type="submit" className="w-full rounded-full" disabled={isSubmitting}>
          {isSubmitting ? "Entrando..." : "Entrar"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>

      <div className="mt-4 text-center text-sm">
        Ainda não tem uma conta?{" "}
        <Link href="/register" className="text-primary hover:underline font-medium">
          Crie uma conta
        </Link>
      </div>
    </AuthLayout>
  )
}
