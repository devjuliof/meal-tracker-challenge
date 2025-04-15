import Link from "next/link"
import { LineChart, Heart, CalendarCheck, Utensils } from "lucide-react"
import { Button } from "@/components/ui/button"
import BenefitCard from "@/components/ui/benefit-card"

export default function BenefitsSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-wellness-gradient">
      <div className="container px-4 md:px-6">
        <div className="grid gap-10 lg:grid-cols-2 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center rounded-full border bg-background/50 px-3 py-1 text-sm backdrop-blur">
              <span className="text-xs font-medium">Resultados Reais</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Alcance Seus Objetivos de Saúde
            </h2>
            <p className="max-w-[600px] text-muted-foreground md:text-xl">
              Junte-se a milhares de usuários que transformaram seus hábitos alimentares e alcançaram seus objetivos de
              saúde com o MealTracker.
            </p>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/register">
                <Button size="lg" className="rounded-full px-8">
                  Comece Sua Jornada
                </Button>
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-4">
              <BenefitCard
                icon={<LineChart className="h-4 w-4 text-primary" />}
                title="Controle de Peso"
                description="Acompanhe as calorias para um controle de peso eficaz."
                iconBgClass="bg-primary/10"
              />
              <BenefitCard
                icon={<Heart className="h-4 w-4 text-secondary" />}
                title="Escolhas Mais Saudáveis"
                description="Faça escolhas alimentares mais inteligentes a cada dia"
                iconBgClass="bg-secondary/10"
              />
            </div>
            <div className="grid gap-4">
              <BenefitCard
                icon={<CalendarCheck className="h-4 w-4 text-accent" />}
                title="Consistência"
                description="Crie hábitos saudáveis e duradouros"
                iconBgClass="bg-accent/10"
              />
              <BenefitCard
                icon={<Utensils className="h-4 w-4 text-primary" />}
                title="Variedade de Refeições"
                description="Descubra opções de nutrição equilibrada"
                iconBgClass="bg-primary/10"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
