import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Package, DollarSign } from "lucide-react"

interface OverviewData {
    totalItems: number;
    lowStock: number;
    outOfStock: number;
    totalValue: number;
}

export function InventoryOverview({ data }: { data: OverviewData }) {
  const stats = [
    { 
      title: "Materias Primas", 
      value: data.totalItems.toString(), 
      icon: Package, 
      color: "text-blue-600" 
    },
    { 
      title: "Stock Bajo", 
      value: data.lowStock.toString(), 
      icon: AlertTriangle, 
      color: "text-yellow-600" 
    },
    { 
      title: "Agotados", 
      value: data.outOfStock.toString(), 
      icon: AlertTriangle, 
      color: "text-red-600" 
    },
    { 
      title: "Valor Total (€)", 
      value: `€${data.totalValue.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, 
      icon: DollarSign, 
      color: "text-green-600" 
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
          </CardContent>
        </Card>
      ))}
    </div>
  )
}