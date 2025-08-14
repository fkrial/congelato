"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Edit, Copy, Calculator, Clock, Users, ChefHat } from "lucide-react"

interface RecipeDetailsProps {
  recipeId: string
}

// Mock data - in real app, fetch from API
const mockRecipe = {
  id: 1,
  name: "Pan Integral Artesanal",
  category: "Panes",
  difficulty: "medium",
  description: "Pan integral con masa madre de 48 horas, rico en fibra y con un sabor incomparable.",
  prepTime: 180,
  cookTime: 45,
  yield: 2,
  yieldUnit: "panes",
  cost: 1.85,
  sellingPrice: 3.5,
  margin: 47.1,
  image: "/placeholder.svg?height=300&width=400",
  ingredients: [
    { name: "Harina integral", quantity: 500, unit: "g", cost: 0.75 },
    { name: "Masa madre", quantity: 100, unit: "g", cost: 0.15 },
    { name: "Agua", quantity: 350, unit: "ml", cost: 0.01 },
    { name: "Sal marina", quantity: 10, unit: "g", cost: 0.02 },
    { name: "Semillas mixtas", quantity: 50, unit: "g", cost: 0.92 },
  ],
  steps: [
    {
      order: 1,
      description: "Mezclar la harina integral con la sal en un bowl grande.",
      time: 5,
    },
    {
      order: 2,
      description: "Añadir la masa madre y mezclar bien hasta integrar.",
      time: 10,
    },
    {
      order: 3,
      description: "Incorporar el agua gradualmente mientras se amasa.",
      time: 15,
    },
    {
      order: 4,
      description: "Amasar durante 10 minutos hasta obtener una masa elástica.",
      time: 10,
    },
    {
      order: 5,
      description: "Dejar reposar en bowl engrasado, cubierto, por 2 horas.",
      time: 120,
    },
    {
      order: 6,
      description: "Formar los panes y colocar en moldes enharinados.",
      time: 10,
    },
    {
      order: 7,
      description: "Segunda fermentación por 1 hora hasta que duplique su tamaño.",
      time: 60,
    },
    {
      order: 8,
      description: "Hornear a 220°C por 45 minutos hasta dorar.",
      time: 45,
      temperature: 220,
    },
  ],
  lastUpdated: "2024-01-15",
  createdBy: "Chef Principal",
}

const difficultyConfig = {
  easy: { label: "Fácil", color: "bg-green-100 text-green-800" },
  medium: { label: "Intermedio", color: "bg-yellow-100 text-yellow-800" },
  hard: { label: "Avanzado", color: "bg-red-100 text-red-800" },
}

export function RecipeDetails({ recipeId }: RecipeDetailsProps) {
  const [recipe] = useState(mockRecipe)

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ""}`
    }
    return `${mins}m`
  }

  const totalTime = recipe.prepTime + recipe.cookTime
  const difficulty = difficultyConfig[recipe.difficulty as keyof typeof difficultyConfig]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => window.history.back()}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Copy className="w-4 h-4 mr-2" />
            Duplicar
          </Button>
          <Button size="sm" className="bg-primary hover:bg-primary/90">
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recipe Header */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                <img
                  src={recipe.image || "/placeholder.svg"}
                  alt={recipe.name}
                  className="w-full md:w-48 h-48 object-cover rounded-lg"
                />

                <div className="flex-1 space-y-4">
                  <div>
                    <h1 className="text-2xl font-serif font-bold text-gray-900 mb-2">{recipe.name}</h1>
                    <p className="text-gray-600">{recipe.description}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-blue-100 text-blue-800">{recipe.category}</Badge>
                    <Badge className={difficulty.color}>{difficulty.label}</Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium">{formatTime(totalTime)}</div>
                        <div className="text-xs text-gray-500">Total</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium">
                          {recipe.yield} {recipe.yieldUnit}
                        </div>
                        <div className="text-xs text-gray-500">Rendimiento</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <ChefHat className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium">{recipe.ingredients.length} ingredientes</div>
                        <div className="text-xs text-gray-500">Materiales</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ingredients */}
          <Card>
            <CardHeader>
              <CardTitle>Ingredientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recipe.ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
                  >
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">{ingredient.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-gray-600">
                        {ingredient.quantity} {ingredient.unit}
                      </span>
                      <span className="font-medium text-gray-900 min-w-[60px] text-right">
                        €{ingredient.cost.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Steps */}
          <Card>
            <CardHeader>
              <CardTitle>Pasos de Preparación</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {recipe.steps.map((step, index) => (
                  <div key={step.order} className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Badge variant="outline" className="w-8 h-8 rounded-full flex items-center justify-center">
                        {step.order}
                      </Badge>
                    </div>

                    <div className="flex-1">
                      <p className="text-gray-900 mb-2">{step.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatTime(step.time)}
                        </div>
                        {step.temperature && (
                          <div className="flex items-center gap-1">
                            <span>🌡️</span>
                            {step.temperature}°C
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cost Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Análisis de Costos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Costo total:</span>
                  <span className="font-medium">€{recipe.cost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Precio venta:</span>
                  <span className="font-medium">€{recipe.sellingPrice.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-gray-600">Ganancia:</span>
                  <span className="font-medium text-green-600">€{(recipe.sellingPrice - recipe.cost).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Margen:</span>
                  <span className={`font-medium ${recipe.margin > 60 ? "text-green-600" : "text-yellow-600"}`}>
                    {recipe.margin.toFixed(1)}%
                  </span>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium text-gray-900">Por Unidad</h4>
                <div className="text-sm space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Costo:</span>
                    <span>€{(recipe.cost / recipe.yield).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Precio:</span>
                    <span>€{(recipe.sellingPrice / recipe.yield).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ganancia:</span>
                    <span className="text-green-600">
                      €{((recipe.sellingPrice - recipe.cost) / recipe.yield).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recipe Info */}
          <Card>
            <CardHeader>
              <CardTitle>Información</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Creado por:</span>
                <span className="font-medium">{recipe.createdBy}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Última actualización:</span>
                <span className="font-medium">{recipe.lastUpdated}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tiempo prep.:</span>
                <span className="font-medium">{formatTime(recipe.prepTime)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tiempo cocción:</span>
                <span className="font-medium">{formatTime(recipe.cookTime)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
