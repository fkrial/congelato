import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, CheckCircle, Star, AlertTriangle } from "lucide-react"

export function ProductsOverview() {
  const stats = [
    { title: "Productos Totales", value: "5", icon: Package, color: "text-blue-600" },
    { title: "Productos Activos", value: "5", icon: CheckCircle, color: "text-green-600" },
    { title: "Destacados", value: "2", icon: Star, color: "text-yellow-600" },
    { title: "Bajo Costo", value: "3", icon: AlertTriangle, color: "text-orange-600" },
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
          </CardContent>
        </Card>
      ))}
    </div>
  );
}