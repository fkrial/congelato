"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Brain, Calendar, AlertTriangle } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts"

interface Prediction {
  date: string
  predicted_quantity: number
  confidence: number
  factors: {
    trend?: number
    seasonal?: number
    monthly?: number
  }
}

export function DemandPredictor() {
  const [selectedProduct, setSelectedProduct] = useState("")
  const [daysAhead, setDaysAhead] = useState("7")
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [loading, setLoading] = useState(false)

  const products = [
    { id: "bread_001", name: "Pan Integral" },
    { id: "croissant_001", name: "Croissant Clásico" },
    { id: "cake_001", name: "Torta de Chocolate" },
    { id: "cookie_001", name: "Galletas de Avena" },
  ]

  const generatePredictions = async () => {
    if (!selectedProduct) return

    setLoading(true)
    try {
      const response = await fetch("/api/ai/predict-demand", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct,
          daysAhead: Number.parseInt(daysAhead),
        }),
      })

      const data = await response.json()
      if (data.success) {
        setPredictions(data.predictions)
      }
    } catch (error) {
      console.error("Error generating predictions:", error)
    } finally {
      setLoading(false)
    }
  }

  const chartData = predictions.map((pred) => ({
    date: new Date(pred.date).toLocaleDateString("es-ES", { weekday: "short", day: "numeric" }),
    cantidad: pred.predicted_quantity,
    confianza: pred.confidence * 100,
  }))

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return "text-green-600"
    if (confidence >= 0.6) return "text-yellow-600"
    return "text-red-600"
  }

  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 0.8) return "Alta"
    if (confidence >= 0.6) return "Media"
    return "Baja"
  }

  return (
    <div className="space-y-6">
      {/* Controles */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Predictor de Demanda con IA
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Producto</label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Seleccionar producto" />
                </SelectTrigger>
                <SelectContent>
                  {products.map((product) => (
                    <SelectItem key={product.id} value={product.id}>
                      {product.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Días a predecir</label>
              <Select value={daysAhead} onValueChange={setDaysAhead}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 días</SelectItem>
                  <SelectItem value="7">7 días</SelectItem>
                  <SelectItem value="14">14 días</SelectItem>
                  <SelectItem value="30">30 días</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={generatePredictions} disabled={!selectedProduct || loading}>
              {loading ? "Generando..." : "Generar Predicción"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {predictions.length > 0 && (
        <>
          {/* Gráfico de Predicciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Predicción de Demanda
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="cantidad"
                      stroke="#e11d48"
                      strokeWidth={2}
                      dot={{ fill: "#e11d48" }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de Confianza */}
          <Card>
            <CardHeader>
              <CardTitle>Nivel de Confianza</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-60">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip formatter={(value) => [`${value}%`, "Confianza"]} />
                    <Bar dataKey="confianza" fill="#059669" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Detalles de Predicciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Detalles de Predicciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictions.map((prediction, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="font-medium">
                          {new Date(prediction.date).toLocaleDateString("es-ES", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-sm text-gray-600">
                          Cantidad predicha: <span className="font-medium">{prediction.predicted_quantity}</span>{" "}
                          unidades
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Confianza</p>
                        <div className="flex items-center gap-2">
                          <Progress value={prediction.confidence * 100} className="w-20" />
                          <Badge variant="outline" className={getConfidenceColor(prediction.confidence)}>
                            {getConfidenceBadge(prediction.confidence)}
                          </Badge>
                        </div>
                      </div>

                      {prediction.confidence < 0.6 && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
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
