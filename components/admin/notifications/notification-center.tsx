"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bell, Settings, Eye, EyeOff } from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  type: "order" | "inventory" | "payment" | "production"
  timestamp: string
  read: boolean
}

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "Nuevo Pedido",
      message: "Pedido #1234 recibido por $150.00",
      type: "order",
      timestamp: new Date().toISOString(),
      read: false,
    },
    {
      id: "2",
      title: "Stock Bajo",
      message: "Harina tiene solo 5kg disponibles",
      type: "inventory",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false,
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "order":
        return "bg-blue-100 text-blue-800"
      case "inventory":
        return "bg-orange-100 text-orange-800"
      case "payment":
        return "bg-green-100 text-green-800"
      case "production":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Centro de Notificaciones
          {unreadCount > 0 && <Badge variant="destructive">{unreadCount}</Badge>}
        </CardTitle>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Configurar
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border ${notification.read ? "bg-gray-50" : "bg-white border-blue-200"}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-medium ${notification.read ? "text-gray-600" : "text-gray-900"}`}>
                      {notification.title}
                    </h4>
                    <Badge className={getTypeColor(notification.type)}>{notification.type}</Badge>
                  </div>
                  <p className={`text-sm ${notification.read ? "text-gray-500" : "text-gray-700"}`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(notification.timestamp).toLocaleString()}</p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => markAsRead(notification.id)}
                  disabled={notification.read}
                >
                  {notification.read ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
