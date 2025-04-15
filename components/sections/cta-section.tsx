import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"

export default function CtaSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Pronto para Começar Sua Jornada?</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Junte-se a milhares de usuários que transformaram seus hábitos alimentares com o MealTracker.
            </p>
          </div>
          <div className="flex flex-col gap-2 min-[400px]:flex-row">
            <Link href="/register">
              <Button size="lg" className="rounded-full px-8">
                Cadastre-se Grátis
              </Button>
            </Link>
          </div>
          <div className="flex items-center justify-center space-x-4 mt-8">
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-8 h-8 rounded-full bg-muted overflow-hidden border-2 border-background">
                  <Image src="/placeholder.svg?height=32&width=32" width={32} height={32} alt="User avatar" />
                </div>
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              <span className="font-medium">500+</span> pessoas se juntaram esta semana
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
