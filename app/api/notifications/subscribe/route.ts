import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { endpoint, keys, userId } = await request.json()

    // Guardar suscripción en base de datos
    const subscription = {
      id: Date.now().toString(),
      userId,
      endpoint,
      keys,
      createdAt: new Date().toISOString(),
    }

    console.log("New push subscription:", subscription)

    return NextResponse.json({ success: true, subscription })
  } catch (error) {
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
  }
}
