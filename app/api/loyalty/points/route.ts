import { type NextRequest, NextResponse } from "next/server"

interface PointsTransaction {
  id: string
  customer_id: string
  type: "earned" | "redeemed" | "expired" | "bonus"
  points: number
  description: string
  order_id?: string
  timestamp: string
}

const pointsTransactions: PointsTransaction[] = [
  {
    id: "trans_001",
    customer_id: "cust_001",
    type: "earned",
    points: 50,
    description: "Compra de pan integral - Pedido #1234",
    order_id: "order_1234",
    timestamp: "2024-12-01T10:30:00Z",
  },
  {
    id: "trans_002",
    customer_id: "cust_001",
    type: "redeemed",
    points: -100,
    description: "Descuento 10% en croissants",
    timestamp: "2024-11-28T15:45:00Z",
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const customerId = searchParams.get("customer_id")

  let filteredTransactions = pointsTransactions

  if (customerId) {
    filteredTransactions = pointsTransactions.filter((trans) => trans.customer_id === customerId)
  }

  return NextResponse.json({ transactions: filteredTransactions })
}

export async function POST(request: NextRequest) {
  try {
    const { customer_id, type, points, description, order_id } = await request.json()

    const transaction: PointsTransaction = {
      id: `trans_${Date.now()}`,
      customer_id,
      type,
      points,
      description,
      order_id,
      timestamp: new Date().toISOString(),
    }

    pointsTransactions.push(transaction)

    // Actualizar puntos del cliente (simulado)
    console.log(`Updated customer ${customer_id} points: ${type === "earned" ? "+" : ""}${points}`)

    return NextResponse.json({ success: true, transaction })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process points" }, { status: 500 })
  }
}
