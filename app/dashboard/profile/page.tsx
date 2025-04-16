import DashboardHeader from "@/components/dashboard-header"
import { ProfileForm } from "@/components/profile-form"

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <DashboardHeader />
      <div className="container mx-auto py-12 px-4 md:px-6 md:py-4">
        <h1 className="text-3xl font-bold tracking-tighter text-green-800 sm:text-4xl mb-2">Seu Perfil</h1>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          Mantenha seus dados atualizados para obter recomendações nutricionais personalizadas
        </p>
        <ProfileForm />
      </div>
    </div>
  )
}
