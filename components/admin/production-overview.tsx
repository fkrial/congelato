import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, AlertTriangle, CheckCircle } from "lucide-react"

const productionItems = [
  {
    product: "Pan Integral",
    quantity: 50,
    completed: 35,
    status: "in_progress",
    estimatedTime: "2 horas",
    priority: "high",
  },
  {
    product: "Croissants",
    quantity: 30,
    completed: 30,
    status: "completed",
    estimatedTime: "Completado",
    priority: "medium",
  },
  {
    product: "Tarta de Chocolate",
    quantity: 3,
    completed: 1,
    status: "in_progress",
    estimatedTime: "1.5 horas",
    priority: "high",
  },
  {
    product: "Galletas de Avena",
    quantity: 100,
    completed: 0,
    status: "pending",
    estimatedTime: "3 horas",
    priority: "low",
  },
]

const priorityColors = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-green-100 text-green-800",
}

const statusIcons = {
  pending: Clock,
  in_progress: AlertTriangle,
  completed: CheckCircle,
}

export function ProductionOverview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Producción de Hoy</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {productionItems.map((item, index) => {
            const progress = (item.completed / item.quantity) * 100
            const StatusIcon = statusIcons[item.status as keyof typeof statusIcons]

            return (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <StatusIcon className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-900">{item.product}</span>
                    <Badge className={priorityColors[item.priority as keyof typeof priorityColors]}>
                      {item.priority === "high" ? "Alta" : item.priority === "medium" ? "Media" : "Baja"}
                    </Badge>
                  </div>
                  <div className="text-right">
                    <span className="text-sm text-gray-600">
                      {item.completed}/{item.quantity}
                    </span>
                    <p className="text-xs text-gray-500">{item.estimatedTime}</p>
                  </div>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
