import Link from "next/link"
import { Utensils } from "lucide-react"
import type { ReactNode } from "react"

interface AuthLayoutProps {
  children: ReactNode
  title: string
  description: string
}

export function AuthLayout({ children, title, description }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-wellness-gradient">
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-12">
        <Link href="/" className="mb-8 flex items-center space-x-2">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Utensils className="h-5 w-5" />
          </div>
          <span className="font-bold text-2xl">MealTracker</span>
        </Link>
        <div className="w-full max-w-md space-y-8 rounded-xl border bg-card p-8 shadow-lg">
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  )
}
