import Link from "next/link"
import { Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Utensils className="h-4 w-4" />
            </div>
            <span className="font-bold">MealTracker</span>
          </Link>
          <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
            <Link href="#features" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Funcionalidades
            </Link>
            <Link href="#about" className="transition-colors hover:text-foreground/80 text-foreground/60">
              Sobre
            </Link>
          </nav>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Link
            href="/login"
            className="hidden text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60 md:block"
          >
            Entrar
          </Link>
          <Link href="/register">
            <Button className="rounded-full">Comece Agora</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
