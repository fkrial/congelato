import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChefHat, Calculator, TrendingUp, Clock } from "lucide-react"

interface OverviewData {
  totalRecipes: number;
  avgCost: number;
}

export function RecipeOverview({ data }: { data: OverviewData }) {
  const stats = [
    {
      title: "Total Recetas",
      value: data.totalRecipes.toString(),
      description: "Recetas en el sistema",
      icon: ChefHat,
      color: "text-blue-600",
    },
    {
      title: "Costo Promedio",
      value: `€${data.avgCost.toFixed(2)}`,
      description: "Costo medio de producción",
      icon: Calculator,
      color: "text-green-600",
    },
    {
      title: "Margen Promedio",
      value: "68%", // Este valor sigue siendo simulado
      description: "+2.3% vs mes anterior",
      icon: TrendingUp,
      color: "text-green-600",
    },
    {
      title: "Tiempo Promedio",
      value: "2.5h", // Este valor sigue siendo simulado
      description: "Tiempo de preparación",
      icon: Clock,
      color: "text-orange-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}