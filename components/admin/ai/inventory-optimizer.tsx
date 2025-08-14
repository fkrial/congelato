"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Package, AlertCircle, CheckCircle, Clock } from "lucide-react"

interface InventoryRecommendation {
  material_id: string
  material_name?: string
  current_stock: number
  predicted_need: number
  shortage: number
  recommended_order: number
  priority: "high" | "medium" | "low"
  urgency_days: number
}

export function InventoryOptimizer() {
  const [recommendations, setRecommendations] = useState<InventoryRecommendation[]>([])
  const [loading, setLoading] = useState(false)

  const mockRecommendations: InventoryRecommendation[] = [
    {
      material_id: "flour_001",
      material_name: "Harina de Trigo",
      current_stock: 25,
      predicted_need: 80,
      shortage: 55,
      recommended_order: 66,
      priority: "high",
      urgency_days: 1,
    },
    {
      material_id: "sugar_001",
      material_name: "Azúcar Blanca",
      current_stock: 15,
      predicted_need: 35,
      shortage: 20,
      recommended_order: 24,
      priority: "medium",
      urgency_days: 3,
    },
    {
      material_id: "butter_001",
      material_name: "Mantequilla",
      current_stock: 8,
      predicted_need: 22,
      shortage: 14,
      recommended_order: 17,
      priority: "high",
      urgency_days: 1,
    },
  ]

  const generateRecommendations = async () => {
    setLoading(true)
    try {
      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 2000))
      setRecommendations(mockRecommendations)
    } catch (error) {
      console.error("Error generating recommendations:", error)
    } finally {
      setLoading(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4" />
      case "medium":
        return <Clock className="h-4 w-4" />
      case "low":
        return <CheckCircle className="h-4 w-4" />
      default:
        return null
    }
  }

  const totalShortage = recommendations.reduce((sum, rec) => sum + rec.shortage, 0)
  const highPriorityItems = recommendations.filter((rec) => rec.priority === "high").length

  return (
    <div className="space-y-6">
      {/* Controles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Optimizador de Inventario IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button onClick={generateRecommendations} disabled={loading}>
              {loading ? "Analizando..." : "Generar Recomendaciones"}
            </Button>
            <p className="text-sm text-gray-600">
              Analiza la demanda predicha y genera recomendaciones de compra inteligentes
            </p>
          </div>
        </CardContent>
      </Card>

      {recommendations.length > 0 && (
        <>
          {/* Resumen */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-2xl font-bold">{highPriorityItems}</p>
                    <p className="text-sm text-gray-600">Items Críticos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{recommendations.length}</p>
                    <p className="text-sm text-gray-600">Recomendaciones</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-2xl font-bold">{Math.round(totalShortage)}</p>
                    <p className="text-sm text-gray-600">Unidades Faltantes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Recomendaciones */}
          <Card>
            <CardHeader>
              <CardTitle>Recomendaciones de Compra</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recommendations.map((rec, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div>
                          <h3 className="font-medium">{rec.material_name || rec.material_id}</h3>
                          <p className="text-sm text-gray-600">ID: {rec.material_id}</p>
                        </div>
                        <Badge className={getPriorityColor(rec.priority)}>
                          {getPriorityIcon(rec.priority)}
                          <span className="ml-1 capitalize">{rec.priority}</span>
                        </Badge>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Urgencia</p>
                        <p className="font-medium">{rec.urgency_days} día(s)</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">Stock Actual</p>
                        <p className="font-medium">{rec.current_stock} kg</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Necesidad Predicha</p>
                        <p className="font-medium">{rec.predicted_need} kg</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Faltante</p>
                        <p className="font-medium text-red-600">{rec.shortage} kg</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Compra Recomendada</p>
                        <p className="font-medium text-green-600">{rec.recommended_order} kg</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Nivel de Stock</span>
                        <span>{Math.round((rec.current_stock / rec.predicted_need) * 100)}%</span>
                      </div>
                      <Progress value={(rec.current_stock / rec.predicted_need) * 100} className="h-2" />
                    </div>

                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline">
                        Crear Orden de Compra
                      </Button>
                      <Button size="sm" variant="ghost">
                        Ver Detalles
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
