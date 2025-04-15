import type { ReactNode } from "react"

interface BenefitCardProps {
  icon: ReactNode
  title: string
  description: string
  iconBgClass: string
}

export default function BenefitCard({ icon, title, description, iconBgClass }: BenefitCardProps) {
  return (
    <div className="rounded-xl bg-background p-4 shadow-sm">
      <div className="flex items-center gap-4">
        <div className={`rounded-full ${iconBgClass} p-2`}>{icon}</div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </div>
  )
}
