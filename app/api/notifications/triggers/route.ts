import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { event, data } = await request.json()

    // Lógica para disparar notificaciones automáticas
    const notifications = []

    switch (event) {
      case "new_order":
        notifications.push({
          title: "Nuevo Pedido",
          message: `Pedido #${data.orderId} recibido por $${data.total}`,
          type: "order",
          userId: "admin",
        })
        break

      case "low_stock":
        notifications.push({
          title: "Stock Bajo",
          message: `${data.itemName} tiene solo ${data.quantity} unidades`,
          type: "inventory",
          userId: "admin",
        })
        break

      case "payment_received":
        notifications.push({
          title: "Pago Recibido",
          message: `Pago de $${data.amount} confirmado`,
          type: "payment",
          userId: "admin",
        })
        break

      case "production_ready":
        notifications.push({
          title: "Producción Lista",
          message: `${data.productName} listo para entrega`,
          type: "production",
          userId: "admin",
        })
        break
    }

    // Enviar notificaciones
    for (const notification of notifications) {
      await fetch("/api/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(notification),
      })
    }

    return NextResponse.json({ success: true, sent: notifications.length })
  } catch (error) {
    return NextResponse.json({ error: "Failed to trigger notifications" }, { status: 500 })
  }
}
