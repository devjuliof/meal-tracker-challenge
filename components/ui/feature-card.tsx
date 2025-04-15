import type { ReactNode } from "react"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  iconBgClass: string
}

export default function FeatureCard({ icon, title, description, iconBgClass }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-4 rounded-xl border p-6 shadow-sm transition-all hover:shadow-md">
      <div className={`rounded-full ${iconBgClass} p-3`}>{icon}</div>
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-center text-muted-foreground">{description}</p>
    </div>
  )
}
