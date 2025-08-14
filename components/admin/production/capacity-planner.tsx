import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Clock, Zap } from "lucide-react"

export function CapacityPlanner() {
  const resources = [
    {
      name: "Horno Principal",
      type: "equipment",
      capacity: 100,
      used: 75,
      available: 25,
      schedule: "6:00 AM - 10:00 PM",
    },
    {
      name: "Horno Secundario",
      type: "equipment",
      capacity: 60,
      used: 45,
      available: 15,
      schedule: "8:00 AM - 6:00 PM",
    },
    {
      name: "Equipo A (Panaderos)",
      type: "staff",
      capacity: 8,
      used: 6,
      available: 2,
      schedule: "6:00 AM - 2:00 PM",
    },
    {
      name: "Equipo B (Reposteros)",
      type: "staff",
      capacity: 4,
      used: 4,
      available: 0,
      schedule: "8:00 AM - 4:00 PM",
    },
    {
      name: "Mesa de Trabajo 1",
      type: "workspace",
      capacity: 100,
      used: 60,
      available: 40,
      schedule: "24/7",
    },
  ]

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "equipment":
        return Zap
      case "staff":
        return Users
      case "workspace":
        return Clock
      default:
        return Clock
    }
  }

  const getUtilizationColor = (percentage: number) => {
    if (percentage >= 90) return "text-red-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-green-600"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Planificador de Capacidad</CardTitle>
          <Button variant="outline" size="sm">
            Optimizar Recursos
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {resources.map((resource, index) => {
            const utilizationPercentage = (resource.used / resource.capacity) * 100
            const ResourceIcon = getResourceIcon(resource.type)

            return (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <ResourceIcon className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">{resource.name}</h4>
                      <p className="text-sm text-muted-foreground">{resource.schedule}</p>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {resource.type === "staff" ? "Personal" : resource.type === "equipment" ? "Equipo" : "Espacio"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Utilización</span>
                    <span className={getUtilizationColor(utilizationPercentage)}>
                      {utilizationPercentage.toFixed(0)}%
                    </span>
                  </div>
                  <Progress value={utilizationPercentage} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Usado: {resource.used}</span>
                    <span>Disponible: {resource.available}</span>
                    <span>Total: {resource.capacity}</span>
                  </div>
                </div>

                {utilizationPercentage >= 90 && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-2">
                    <p className="text-sm text-red-800">
                      ⚠️ Recurso sobrecargado. Considere redistribuir la carga de trabajo.
                    </p>
                  </div>
                )}
              </div>
            )
          })}

          <div className="pt-4 border-t">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">73%</div>
                <div className="text-sm text-muted-foreground">Eficiencia General</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">2.4h</div>
                <div className="text-sm text-muted-foreground">Tiempo Promedio</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">156</div>
                <div className="text-sm text-muted-foreground">Unidades/Día</div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
