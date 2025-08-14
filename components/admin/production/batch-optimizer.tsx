import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Package, Clock } from "lucide-react"

export function BatchOptimizer() {
  const optimizations = [
    {
      product: "Pan Integral",
      currentBatch: 25,
      optimizedBatch: 50,
      savings: 15,
      efficiency: 85,
      reason: "Mejor uso del horno",
    },
    {
      product: "Croissants",
      currentBatch: 20,
      optimizedBatch: 30,
      savings: 8,
      efficiency: 78,
      reason: "Optimización de ingredientes",
    },
    {
      product: "Baguettes",
      currentBatch: 15,
      optimizedBatch: 40,
      savings: 22,
      efficiency: 92,
      reason: "Consolidación de lotes",
    },
  ]

  const totalSavings = optimizations.reduce((sum, opt) => sum + opt.savings, 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Optimizador de Lotes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Summary */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-800">Ahorro Potencial</span>
            </div>
            <div className="text-2xl font-bold text-green-600">${totalSavings}</div>
            <div className="text-sm text-green-700">Por día con optimización</div>
          </div>

          {/* Optimizations */}
          <div className="space-y-4">
            <h3 className="font-medium">Recomendaciones</h3>
            {optimizations.map((opt, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{opt.product}</h4>
                  <Badge variant="secondary">+${opt.savings} ahorro</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Lote Actual</div>
                    <div className="font-medium">{opt.currentBatch} unidades</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Lote Optimizado</div>
                    <div className="font-medium text-green-600">{opt.optimizedBatch} unidades</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Eficiencia</span>
                    <span>{opt.efficiency}%</span>
                  </div>
                  <Progress value={opt.efficiency} className="h-2" />
                </div>

                <div className="text-sm text-muted-foreground">💡 {opt.reason}</div>

                <Button size="sm" className="w-full">
                  Aplicar Optimización
                </Button>
              </div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-muted-foreground">Tiempo Ahorrado</span>
              </div>
              <div className="text-lg font-bold text-blue-600">2.5h</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Package className="h-4 w-4 text-purple-600" />
                <span className="text-sm text-muted-foreground">Eficiencia</span>
              </div>
              <div className="text-lg font-bold text-purple-600">+18%</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
