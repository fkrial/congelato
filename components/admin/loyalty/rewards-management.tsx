"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Gift, Percent, Star, Zap } from "lucide-react"

interface Reward {
  id: string
  name: string
  description: string
  points_required: number
  reward_type: "discount" | "free_item" | "upgrade" | "special_offer"
  value: number
  category: string
  active: boolean
  expiry_date?: string
  usage_limit?: number
  used_count: number
  membership_levels: string[]
}

export function RewardsManagement() {
  const [rewards, setRewards] = useState<Reward[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [editingReward, setEditingReward] = useState<Reward | null>(null)
  const [loading, setLoading] = useState(true)

  const [newReward, setNewReward] = useState({
    name: "",
    description: "",
    points_required: 100,
    reward_type: "discount" as const,
    value: 10,
    category: "descuentos",
    active: true,
    expiry_date: "",
    usage_limit: 100,
    membership_levels: ["bronze", "silver", "gold", "platinum"],
  })

  useEffect(() => {
    fetchRewards()
  }, [])

  const fetchRewards = async () => {
    try {
      const response = await fetch("/api/loyalty/rewards")
      const data = await response.json()
      setRewards(data.rewards || [])
    } catch (error) {
      console.error("Error fetching rewards:", error)
    } finally {
      setLoading(false)
    }
  }

  const createReward = async () => {
    try {
      const response = await fetch("/api/loyalty/rewards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReward),
      })

      if (response.ok) {
        fetchRewards()
        setShowCreateForm(false)
        setNewReward({
          name: "",
          description: "",
          points_required: 100,
          reward_type: "discount",
          value: 10,
          category: "descuentos",
          active: true,
          expiry_date: "",
          usage_limit: 100,
          membership_levels: ["bronze", "silver", "gold", "platinum"],
        })
        alert("Recompensa creada exitosamente")
      }
    } catch (error) {
      alert("Error al crear recompensa")
    }
  }

  const getRewardTypeIcon = (type: string) => {
    switch (type) {
      case "discount":
        return <Percent className="h-4 w-4" />
      case "free_item":
        return <Gift className="h-4 w-4" />
      case "upgrade":
        return <Star className="h-4 w-4" />
      case "special_offer":
        return <Zap className="h-4 w-4" />
      default:
        return <Gift className="h-4 w-4" />
    }
  }

  const getRewardTypeColor = (type: string) => {
    switch (type) {
      case "discount":
        return "bg-blue-100 text-blue-800"
      case "free_item":
        return "bg-green-100 text-green-800"
      case "upgrade":
        return "bg-purple-100 text-purple-800"
      case "special_offer":
        return "bg-orange-100 text-orange-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const rewardTypes = [
    { value: "discount", label: "Descuento" },
    { value: "free_item", label: "Producto Gratis" },
    { value: "upgrade", label: "Upgrade" },
    { value: "special_offer", label: "Oferta Especial" },
  ]

  const categories = [
    { value: "descuentos", label: "Descuentos" },
    { value: "productos_gratis", label: "Productos Gratis" },
    { value: "upgrades", label: "Upgrades" },
    { value: "ofertas_especiales", label: "Ofertas Especiales" },
  ]

  if (loading) {
    return <div>Cargando recompensas...</div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Gestión de Recompensas</CardTitle>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Nueva Recompensa
          </Button>
        </CardHeader>
      </Card>

      {/* Formulario de Creación */}
      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Crear Nueva Recompensa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Nombre</Label>
                <Input
                  value={newReward.name}
                  onChange={(e) => setNewReward((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Ej: 10% de Descuento"
                />
              </div>
              <div>
                <Label>Puntos Requeridos</Label>
                <Input
                  type="number"
                  value={newReward.points_required}
                  onChange={(e) =>
                    setNewReward((prev) => ({ ...prev, points_required: Number.parseInt(e.target.value) }))
                  }
                />
              </div>
            </div>

            <div>
              <Label>Descripción</Label>
              <Textarea
                value={newReward.description}
                onChange={(e) => setNewReward((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe la recompensa..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Tipo de Recompensa</Label>
                <Select
                  value={newReward.reward_type}
                  onValueChange={(value: any) => setNewReward((prev) => ({ ...prev, reward_type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {rewardTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Valor</Label>
                <Input
                  type="number"
                  value={newReward.value}
                  onChange={(e) => setNewReward((prev) => ({ ...prev, value: Number.parseInt(e.target.value) }))}
                />
              </div>
              <div>
                <Label>Límite de Uso</Label>
                <Input
                  type="number"
                  value={newReward.usage_limit}
                  onChange={(e) => setNewReward((prev) => ({ ...prev, usage_limit: Number.parseInt(e.target.value) }))}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={createReward}>Crear Recompensa</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancelar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Recompensas */}
      <div className="grid gap-4">
        {rewards.map((reward) => (
          <Card key={reward.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{reward.name}</h3>
                    <Badge className={getRewardTypeColor(reward.reward_type)}>
                      {getRewardTypeIcon(reward.reward_type)}
                      <span className="ml-1">{reward.reward_type}</span>
                    </Badge>
                    <Badge variant={reward.active ? "default" : "secondary"}>
                      {reward.active ? "Activa" : "Inactiva"}
                    </Badge>
                  </div>

                  <p className="text-gray-600 mb-4">{reward.description}</p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-xl font-bold text-blue-600">{reward.points_required}</p>
                      <p className="text-sm text-gray-600">Puntos</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-xl font-bold text-green-600">
                        {reward.reward_type === "discount" ? `${reward.value}%` : `$${reward.value}`}
                      </p>
                      <p className="text-sm text-gray-600">Valor</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-xl font-bold text-purple-600">{reward.used_count}</p>
                      <p className="text-sm text-gray-600">Canjeadas</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <p className="text-xl font-bold text-orange-600">{reward.usage_limit || "∞"}</p>
                      <p className="text-sm text-gray-600">Límite</p>
                    </div>
                  </div>

                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Niveles de membresía:</p>
                    <div className="flex gap-2">
                      {reward.membership_levels.map((level) => (
                        <Badge key={level} variant="outline" className="text-xs">
                          {level}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button size="sm" variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button size="sm" variant="outline">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
