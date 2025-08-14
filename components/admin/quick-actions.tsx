import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Package, ChefHat, Calendar, FileText } from "lucide-react"

const quickActions = [
  {
    title: "Nuevo Producto",
    description: "Agregar producto al catálogo",
    icon: Plus,
    href: "/admin/products/new",
    color: "bg-blue-500 hover:bg-blue-600",
  },
  {
    title: "Gestionar Inventario",
    description: "Actualizar stock de materias primas",
    icon: Package,
    href: "/admin/inventory",
    color: "bg-green-500 hover:bg-green-600",
  },
  {
    title: "Nueva Receta",
    description: "Crear receta para producto",
    icon: ChefHat,
    href: "/admin/recipes/new",
    color: "bg-purple-500 hover:bg-purple-600",
  },
  {
    title: "Planificar Producción",
    description: "Programar producción diaria",
    icon: Calendar,
    href: "/admin/production/plan",
    color: "bg-orange-500 hover:bg-orange-600",
  },
  {
    title: "Generar Reporte",
    description: "Crear reporte de ventas",
    icon: FileText,
    href: "/admin/reports",
    color: "bg-indigo-500 hover:bg-indigo-600",
  },
]

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {quickActions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="w-full justify-start h-auto p-4 text-left bg-transparent"
              asChild
            >
              <a href={action.href}>
                <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mr-3`}>
                  <action.icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{action.title}</p>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </div>
              </a>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
