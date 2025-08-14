import { type NextRequest, NextResponse } from "next/server"

// Usar los mismos datos simulados del archivo anterior
const backupRecords = [
  {
    id: "backup_001",
    name: "Backup Automático - 2024-12-08",
    type: "automatic",
    size: 2.5,
    created_at: "2024-12-08T02:00:00Z",
    status: "completed",
    data_types: ["orders", "customers", "inventory", "recipes"],
    checksum: "a1b2c3d4e5f6",
    compressed: true,
  },
  {
    id: "backup_002",
    name: "Backup Manual - Pre-Update",
    type: "manual",
    size: 2.8,
    created_at: "2024-12-07T15:30:00Z",
    status: "completed",
    data_types: ["orders", "customers", "inventory", "recipes", "loyalty_customers"],
    checksum: "f6e5d4c3b2a1",
    compressed: true,
  },
  {
    id: "backup_003",
    name: "Backup Programado - Semanal",
    type: "scheduled",
    size: 3.1,
    created_at: "2024-12-01T00:00:00Z",
    status: "completed",
    data_types: ["orders", "customers", "inventory", "recipes", "loyalty_customers", "automation_rules"],
    checksum: "1a2b3c4d5e6f",
    compressed: true,
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  let filteredBackups = backupRecords

  if (type && type !== "all") {
    filteredBackups = backupRecords.filter((backup) => backup.type === type)
  }

  const limitedBackups = filteredBackups.slice(0, limit)

  return NextResponse.json({
    backups: limitedBackups,
    total: filteredBackups.length,
    storage_used: filteredBackups.reduce((sum, backup) => sum + backup.size, 0),
  })
}
