import { type NextRequest, NextResponse } from "next/server"

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

export async function GET() {
  const syncStatus: SyncStatus = {
    last_sync: new Date(Date.now() - 300000).toISOString(), // 5 minutos atrás
    sync_status: "synced",
    pending_changes: 0,
    data_sources: [
      {
        name: "Pedidos",
        status: "synced",
        last_sync: new Date(Date.now() - 120000).toISOString(),
        changes_count: 0,
      },
      {
        name: "Inventario",
        status: "pending",
        last_sync: new Date(Date.now() - 600000).toISOString(),
        changes_count: 3,
      },
      {
        name: "Clientes",
        status: "synced",
        last_sync: new Date(Date.now() - 180000).toISOString(),
        changes_count: 0,
      },
      {
        name: "Recetas",
        status: "synced",
        last_sync: new Date(Date.now() - 240000).toISOString(),
        changes_count: 0,
      },
    ],
    cloud_storage: {
      connected: true,
      storage_used: 15.7, // MB
      storage_limit: 1000, // MB
      last_backup: new Date(Date.now() - 86400000).toISOString(), // 24 horas atrás
    },
  }

  return NextResponse.json(syncStatus)
}

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json()

    if (action === "force_sync") {
      // Simular sincronización forzada
      await new Promise((resolve) => setTimeout(resolve, 2000))

      return NextResponse.json({
        success: true,
        message: "Sincronización completada",
        synced_at: new Date().toISOString(),
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: "Sync operation failed" }, { status: 500 })
  }
}
