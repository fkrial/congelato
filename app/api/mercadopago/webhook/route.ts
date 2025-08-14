import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (body.type === "payment") {
      const paymentId = body.data.id
      const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN

      // Obtener detalles del pago
      const paymentResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const payment = await paymentResponse.json()

      // Actualizar estado del pedido según el estado del pago
      if (payment.status === "approved") {
        // Aquí actualizarías el estado del pedido en tu base de datos
        console.log(`Payment approved for order: ${payment.external_reference}`)

        // Enviar notificación por WhatsApp
        await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/whatsapp/send`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            to: payment.payer.phone?.area_code + payment.payer.phone?.number,
            message: `¡Tu pedido #${payment.external_reference} ha sido confirmado! Te notificaremos cuando esté listo para retirar.`,
          }),
        })
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Webhook Error:", error)
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 })
  }
}
