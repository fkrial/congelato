import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, Clock, CheckCircle, AlertCircle } from "lucide-react"

const recentOrders = [
  {
    id: "ORD-001",
    customer: "María García",
    items: "Pan Integral x2, Croissant x4",
    total: 12.6,
    status: "pending",
    time: "hace 5 min",
  },
  {
    id: "ORD-002",
    customer: "Carlos López",
    items: "Tarta Chocolate, Galletas x6",
    total: 28.5,
    status: "confirmed",
    time: "hace 15 min",
  },
  {
    id: "ORD-003",
    customer: "Ana Martín",
    items: "Muffins x3, Pan Integral",
    total: 13.1,
    status: "ready",
    time: "hace 30 min",
  },
  {
    id: "ORD-004",
    customer: "Hotel Plaza",
    items: "Pan x20, Croissant x15",
    total: 85.0,
    status: "in_production",
    time: "hace 1 hora",
  },
]

const statusConfig = {
  pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
  confirmed: { label: "Confirmado", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  in_production: { label: "En Producción", color: "bg-purple-100 text-purple-800", icon: AlertCircle },
  ready: { label: "Listo", color: "bg-green-100 text-green-800", icon: CheckCircle },
}

export function RecentOrders() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Pedidos Recientes</CardTitle>
        <Button variant="outline" size="sm">
          Ver Todos
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentOrders.map((order) => {
            const status = statusConfig[order.status as keyof typeof statusConfig]
            const StatusIcon = status.icon

            return (
              <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-medium text-gray-900">{order.id}</span>
                    <Badge className={status.color}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {status.label}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-1">{order.customer}</p>
                  <p className="text-xs text-gray-500">{order.items}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">€{order.total.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">{order.time}</p>
                  <Button variant="ghost" size="sm" className="mt-1">
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
