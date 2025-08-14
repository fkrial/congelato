import { type NextRequest, NextResponse } from "next/server"

interface ExecutionContext {
  trigger_type: string
  data: Record<string, any>
  timestamp: string
}

export async function POST(request: NextRequest) {
  try {
    const context: ExecutionContext = await request.json()

    // Obtener reglas activas
    const rulesResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/automation/rules`,
    )
    const { rules } = await rulesResponse.json()

    const executedRules = []

    // Evaluar cada regla
    for (const rule of rules) {
      if (!rule.enabled) continue

      // Verificar si el trigger coincide
      if (rule.trigger.type !== context.trigger_type) continue

      // Evaluar condiciones
      const conditionsMet = evaluateConditions(rule.trigger.conditions, context.data)
      if (!conditionsMet) continue

      // Ejecutar acciones
      const actionResults = await executeActions(rule.actions, context.data)

      executedRules.push({
        rule_id: rule.id,
        rule_name: rule.name,
        actions_executed: actionResults.length,
        success: actionResults.every((result) => result.success),
      })

      // Actualizar contador de ejecuciones
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/automation/rules`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: rule.id,
          execution_count: rule.execution_count + 1,
          last_executed: new Date().toISOString(),
        }),
      })
    }

    return NextResponse.json({
      success: true,
      executed_rules: executedRules,
      total_executed: executedRules.length,
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to execute automation" }, { status: 500 })
  }
}

function evaluateConditions(conditions: Record<string, any>, data: Record<string, any>): boolean {
  for (const [key, expectedValue] of Object.entries(conditions)) {
    const actualValue = getNestedValue(data, key)

    if (key.includes("_min") && actualValue < expectedValue) return false
    if (key.includes("_max") && actualValue > expectedValue) return false
    if (key === "threshold" && actualValue >= expectedValue) return false
    if (typeof expectedValue === "string" && actualValue !== expectedValue) return false
    if (typeof expectedValue === "number" && actualValue !== expectedValue) return false
  }

  return true
}

function getNestedValue(obj: Record<string, any>, path: string): any {
  return path.split(".").reduce((current, key) => current?.[key], obj)
}

async function executeActions(
  actions: Array<any>,
  contextData: Record<string, any>,
): Promise<Array<{ success: boolean; action: string }>> {
  const results = []

  for (const action of actions) {
    try {
      let success = false

      switch (action.type) {
        case "send_notification":
          await fetch("/api/notifications/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...action.parameters,
              data: contextData,
            }),
          })
          success = true
          break

        case "reorder_inventory":
          // Simular creación de orden de compra
          console.log("Creating purchase order:", action.parameters)
          success = true
          break

        case "update_status":
          // Simular actualización de estado
          console.log("Updating status:", action.parameters)
          success = true
          break

        case "send_whatsapp":
          await fetch("/api/whatsapp/send", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              phone: replaceTemplateVariables(action.parameters.customer_phone, contextData),
              message: replaceTemplateVariables(action.parameters.template, contextData),
            }),
          })
          success = true
          break

        case "create_task":
          // Simular creación de tarea
          console.log("Creating task:", action.parameters)
          success = true
          break

        default:
          console.log("Unknown action type:", action.type)
      }

      results.push({ success, action: action.type })
    } catch (error) {
      console.error(`Failed to execute action ${action.type}:`, error)
      results.push({ success: false, action: action.type })
    }
  }

  return results
}

function replaceTemplateVariables(template: string, data: Record<string, any>): string {
  return template.replace(/\{\{([^}]+)\}\}/g, (match, path) => {
    return getNestedValue(data, path) || match
  })
}
