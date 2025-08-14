"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Settings, Clock, Cloud, Shield, Database } from "lucide-react"

export function BackupSettings() {
  const [settings, setSettings] = useState({
    automatic_backup: true,
    backup_frequency: "daily",
    backup_time: "02:00",
    retention_days: 30,
    cloud_sync: true,
    compression: true,
    encryption: true,
    data_types: {
      orders: true,
      customers: true,
      inventory: true,
      recipes: true,
      loyalty_customers: true,
      automation_rules: true,
    },
    notifications: {
      backup_success: true,
      backup_failure: true,
      storage_warning: true,
      sync_issues: true,
    },
  })

  const saveSettings = async () => {
    try {
      // Simular guardado de configuración
      await new Promise((resolve) => setTimeout(resolve, 1000))
      alert("Configuración guardada exitosamente")
    } catch (error) {
      alert("Error al guardar configuración")
    }
  }

  const testBackup = async () => {
    try {
      const response = await fetch("/api/backup/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Backup de Prueba",
          type: "manual",
          data_types: Object.keys(settings.data_types).filter(
            (key) => settings.data_types[key as keyof typeof settings.data_types],
          ),
        }),
      })

      if (response.ok) {
        alert("Backup de prueba creado exitosamente")
      }
    } catch (error) {
      alert("Error al crear backup de prueba")
    }
  }

  return (
    <div className="space-y-6">
      {/* Configuración Automática */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Backup Automático
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-backup">Habilitar backup automático</Label>
              <p className="text-sm text-gray-600">Crear backups automáticamente según la programación</p>
            </div>
            <Switch
              id="auto-backup"
              checked={settings.automatic_backup}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, automatic_backup: checked }))}
            />
          </div>

          {settings.automatic_backup && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Frecuencia</Label>
                <Select
                  value={settings.backup_frequency}
                  onValueChange={(value) => setSettings((prev) => ({ ...prev, backup_frequency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hourly">Cada hora</SelectItem>
                    <SelectItem value="daily">Diario</SelectItem>
                    <SelectItem value="weekly">Semanal</SelectItem>
                    <SelectItem value="monthly">Mensual</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Hora de backup</Label>
                <Input
                  type="time"
                  value={settings.backup_time}
                  onChange={(e) => setSettings((prev) => ({ ...prev, backup_time: e.target.value }))}
                />
              </div>

              <div>
                <Label>Retención (días)</Label>
                <Input
                  type="number"
                  value={settings.retention_days}
                  onChange={(e) =>
                    setSettings((prev) => ({ ...prev, retention_days: Number.parseInt(e.target.value) }))
                  }
                  min="1"
                  max="365"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Configuración de Nube */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="h-5 w-5" />
            Sincronización en la Nube
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="cloud-sync">Sincronización automática</Label>
              <p className="text-sm text-gray-600">Sincronizar datos con servicios en la nube</p>
            </div>
            <Switch
              id="cloud-sync"
              checked={settings.cloud_sync}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, cloud_sync: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="compression">Compresión de datos</Label>
              <p className="text-sm text-gray-600">Comprimir backups para ahorrar espacio</p>
            </div>
            <Switch
              id="compression"
              checked={settings.compression}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, compression: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="encryption">Encriptación</Label>
              <p className="text-sm text-gray-600">Encriptar backups para mayor seguridad</p>
            </div>
            <Switch
              id="encryption"
              checked={settings.encryption}
              onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, encryption: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tipos de Datos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Tipos de Datos a Respaldar
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(settings.data_types).map(([key, value]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={value}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      data_types: { ...prev.data_types, [key]: checked as boolean },
                    }))
                  }
                />
                <Label htmlFor={key} className="capitalize">
                  {key.replace("_", " ")}
                </Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Notificaciones */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Notificaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(settings.notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <Label htmlFor={key} className="capitalize">
                  {key.replace("_", " ")}
                </Label>
                <Switch
                  id={key}
                  checked={value}
                  onCheckedChange={(checked) =>
                    setSettings((prev) => ({
                      ...prev,
                      notifications: { ...prev.notifications, [key]: checked },
                    }))
                  }
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Acciones */}
      <div className="flex gap-4">
        <Button onClick={saveSettings}>
          <Settings className="h-4 w-4 mr-2" />
          Guardar Configuración
        </Button>
        <Button variant="outline" onClick={testBackup}>
          Crear Backup de Prueba
        </Button>
      </div>
    </div>
  )
}
