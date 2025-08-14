"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Zap, Play, Settings, TrendingUp, Clock } from "lucide-react"

interface AutomationRule {
  id: string
  name: string
  description: string
  trigger: {
    type: string
    conditions: Record<string, any>
  }
  actions: Array<{
    type: string
    parameters: Record<string, any>
  }>
  enabled: boolean
  execution_count: number
  last_executed?: string
}

export function AutomationDashboard() {
  const [rules, setRules] = useState<AutomationRule[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchRules()
  }, [])

  const fetchRules = async () => {
    try {
      const response = await fetch("/api/automation/rules")
      const data = await response.json()
      setRules(data.rules || [])
    } catch (error) {
      console.error("Error fetching rules:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleRule = async (ruleId: string, enabled: boolean) => {
    try {
      await fetch("/api/automation/rules", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: ruleId, enabled }),
      })

      setRules((prev) => prev.map((rule) => (rule.id === ruleId ? { ...rule, enabled } : rule)))
    } catch (error) {
      console.error("Error updating rule:", error)
    }
  }

  const getTriggerTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      inventory_low: "Stock Bajo",
      new_order: "Nuevo Pedido",
      payment_received: "Pago Recibido",
      production_complete: "Producción Completa",
      schedule: "Programado",
    }
    return labels[type] || type
  }

  const getTriggerTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      inventory_low: "bg-orange-100 text-orange-800",
      new_order: "bg-blue-100 text-blue-800",
      payment_received: "bg-green-100 text-green-800",
      production_complete: "bg-purple-100 text-purple-800",
      schedule: "bg-gray-100 text-gray-800",
    }
    return colors[type] || "bg-gray-100 text-gray-800"
  }

  const activeRules = rules.filter((rule) => rule.enabled).length
  const totalExecutions = rules.reduce((sum, rule) => sum + rule.execution_count, 0)

  if (loading) {
    return <div>Cargando automatizaciones...</div>
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{rules.length}</p>
                <p className="text-sm text-gray-600">Reglas Totales</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Play className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{activeRules}</p>
                <p className="text-sm text-gray-600">Reglas Activas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{totalExecutions}</p>
                <p className="text-sm text-gray-600">Ejecuciones</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">24h</p>
                <p className="text-sm text-gray-600">Tiempo Ahorrado</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Reglas */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Reglas de Automatización
          </CardTitle>
          <Button>Crear Nueva Regla</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {rules.map((rule) => (
              <div key={rule.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{rule.name}</h3>
                      <Badge className={getTriggerTypeColor(rule.trigger.type)}>
                        {getTriggerTypeLabel(rule.trigger.type)}
                      </Badge>
                      <Badge variant={rule.enabled ? "default" : "secondary"}>
                        {rule.enabled ? "Activa" : "Inactiva"}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{rule.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>Ejecutada {rule.execution_count} veces</span>
                      {rule.last_executed && (
                        <span>Última ejecución: {new Date(rule.last_executed).toLocaleString()}</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch checked={rule.enabled} onCheckedChange={(enabled) => toggleRule(rule.id, enabled)} />
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="font-medium mb-1">Trigger:</p>
                    <div className="bg-gray-50 p-2 rounded text-xs">
                      <pre>{JSON.stringify(rule.trigger.conditions, null, 2)}</pre>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Acciones ({rule.actions.length}):</p>
                    <div className="space-y-1">
                      {rule.actions.map((action, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {action.type}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
