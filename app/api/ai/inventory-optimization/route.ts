import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { predictions, currentInventory, recipes } = await request.json()

    // Calcular necesidades de inventario
    const inventoryNeeds: Record<string, number> = {}
    const recommendations = []

    // Simular cálculo de necesidades basado en predicciones
    for (const prediction of predictions) {
      const productId = prediction.product_id
      const predictedQuantity = prediction.predicted_quantity

      // Buscar receta del producto
      const recipe = recipes?.find((r: any) => r.product_id === productId)
      if (!recipe) continue

      // Calcular ingredientes necesarios
      for (const ingredient of recipe.ingredients || []) {
        const materialId = ingredient.material_id
        const quantityPerUnit = ingredient.quantity
        const totalNeeded = predictedQuantity * quantityPerUnit

        if (inventoryNeeds[materialId]) {
          inventoryNeeds[materialId] += totalNeeded
        } else {
          inventoryNeeds[materialId] = totalNeeded
        }
      }
    }

    // Generar recomendaciones
    for (const [materialId, needed] of Object.entries(inventoryNeeds)) {
      const current = currentInventory?.[materialId] || 0
      const shortage = needed - current

      if (shortage > 0) {
        recommendations.push({
          material_id: materialId,
          current_stock: current,
          predicted_need: needed,
          shortage: shortage,
          recommended_order: Math.ceil(shortage * 1.2), // 20% buffer
          priority: shortage > needed * 0.5 ? "high" : "medium",
          urgency_days: shortage > current ? 1 : 3,
        })
      }
    }

    return NextResponse.json({
      success: true,
      inventory_needs: inventoryNeeds,
      recommendations: recommendations.sort((a, b) => b.shortage - a.shortage),
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to optimize inventory" }, { status: 500 })
  }
}
