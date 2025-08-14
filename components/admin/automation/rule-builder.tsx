"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Save } from "lucide-react"

interface RuleAction {
  type: string
  parameters: Record<string, any>
}

interface RuleBuilder {
  name: string
  description: string
  trigger: {
    type: string
    conditions: Record<string, any>
  }
  actions: RuleAction[]
  enabled: boolean
}

export function RuleBuilder() {
  const [rule, setRule] = useState<RuleBuilder>({
    name: "",
    description: "",
    trigger: {
      type: "",
      conditions: {},
    },
    actions: [],
    enabled: true,
  })

  const triggerTypes = [
    { value: "inventory_low", label: "Stock Bajo" },
    { value: "new_order", label: "Nuevo Pedido" },
    { value: "payment_received", label: "Pago Recibido" },
    { value: "production_complete", label: "Producción Completa" },
    { value: "schedule", label: "Programado" },
  ]

  const actionTypes = [
    { value: "send_notification", label: "Enviar Notificación" },
    { value: "reorder_inventory", label: "Reordenar Inventario" },
    { value: "update_status", label: "Actualizar Estado" },
    { value: "send_whatsapp", label: "Enviar WhatsApp" },
    { value: "create_task", label: "Crear Tarea" },
  ]

  const addAction = () => {
    setRule((prev) => ({
      ...prev,
      actions: [...prev.actions, { type: "", parameters: {} }],
    }))
  }

  const removeAction = (index: number) => {
    setRule((prev) => ({
      ...prev,
      actions: prev.actions.filter((_, i) => i !== index),
    }))
  }

  const updateAction = (index: number, field: string, value: any) => {
    setRule((prev) => ({
      ...prev,
      actions: prev.actions.map((action, i) => (i === index ? { ...action, [field]: value } : action)),
    }))
  }

  const updateTriggerCondition = (key: string, value: any) => {
    setRule((prev) => ({
      ...prev,
      trigger: {
        ...prev.trigger,
        conditions: { ...prev.trigger.conditions, [key]: value },
      },
    }))
  }

  const saveRule = async () => {
    try {
      const response = await fetch("/api/automation/rules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(rule),
      })

      if (response.ok) {
        alert("Regla creada exitosamente")
        // Reset form
        setRule({
          name: "",
          description: "",
          trigger: { type: "", conditions: {} },
          actions: [],
          enabled: true,
        })
      }
    } catch (error) {
      alert("Error al crear la regla")
    }
  }

  const renderTriggerConditions = () => {
    switch (rule.trigger.type) {
      case "inventory_low":
        return (
          <div className="space-y-4">
            <div>
              <Label>Material ID</Label>
              <Input
                value={rule.trigger.conditions.material_id || ""}
                onChange={(e) => updateTriggerCondition("material_id", e.target.value)}
                placeholder="flour_001"
              />
            </div>
            <div>
              <Label>Umbral (kg)</Label>
              <Input
                type="number"
                value={rule.trigger.conditions.threshold || ""}
                onChange={(e) => updateTriggerCondition("threshold", Number.parseInt(e.target.value))}
                placeholder="10"
              />
            </div>
          </div>
        )

      case "new_order":
        return (
          <div className="space-y-4">
            <div>
              <Label>Monto Máximo</Label>
              <Input
                type="number"
                value={rule.trigger.conditions.max_amount || ""}
                onChange={(e) => updateTriggerCondition("max_amount", Number.parseInt(e.target.value))}
                placeholder="100"
              />
            </div>
            <div>
              <Label>Estado de Pago</Label>
              <Select
                value={rule.trigger.conditions.payment_status || ""}
                onValueChange={(value) => updateTriggerCondition("payment_status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">Pagado</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      default:
        return <p className="text-sm text-gray-500">Selecciona un tipo de trigger para configurar condiciones</p>
    }
  }

  const renderActionParameters = (action: RuleAction, index: number) => {
    switch (action.type) {
      case "send_notification":
        return (
          <div className="space-y-2">
            <Input
              placeholder="Título"
              value={action.parameters.title || ""}
              onChange={(e) => updateAction(index, "parameters", { ...action.parameters, title: e.target.value })}
            />
            <Input
              placeholder="Mensaje"
              value={action.parameters.message || ""}
              onChange={(e) => updateAction(index, "parameters", { ...action.parameters, message: e.target.value })}
            />
          </div>
        )

      case "reorder_inventory":
        return (
          <div className="space-y-2">
            <Input
              placeholder="Material ID"
              value={action.parameters.material_id || ""}
              onChange={(e) => updateAction(index, "parameters", { ...action.parameters, material_id: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Cantidad"
              value={action.parameters.quantity || ""}
              onChange={(e) =>
                updateAction(index, "parameters", { ...action.parameters, quantity: Number.parseInt(e.target.value) })
              }
            />
          </div>
        )

      case "send_whatsapp":
        return (
          <div className="space-y-2">
            <Input
              placeholder="Teléfono (usar {{customer.phone}} para dinámico)"
              value={action.parameters.customer_phone || ""}
              onChange={(e) =>
                updateAction(index, "parameters", { ...action.parameters, customer_phone: e.target.value })
              }
            />
            <Input
              placeholder="Template de mensaje"
              value={action.parameters.template || ""}
              onChange={(e) => updateAction(index, "parameters", { ...action.parameters, template: e.target.value })}
            />
          </div>
        )

      default:
        return <p className="text-xs text-gray-500">Selecciona un tipo de acción</p>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Crear Nueva Regla de Automatización</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Información Básica */}
          <div className="space-y-4">
            <div>
              <Label>Nombre de la Regla</Label>
              <Input
                value={rule.name}
                onChange={(e) => setRule((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="Ej: Reorden Automático de Harina"
              />
            </div>
            <div>
              <Label>Descripción</Label>
              <Textarea
                value={rule.description}
                onChange={(e) => setRule((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Describe qué hace esta regla..."
              />
            </div>
          </div>

          {/* Trigger */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Trigger (Disparador)</h3>
            <div>
              <Label>Tipo de Trigger</Label>
              <Select
                value={rule.trigger.type}
                onValueChange={(value) => setRule((prev) => ({ ...prev, trigger: { type: value, conditions: {} } }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar trigger" />
                </SelectTrigger>
                <SelectContent>
                  {triggerTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Condiciones</Label>
              <div className="border rounded-lg p-4">{renderTriggerConditions()}</div>
            </div>
          </div>

          {/* Acciones */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Acciones</h3>
              <Button onClick={addAction} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Acción
              </Button>
            </div>

            <div className="space-y-4">
              {rule.actions.map((action, index) => (
                <div key={index} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <Badge>Acción {index + 1}</Badge>
                    <Button variant="ghost" size="sm" onClick={() => removeAction(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label>Tipo de Acción</Label>
                      <Select value={action.type} onValueChange={(value) => updateAction(index, "type", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar acción" />
                        </SelectTrigger>
                        <SelectContent>
                          {actionTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Parámetros</Label>
                      <div className="border rounded p-3">{renderActionParameters(action, index)}</div>
                    </div>
                  </div>
                </div>
              ))}

              {rule.actions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <p>No hay acciones configuradas</p>
                  <p className="text-sm">Haz clic en "Agregar Acción" para comenzar</p>
                </div>
              )}
            </div>
          </div>

          {/* Guardar */}
          <div className="flex justify-end">
            <Button onClick={saveRule} disabled={!rule.name || !rule.trigger.type || rule.actions.length === 0}>
              <Save className="h-4 w-4 mr-2" />
              Guardar Regla
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
