import { type NextRequest, NextResponse } from "next/server"

interface AutomationRule {
  id: string
  name: string
  description: string
  trigger: {
    type: "inventory_low" | "new_order" | "payment_received" | "production_complete" | "schedule"
    conditions: Record<string, any>
  }
  actions: Array<{
    type: "send_notification" | "reorder_inventory" | "update_status" | "send_whatsapp" | "create_task"
    parameters: Record<string, any>
  }>
  enabled: boolean
  created_at: string
  last_executed?: string
  execution_count: number
}

// Simulación de base de datos de reglas
let automationRules: AutomationRule[] = [
  {
    id: "rule_001",
    name: "Reorden Automático de Harina",
    description: "Reordena harina cuando el stock esté por debajo de 10kg",
    trigger: {
      type: "inventory_low",
      conditions: {
        material_id: "flour_001",
        threshold: 10,
      },
    },
    actions: [
      {
        type: "send_notification",
        parameters: {
          title: "Stock Bajo - Harina",
          message: "Se ha activado el reorden automático de harina",
          type: "inventory",
        },
      },
      {
        type: "reorder_inventory",
        parameters: {
          material_id: "flour_001",
          quantity: 50,
          supplier_id: "supplier_001",
        },
      },
    ],
    enabled: true,
    created_at: "2024-01-01T00:00:00Z",
    execution_count: 5,
  },
  {
    id: "rule_002",
    name: "Confirmación Automática de Pedidos",
    description: "Confirma automáticamente pedidos menores a $100",
    trigger: {
      type: "new_order",
      conditions: {
        max_amount: 100,
        payment_status: "paid",
      },
    },
    actions: [
      {
        type: "update_status",
        parameters: {
          new_status: "confirmed",
        },
      },
      {
        type: "send_whatsapp",
        parameters: {
          template: "order_confirmation",
          customer_phone: "{{customer.phone}}",
        },
      },
    ],
    enabled: true,
    created_at: "2024-01-01T00:00:00Z",
    execution_count: 23,
  },
]

export async function GET() {
  return NextResponse.json({ rules: automationRules })
}

export async function POST(request: NextRequest) {
  try {
    const newRule: Omit<AutomationRule, "id" | "created_at" | "execution_count"> = await request.json()

    const rule: AutomationRule = {
      ...newRule,
      id: `rule_${Date.now()}`,
      created_at: new Date().toISOString(),
      execution_count: 0,
    }

    automationRules.push(rule)

    return NextResponse.json({ success: true, rule })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create rule" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...updates } = await request.json()

    const ruleIndex = automationRules.findIndex((rule) => rule.id === id)
    if (ruleIndex === -1) {
      return NextResponse.json({ error: "Rule not found" }, { status: 404 })
    }

    automationRules[ruleIndex] = { ...automationRules[ruleIndex], ...updates }

    return NextResponse.json({ success: true, rule: automationRules[ruleIndex] })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update rule" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    automationRules = automationRules.filter((rule) => rule.id !== id)

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete rule" }, { status: 500 })
  }
}
