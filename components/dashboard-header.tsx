"use client"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LogOut, User, Utensils, BarChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { apiRoutes } from "@/constants/api-routes"
import { AuthService } from "@/services/auth-service"
import { useQuery } from "react-query"
import { cn } from "@/lib/utils"
import { UsersService } from "@/services/user.service"

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: BarChart },
]

export default function DashboardHeader() {
  const router = useRouter()
  const pathname = usePathname()

  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery(apiRoutes.getUserData(), async () => {
    const data = await UsersService.getUserData()
    return data.user;
  })

  const handleLogout = async () => {
    await AuthService.logout()
    router.push("/")
  }

  const isLinkActive = (path: string) => {
    if (path === "/dashboard") {
      return pathname === "/dashboard"
    }

    return pathname.startsWith(path)
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>{error instanceof Error ? error.message : "Error loading user data"}</div>
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Utensils className="h-4 w-4" />
            </div>
            <span className="font-bold">MealTracker</span>
          </Link>
          <nav className="hidden items-center space-x-6 text-sm font-medium md:flex">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-1 transition-colors",
                  isLinkActive(item.href) ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.name}
              </Link>
            ))}
          </nav>
        </div>

        <div className="md:hidden flex-1 overflow-x-auto">
          <nav className="flex items-center space-x-4 px-1">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-1 whitespace-nowrap py-2 text-sm transition-colors",
                  isLinkActive(item.href) ? "text-primary font-medium" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                <span className="sr-only md:not-sr-only">{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="ml-auto flex items-center gap-4">
          {user && <span className="text-sm font-medium hidden md:block">Welcome, {user.name}</span>}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-4 w-4" />
                </div>
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-xl p-2">
              <div className="flex flex-col space-y-1 p-2">
                {user && (
                  <>
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="cursor-pointer">
                <Link href="/dashboard/profile" className="flex items-center">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
