import { type NextRequest, NextResponse } from "next/server"

interface AnalyticsOverview {
  revenue: {
    total: number
    growth: number
    monthly_trend: Array<{ month: string; revenue: number }>
  }
  orders: {
    total: number
    growth: number
    average_value: number
    completion_rate: number
  }
  customers: {
    total: number
    new_customers: number
    retention_rate: number
    lifetime_value: number
  }
  products: {
    total_sold: number
    top_performers: Array<{ name: string; sales: number; revenue: number }>
    inventory_turnover: number
  }
  profitability: {
    gross_margin: number
    net_margin: number
    cost_breakdown: Array<{ category: string; percentage: number }>
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const period = searchParams.get("period") || "30d"

  // Simular datos analíticos
  const analyticsData: AnalyticsOverview = {
    revenue: {
      total: 45750,
      growth: 12.5,
      monthly_trend: [
        { month: "Ene", revenue: 38500 },
        { month: "Feb", revenue: 41200 },
        { month: "Mar", revenue: 39800 },
        { month: "Apr", revenue: 43100 },
        { month: "May", revenue: 45750 },
        { month: "Jun", revenue: 47200 },
      ],
    },
    orders: {
      total: 1247,
      growth: 8.3,
      average_value: 36.7,
      completion_rate: 94.2,
    },
    customers: {
      total: 892,
      new_customers: 156,
      retention_rate: 78.5,
      lifetime_value: 285.4,
    },
    products: {
      total_sold: 3420,
      top_performers: [
        { name: "Pan Integral", sales: 450, revenue: 2250 },
        { name: "Croissant Clásico", sales: 380, revenue: 1900 },
        { name: "Torta de Chocolate", sales: 125, revenue: 3750 },
        { name: "Galletas de Avena", sales: 290, revenue: 1450 },
      ],
      inventory_turnover: 8.2,
    },
    profitability: {
      gross_margin: 65.8,
      net_margin: 18.4,
      cost_breakdown: [
        { category: "Materias Primas", percentage: 34.2 },
        { category: "Mano de Obra", percentage: 28.5 },
        { category: "Gastos Operativos", percentage: 18.9 },
        { category: "Marketing", percentage: 8.7 },
        { category: "Otros", percentage: 9.7 },
      ],
    },
  }

  return NextResponse.json(analyticsData)
}
