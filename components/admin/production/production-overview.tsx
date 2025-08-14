import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Users, Clock, AlertTriangle } from "lucide-react"

interface OverviewData {
    pendingOrders: number;
    capacityUsed: number;
    timeAvg: string;
    activeAlerts: number;
}

export function ProductionOverview({ data }: { data: OverviewData }) {
  const stats = [
    { title: "Lotes a Producir", value: data.pendingOrders.toString(), icon: Package, color: "text-blue-600" },
    { title: "Capacidad Utilizada", value: `${data.capacityUsed}%`, icon: Users, color: "text-green-600" },
    { title: "Tiempo Promedio", value: data.timeAvg, icon: Clock, color: "text-purple-600" },
    { title: "Alertas Activas", value: data.activeAlerts.toString(), icon: AlertTriangle, color: "text-red-600" },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={`h-4 w-4 ${stat.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}