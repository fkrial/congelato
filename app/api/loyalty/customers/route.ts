import { type NextRequest, NextResponse } from "next/server"

interface LoyaltyCustomer {
  id: string
  name: string
  email: string
  phone: string
  points: number
  total_spent: number
  membership_level: "bronze" | "silver" | "gold" | "platinum"
  join_date: string
  last_purchase: string
  purchases_count: number
  referrals_count: number
}

// Simulación de base de datos
const loyaltyCustomers: LoyaltyCustomer[] = [
  {
    id: "cust_001",
    name: "María González",
    email: "maria@email.com",
    phone: "+1234567890",
    points: 1250,
    total_spent: 2500,
    membership_level: "gold",
    join_date: "2024-01-15",
    last_purchase: "2024-12-01",
    purchases_count: 45,
    referrals_count: 3,
  },
  {
    id: "cust_002",
    name: "Carlos Rodríguez",
    email: "carlos@email.com",
    phone: "+1234567891",
    points: 580,
    total_spent: 1200,
    membership_level: "silver",
    join_date: "2024-03-20",
    last_purchase: "2024-11-28",
    purchases_count: 22,
    referrals_count: 1,
  },
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const level = searchParams.get("level")
  const sortBy = searchParams.get("sortBy") || "points"

  let filteredCustomers = loyaltyCustomers

  if (level) {
    filteredCustomers = loyaltyCustomers.filter((customer) => customer.membership_level === level)
  }

  // Ordenar
  filteredCustomers.sort((a, b) => {
    if (sortBy === "points") return b.points - a.points
    if (sortBy === "total_spent") return b.total_spent - a.total_spent
    if (sortBy === "purchases_count") return b.purchases_count - a.purchases_count
    return 0
  })

  return NextResponse.json({ customers: filteredCustomers })
}

export async function POST(request: NextRequest) {
  try {
    const customerData = await request.json()

    const newCustomer: LoyaltyCustomer = {
      id: `cust_${Date.now()}`,
      points: 0,
      total_spent: 0,
      membership_level: "bronze",
      join_date: new Date().toISOString().split("T")[0],
      purchases_count: 0,
      referrals_count: 0,
      ...customerData,
    }

    loyaltyCustomers.push(newCustomer)

    return NextResponse.json({ success: true, customer: newCustomer })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create customer" }, { status: 500 })
  }
}
