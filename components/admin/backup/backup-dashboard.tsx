"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Database, Cloud, Download, Upload, Shield, Clock, HardDrive, Wifi, WifiOff, RefreshCw } from "lucide-react"

interface BackupRecord {
  id: string
  name: string
  type: "manual" | "automatic" | "scheduled"
  size: number
  created_at: string
  status: "completed" | "in_progress" | "failed"
  data_types: string[]
  checksum: string
  compressed: boolean
}

interface SyncStatus {
  last_sync: string
  sync_status: "synced" | "syncing" | "error" | "offline"
  pending_changes: number
  data_sources: {
    name: string
    status: "synced" | "pending" | "error"
    last_sync: string
    changes_count: number
  }[]
  cloud_storage: {
    connected: boolean
    storage_used: number
    storage_limit: number
    last_backup: string
  }
}

export function BackupDashboard() {
  const [backups, setBackups] = useState<BackupRecord[]>([])
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [syncing, setSyncing] = useState(false)

  useEffect(() => {
    fetchBackups()
    fetchSyncStatus()
  }, [])

  const fetchBackups = async () => {
    try {
      const response = await fetch("/api/backup/list?limit=5")
      const data = await response.json()
      setBackups(data.backups || [])
    } catch (error) {
      console.error("Error fetching backups:", error)
    }
  }

  const fetchSyncStatus = async () => {
    try {
      const response = await fetch("/api/sync/status")
      const data = await response.json()
      setSyncStatus(data)
    } catch (error) {
      console.error("Error fetching sync status:", error)
    } finally {
      setLoading(false)
    }
  }

  const createBackup = async () => {
    try {
      const response = await fetch("/api/backup/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `Backup Manual - ${new Date().toLocaleDateString()}`,
          type: "manual",
          data_types: ["all"],
        }),
      })

      if (response.ok) {
        fetchBackups()
        alert("Backup creado exitosamente")
      }
    } catch (error) {
      alert("Error al crear backup")
    }
  }

  const forceSync = async () => {
    setSyncing(true)
    try {
      const response = await fetch("/api/sync/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "force_sync" }),
      })

      if (response.ok) {
        fetchSyncStatus()
        alert("Sincronización completada")
      }
    } catch (error) {
      alert("Error en la sincronización")
    } finally {
      setSyncing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "synced":
      case "completed":
        return "bg-green-100 text-green-800"
      case "pending":
      case "syncing":
      case "in_progress":
        return "bg-yellow-100 text-yellow-800"
      case "error":
      case "failed":
        return "bg-red-100 text-red-800"
      case "offline":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "synced":
      case "completed":
        return <Shield className="h-4 w-4" />
      case "pending":
      case "syncing":
      case "in_progress":
        return <RefreshCw className="h-4 w-4 animate-spin" />
      case "offline":
        return <WifiOff className="h-4 w-4" />
      default:
        return <Wifi className="h-4 w-4" />
    }
  }

  if (loading) {
    return <div>Cargando información de backup...</div>
  }

  const storagePercentage = syncStatus
    ? (syncStatus.cloud_storage.storage_used / syncStatus.cloud_storage.storage_limit) * 100
    : 0

  return (
    <div className="space-y-6">
      {/* Estado General */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{backups.length}</p>
                <p className="text-sm text-gray-600">Backups Totales</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Cloud className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">
                  {syncStatus?.cloud_storage.connected ? "Conectado" : "Desconectado"}
                </p>
                <p className="text-sm text-gray-600">Estado de Nube</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <HardDrive className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{syncStatus?.cloud_storage.storage_used.toFixed(1)} MB</p>
                <p className="text-sm text-gray-600">Almacenamiento Usado</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{syncStatus?.pending_changes || 0}</p>
                <p className="text-sm text-gray-600">Cambios Pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estado de Sincronización */}
      {syncStatus && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Wifi className="h-5 w-5" />
              Estado de Sincronización
            </CardTitle>
            <Button onClick={forceSync} disabled={syncing} size="sm">
              <RefreshCw className={`h-4 w-4 mr-2 ${syncing ? "animate-spin" : ""}`} />
              {syncing ? "Sincronizando..." : "Sincronizar Ahora"}
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Última sincronización:</span>
                <span className="font-medium">{new Date(syncStatus.last_sync).toLocaleString()}</span>
              </div>

              <div className="space-y-3">
                {syncStatus.data_sources.map((source, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(source.status)}>
                        {getStatusIcon(source.status)}
                        <span className="ml-1">{source.status}</span>
                      </Badge>
                      <span className="font-medium">{source.name}</span>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      {source.changes_count > 0 && (
                        <span className="text-orange-600 font-medium">{source.changes_count} cambios pendientes</span>
                      )}
                      <div>Última sync: {new Date(source.last_sync).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Almacenamiento en la Nube */}
      {syncStatus && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="h-5 w-5" />
              Almacenamiento en la Nube
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Espacio utilizado</span>
                <span>
                  {syncStatus.cloud_storage.storage_used.toFixed(1)} MB de {syncStatus.cloud_storage.storage_limit} MB
                </span>
              </div>
              <Progress value={storagePercentage} className="h-2" />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Estado de conexión:</span>
                  <div className="flex items-center gap-2 mt-1">
                    {syncStatus.cloud_storage.connected ? (
                      <Badge className="bg-green-100 text-green-800">
                        <Wifi className="h-3 w-3 mr-1" />
                        Conectado
                      </Badge>
                    ) : (
                      <Badge className="bg-red-100 text-red-800">
                        <WifiOff className="h-3 w-3 mr-1" />
                        Desconectado
                      </Badge>
                    )}
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Último backup:</span>
                  <div className="mt-1 font-medium">
                    {new Date(syncStatus.cloud_storage.last_backup).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Backups Recientes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Backups Recientes
          </CardTitle>
          <Button onClick={createBackup}>
            <Upload className="h-4 w-4 mr-2" />
            Crear Backup
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {backups.map((backup) => (
              <div key={backup.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h4 className="font-medium">{backup.name}</h4>
                    <Badge className={getStatusColor(backup.status)}>{backup.status}</Badge>
                    <Badge variant="outline">{backup.type}</Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>{backup.size} MB</span>
                    <span>{backup.data_types.length} tipos de datos</span>
                    <span>{new Date(backup.created_at).toLocaleString()}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Descargar
                  </Button>
                  <Button variant="outline" size="sm">
                    Restaurar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
