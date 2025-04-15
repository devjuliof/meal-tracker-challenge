import { CalendarCheck, Clock, Heart, LineChart } from "lucide-react"

export default function MealTrackerDemo() {
  return (
    <div className="relative w-full h-[500px] rounded-2xl overflow-hidden shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm"></div>
      <div className="absolute top-8 left-8 right-8 bg-white dark:bg-gray-900 rounded-xl p-4 shadow-lg animate-float">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-lg">Refeições de Hoje</h3>
          <span className="text-sm font-medium px-2 py-1 bg-primary/10 text-primary rounded-full">1,850 kcal</span>
        </div>
        <div className="space-y-3">
          <MealCard
            mealType="Café da manhã"
            mealName="Torrada de Abacate"
            time="8:30 AM"
            calories={320}
            bgClass="bg-meal-card-breakfast"
            timeIndicator="AM"
            indicatorColor="text-orange-500"
            indicatorBg="bg-orange-100"
          />
          <MealCard
            mealType="Almoço"
            mealName="Salada de Frango Grelhado"
            time="12:45 PM"
            calories={450}
            bgClass="bg-meal-card-lunch"
            timeIndicator="PM"
            indicatorColor="text-green-500"
            indicatorBg="bg-green-100"
          />
          <MealCard
            mealType="Lanche"
            mealName="Iogurte Grego com Frutas Vermelhas"
            time="3:15 PM"
            calories={180}
            bgClass="bg-meal-card-snack"
            timeIndicator="PM"
            indicatorColor="text-purple-500"
            indicatorBg="bg-purple-100"
          />
        </div>
      </div>
      <div className="absolute bottom-8 left-8 right-8 bg-white dark:bg-gray-900 rounded-xl p-4 shadow-lg">
        <div className="flex items-center space-x-4">
          <div className="flex-1">
            <div className="text-sm font-medium mb-1">Sequência Semanal</div>
            <div className="flex items-center space-x-1">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((day) => (
                  <div
                    key={day}
                    className="w-5 h-5 rounded-full bg-primary flex items-center justify-center -ml-1 first:ml-0 border-2 border-white dark:border-gray-900"
                  >
                    <CalendarCheck className="h-3 w-3 text-primary-foreground" />
                  </div>
                ))}
                {[6, 7].map((day) => (
                  <div
                    key={day}
                    className="w-5 h-5 rounded-full bg-muted flex items-center justify-center -ml-1 border-2 border-white dark:border-gray-900"
                  >
                    <CalendarCheck className="h-3 w-3 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium mb-1">Refeições Favoritas</div>
            <div className="flex items-center">
              <Heart className="h-4 w-4 text-red-500 mr-1" />
              <span className="text-sm">12 salvas</span>
            </div>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium mb-1">Média Diária</div>
            <div className="flex items-center">
              <LineChart className="h-4 w-4 text-primary mr-1" />
              <span className="text-sm">1,920 kcal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface MealCardProps {
  mealType: string
  mealName: string
  time: string
  calories: number
  bgClass: string
  timeIndicator: string
  indicatorColor: string
  indicatorBg: string
}

function MealCard({
  mealType,
  mealName,
  time,
  calories,
  bgClass,
  timeIndicator,
  indicatorColor,
  indicatorBg,
}: MealCardProps) {
  return (
    <div className={`flex items-start justify-between p-3 ${bgClass} rounded-lg`}>
      <div className="flex items-center">
        <div className={`w-10 h-10 rounded-full ${indicatorBg} flex items-center justify-center mr-3`}>
          <span className={`${indicatorColor} text-xs font-medium`}>{timeIndicator}</span>
        </div>
        <div>
          <div className="font-medium">{mealName}</div>
          <div className="text-sm text-muted-foreground flex items-center">
            <Clock className="mr-1 h-3 w-3" /> {time} • {mealType}
          </div>
        </div>
      </div>
      <div className="text-sm font-medium">{calories} kcal</div>
    </div>
  )
}
