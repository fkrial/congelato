import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Users, Package } from "lucide-react"

export function ProductionScheduler() {
  const scheduledItems = [
    {
      id: 1,
      time: "06:00",
      duration: "2h 30m",
      product: "Pan Integral",
      quantity: 50,
      team: "Equipo A",
      status: "confirmed",
    },
    {
      id: 2,
      time: "08:30",
      duration: "1h 45m",
      product: "Croissants",
      quantity: 30,
      team: "Equipo B",
      status: "pending",
    },
    {
      id: 3,
      time: "10:15",
      duration: "3h 00m",
      product: "Baguettes",
      quantity: 40,
      team: "Equipo A",
      status: "confirmed",
    },
    {
      id: 4,
      time: "14:00",
      duration: "4h 00m",
      product: "Pan Dulce",
      quantity: 25,
      team: "Equipo C",
      status: "draft",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "default"
      case "pending":
        return "secondary"
      case "draft":
        return "outline"
      default:
        return "secondary"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Programador de Producción</CardTitle>
          <Button>Nueva Programación</Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex gap-4">
            <Select defaultValue="today">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hoy</SelectItem>
                <SelectItem value="tomorrow">Mañana</SelectItem>
                <SelectItem value="week">Esta Semana</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Equipos</SelectItem>
                <SelectItem value="team-a">Equipo A</SelectItem>
                <SelectItem value="team-b">Equipo B</SelectItem>
                <SelectItem value="team-c">Equipo C</SelectItem>
              </SelectContent>
            </Select>
            <Input placeholder="Buscar producto..." className="max-w-xs" />
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="font-medium">Cronograma del Día</h3>
            <div className="space-y-3">
              {scheduledItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="text-sm font-mono font-medium">{item.time}</div>
                    <div className="w-px h-8 bg-border"></div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{item.product}</h4>
                        <Badge variant={getStatusColor(item.status)}>
                          {item.status === "confirmed"
                            ? "Confirmado"
                            : item.status === "pending"
                              ? "Pendiente"
                              : "Borrador"}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {item.duration}
                        </div>
                        <div className="flex items-center gap-1">
                          <Package className="h-3 w-3" />
                          {item.quantity} unidades
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {item.team}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      Editar
                    </Button>
                    <Button size="sm" variant="ghost">
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline">Optimizar Horarios</Button>
            <Button variant="outline">Exportar Cronograma</Button>
            <Button variant="outline">Ver Conflictos</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
