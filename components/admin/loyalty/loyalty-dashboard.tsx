"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, Gift, TrendingUp, Star, Crown, Award, Gem } from "lucide-react"

interface LoyaltyStats {
  total_customers: number
  active_customers: number
  total_points_issued: number
  total_points_redeemed: number
  membership_distribution: Record<string, number>
  monthly_growth: number
}

export function LoyaltyDashboard() {
  const [stats, setStats] = useState<LoyaltyStats>({
    total_customers: 1247,
    active_customers: 892,
    total_points_issued: 125000,
    total_points_redeemed: 45000,
    membership_distribution: {
      bronze: 650,
      silver: 380,
      gold: 180,
      platinum: 37,
    },
    monthly_growth: 12.5,
  })

  const getMembershipIcon = (level: string) => {
    switch (level) {
      case "bronze":
        return <Award className="h-5 w-5 text-amber-600" />
      case "silver":
        return <Star className="h-5 w-5 text-gray-500" />
      case "gold":
        return <Crown className="h-5 w-5 text-yellow-500" />
      case "platinum":
        return <Gem className="h-5 w-5 text-purple-500" />
      default:
        return <Users className="h-5 w-5" />
    }
  }

  const getMembershipColor = (level: string) => {
    switch (level) {
      case "bronze":
        return "bg-amber-100 text-amber-800"
      case "silver":
        return "bg-gray-100 text-gray-800"
      case "gold":
        return "bg-yellow-100 text-yellow-800"
      case "platinum":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const pointsUtilization = (stats.total_points_redeemed / stats.total_points_issued) * 100

  return (
    <div className="space-y-6">
      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.total_customers.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Clientes Totales</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{stats.active_customers.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Clientes Activos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Gift className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{stats.total_points_issued.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Puntos Emitidos</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{Math.round(pointsUtilization)}%</p>
                <p className="text-sm text-gray-600">Utilización</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Distribución de Membresías */}
      <Card>
        <CardHeader>
          <CardTitle>Distribución de Membresías</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(stats.membership_distribution).map(([level, count]) => {
              const percentage = (count / stats.total_customers) * 100
              return (
                <div key={level} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getMembershipIcon(level)}
                      <Badge className={getMembershipColor(level)}>{level.toUpperCase()}</Badge>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">{count.toLocaleString()}</span>
                      <span className="text-sm text-gray-500 ml-2">({percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <Progress value={percentage} className="h-2" />
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Métricas de Rendimiento */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Utilización de Puntos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Puntos Emitidos</span>
                <span className="font-medium">{stats.total_points_issued.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Puntos Canjeados</span>
                <span className="font-medium">{stats.total_points_redeemed.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Puntos Disponibles</span>
                <span className="font-medium">
                  {(stats.total_points_issued - stats.total_points_redeemed).toLocaleString()}
                </span>
              </div>
              <div className="pt-2">
                <div className="flex justify-between text-sm mb-1">
                  <span>Tasa de Utilización</span>
                  <span>{pointsUtilization.toFixed(1)}%</span>
                </div>
                <Progress value={pointsUtilization} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crecimiento del Programa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">+{stats.monthly_growth}%</p>
                <p className="text-sm text-gray-600">Crecimiento mensual</p>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Nuevos miembros este mes</span>
                  <span className="font-medium">156</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Tasa de retención</span>
                  <span className="font-medium">87%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Compra promedio</span>
                  <span className="font-medium">$45.20</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
