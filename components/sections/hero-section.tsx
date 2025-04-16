import Link from "next/link"
import { ArrowRight, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import MealTrackerDemo from "@/components/ui/meal-tracker-demo"

export default function HeroSection() {
  return (
    <section className="w-full bg-wellness-gradient py-12 md:py-24 lg:py-32 xl:py-48">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="inline-flex items-center rounded-full border bg-background/50 px-3 py-1 text-sm backdrop-blur">
              <span className="mr-2 rounded-full bg-primary px-1.5 py-0.5 text-xs font-medium text-primary-foreground">
                Novidade
              </span>
              <span className="text-xs font-medium">Agora você pode acompanhar sua sequência de dias saudáveis com o Streak!</span>
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                Coma Melhor, <span className="text-primary">Sinta-se Melhor</span>
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                O MealTracker te ajuda a acompanhar sua alimentação diária, controlar as calorias e criar hábitos
                saudáveis com uma interface bonita e fácil de usar.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/register">
                <Button size="lg" className="rounded-full px-8">
                  Comece Agora — É Grátis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/features">
                <Button size="lg" variant="outline" className="rounded-full px-8">
                  Saiba Mais
                </Button>
              </Link>
            </div>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Shield className="mr-1 h-3 w-3" />
                <span>Sem necessidade de cartão de crédito</span>
              </div>
              <div className="flex items-center">
                <Shield className="mr-1 h-3 w-3" />
                <span>Cancele quando quiser</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <MealTrackerDemo />
          </div>
        </div>
      </div>
    </section>
  )
}
