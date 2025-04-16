import { Utensils, CalendarCheck, Clock } from "lucide-react"
import FeatureCard from "@/components/ui/feature-card"

export default function FeaturesSection() {
  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
              Confiado por milhares de usuários que se preocupam com a saúde
            </div>
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Recursos Que Fazem a Diferença</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              O MealTracker oferece tudo o que você precisa para manter uma alimentação saudável e alcançar seus
              objetivos nutricionais.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-3">
          <FeatureCard
            icon={<Utensils className="h-6 w-6 text-primary" />}
            title="Acompanhe suas Refeições"
            description="Registre suas refeições com informações detalhadas, como calorias e tipos de refeição."
            iconBgClass="bg-primary/10"
          />
          <FeatureCard
            icon={<CalendarCheck className="h-6 w-6 text-secondary" />}
            title="Visão Geral Diária"
            description="Acompanhe tudo o que você consumiu no dia e mantenha sua alimentação sob controle."
            iconBgClass="bg-secondary/10"
          />
          <FeatureCard
            icon={<Clock className="h-6 w-6 text-accent" />}
            title="Desafie-se a manter sua sequência saudável"
            description="Cada refeição conta. Planeje, registre e acumule streaks que mostram seu compromisso com a saúde."
            iconBgClass="bg-accent/10"
          />
        </div>
      </div>
    </section>
  )
}
