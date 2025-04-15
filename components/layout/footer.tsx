import Link from "next/link"
import { Utensils } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t py-6 bg-muted/30">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex items-center gap-2">
          <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Utensils className="h-3 w-3" />
          </div>
          <p className="text-sm text-muted-foreground">© 2025 MealTracker. Todos os direitos reservados.</p>
        </div>
        <div className="flex gap-4">
          <Link href="#" className="text-sm text-muted-foreground hover:underline">
            Termos de Serviço
          </Link>
          <Link href="#" className="text-sm text-muted-foreground hover:underline">
            Política de Privacidade
          </Link>
        </div>
      </div>
    </footer>
  )
}
