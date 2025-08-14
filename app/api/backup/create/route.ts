import { type NextRequest, NextResponse } from "next/server"

interface BackupData {
  orders: any[]
  customers: any[]
  inventory: any[]
  recipes: any[]
  loyalty_customers: any[]
  automation_rules: any[]
  timestamp: string
  version: string
}

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

// Simulación de almacenamiento de backups
const backupRecords: BackupRecord[] = [
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
]

export async function POST(request: NextRequest) {
  try {
    const { name, type = "manual", data_types = ["all"] } = await request.json()

    // Simular creación de backup
    const backupId = `backup_${Date.now()}`

    // Simular recolección de datos
    const backupData: BackupData = {
      orders: await simulateDataCollection("orders"),
      customers: await simulateDataCollection("customers"),
      inventory: await simulateDataCollection("inventory"),
      recipes: await simulateDataCollection("recipes"),
      loyalty_customers: await simulateDataCollection("loyalty_customers"),
      automation_rules: await simulateDataCollection("automation_rules"),
      timestamp: new Date().toISOString(),
      version: "1.0.0",
    }

    // Simular compresión y cálculo de checksum
    const compressedSize = Math.random() * 3 + 1 // 1-4 MB
    const checksum = generateChecksum(JSON.stringify(backupData))

    const newBackup: BackupRecord = {
      id: backupId,
      name: name || `Backup ${type} - ${new Date().toLocaleDateString()}`,
      type,
      size: Number.parseFloat(compressedSize.toFixed(1)),
      created_at: new Date().toISOString(),
      status: "completed",
      data_types: data_types.includes("all")
        ? ["orders", "customers", "inventory", "recipes", "loyalty_customers", "automation_rules"]
        : data_types,
      checksum,
      compressed: true,
    }

    backupRecords.unshift(newBackup)

    // Simular subida a la nube
    await simulateCloudUpload(backupId, backupData)

    return NextResponse.json({
      success: true,
      backup: newBackup,
      message: "Backup creado exitosamente",
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create backup" }, { status: 500 })
  }
}

async function simulateDataCollection(dataType: string): Promise<any[]> {
  // Simular recolección de datos de diferentes fuentes
  await new Promise((resolve) => setTimeout(resolve, 100))

  const mockData = {
    orders: Array.from({ length: 50 }, (_, i) => ({ id: `order_${i}`, total: Math.random() * 100 })),
    customers: Array.from({ length: 100 }, (_, i) => ({ id: `customer_${i}`, name: `Customer ${i}` })),
    inventory: Array.from({ length: 30 }, (_, i) => ({ id: `item_${i}`, stock: Math.floor(Math.random() * 100) })),
    recipes: Array.from({ length: 20 }, (_, i) => ({ id: `recipe_${i}`, name: `Recipe ${i}` })),
    loyalty_customers: Array.from({ length: 80 }, (_, i) => ({
      id: `loyal_${i}`,
      points: Math.floor(Math.random() * 1000),
    })),
    automation_rules: Array.from({ length: 10 }, (_, i) => ({ id: `rule_${i}`, name: `Rule ${i}` })),
  }

  return mockData[dataType as keyof typeof mockData] || []
}

function generateChecksum(data: string): string {
  // Simular generación de checksum
  return Math.random().toString(36).substring(2, 15)
}

async function simulateCloudUpload(backupId: string, data: BackupData): Promise<void> {
  // Simular subida a servicio de nube
  await new Promise((resolve) => setTimeout(resolve, 500))
  console.log(`Backup ${backupId} uploaded to cloud storage`)
}
