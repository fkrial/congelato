"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Send, Settings } from "lucide-react"

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    pushEnabled: true,
    emailEnabled: true,
    whatsappEnabled: false,
    orderNotifications: true,
    inventoryNotifications: true,
    paymentNotifications: true,
    productionNotifications: true,
    lowStockThreshold: 10,
  })

  const [customNotification, setCustomNotification] = useState({
    title: "",
    message: "",
    type: "general",
    recipients: "all",
  })

  const sendCustomNotification = async () => {
    try {
      await fetch("/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(customNotification),
      })

      setCustomNotification({
        title: "",
        message: "",
        type: "general",
        recipients: "all",
      })

      alert("Notificación enviada exitosamente")
    } catch (error) {
      alert("Error al enviar notificación")
    }
  }

  return (
    <div className="space-y-6">
      {/* Configuración General */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configuración de Notificaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium">Canales de Notificación</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="push">Notificaciones Push</Label>
                  <Switch
                    id="push"
                    checked={settings.pushEnabled}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, pushEnabled: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="email">Email</Label>
                  <Switch
                    id="email"
                    checked={settings.emailEnabled}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, emailEnabled: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Switch
                    id="whatsapp"
                    checked={settings.whatsappEnabled}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, whatsappEnabled: checked }))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium">Tipos de Notificación</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label htmlFor="orders">Nuevos Pedidos</Label>
                  <Switch
                    id="orders"
                    checked={settings.orderNotifications}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, orderNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="inventory">Stock Bajo</Label>
                  <Switch
                    id="inventory"
                    checked={settings.inventoryNotifications}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, inventoryNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="payments">Pagos</Label>
                  <Switch
                    id="payments"
                    checked={settings.paymentNotifications}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, paymentNotifications: checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="production">Producción</Label>
                  <Switch
                    id="production"
                    checked={settings.productionNotifications}
                    onCheckedChange={(checked) =>
                      setSettings((prev) => ({ ...prev, productionNotifications: checked }))
                    }
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="threshold">Umbral de Stock Bajo</Label>
            <Input
              id="threshold"
              type="number"
              value={settings.lowStockThreshold}
              onChange={(e) => setSettings((prev) => ({ ...prev, lowStockThreshold: Number.parseInt(e.target.value) }))}
              className="w-32"
            />
          </div>

          <Button>Guardar Configuración</Button>
        </CardContent>
      </Card>

      {/* Enviar Notificación Personalizada */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Send className="h-5 w-5" />
            Enviar Notificación Personalizada
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Título</Label>
              <Input
                id="title"
                value={customNotification.title}
                onChange={(e) => setCustomNotification((prev) => ({ ...prev, title: e.target.value }))}
                placeholder="Título de la notificación"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Select
                value={customNotification.type}
                onValueChange={(value) => setCustomNotification((prev) => ({ ...prev, type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="order">Pedido</SelectItem>
                  <SelectItem value="inventory">Inventario</SelectItem>
                  <SelectItem value="payment">Pago</SelectItem>
                  <SelectItem value="production">Producción</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Mensaje</Label>
            <Textarea
              id="message"
              value={customNotification.message}
              onChange={(e) => setCustomNotification((prev) => ({ ...prev, message: e.target.value }))}
              placeholder="Contenido de la notificación"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipients">Destinatarios</Label>
            <Select
              value={customNotification.recipients}
              onValueChange={(value) => setCustomNotification((prev) => ({ ...prev, recipients: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los usuarios</SelectItem>
                <SelectItem value="admin">Solo administradores</SelectItem>
                <SelectItem value="customers">Solo clientes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={sendCustomNotification} className="w-full">
            <Send className="h-4 w-4 mr-2" />
            Enviar Notificación
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
