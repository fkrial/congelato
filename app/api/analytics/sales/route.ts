import { type NextRequest, NextResponse } from "next/server"

interface SalesAnalytics {
  daily_sales: Array<{
    date: string
    sales: number
    orders: number
    average_order: number
  }>
  hourly_distribution: Array<{
    hour: number
    sales: number
    orders: number
  }>
  product_performance: Array<{
    product_id: string
    name: string
    category: string
    units_sold: number
    revenue: number
    growth: number
    margin: number
  }>
  seasonal_trends: Array<{
    period: string
    sales: number
    comparison: number
  }>
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const period = searchParams.get("period") || "30d"
  const category = searchParams.get("category")

  const salesData: SalesAnalytics = {
    daily_sales: Array.from({ length: 30 }, (_, i) => {
      const date = new Date()
      date.setDate(date.getDate() - (29 - i))
      const baseSales = 1200 + Math.random() * 800
      const orders = Math.floor(baseSales / (30 + Math.random() * 20))

      return {
        date: date.toISOString().split("T")[0],
        sales: Math.round(baseSales),
        orders,
        average_order: Math.round(baseSales / orders),
      }
    }),

    hourly_distribution: Array.from({ length: 24 }, (_, hour) => {
      let baseSales = 50
      if (hour >= 7 && hour <= 9) baseSales = 180 // Desayuno
      if (hour >= 12 && hour <= 14) baseSales = 220 // Almuerzo
      if (hour >= 16 && hour <= 18) baseSales = 160 // Merienda
      if (hour >= 19 && hour <= 21) baseSales = 140 // Cena

      const sales = baseSales + Math.random() * 50
      return {
        hour,
        sales: Math.round(sales),
        orders: Math.floor(sales / 35),
      }
    }),

    product_performance: [
      {
        product_id: "bread_001",
        name: "Pan Integral",
        category: "Panes",
        units_sold: 450,
        revenue: 2250,
        growth: 15.2,
        margin: 68.5,
      },
      {
        product_id: "croissant_001",
        name: "Croissant Clásico",
        category: "Bollería",
        units_sold: 380,
        revenue: 1900,
        growth: 8.7,
        margin: 72.1,
      },
      {
        product_id: "cake_001",
        name: "Torta de Chocolate",
        category: "Tortas",
        units_sold: 125,
        revenue: 3750,
        growth: 22.4,
        margin: 58.3,
      },
      {
        product_id: "cookie_001",
        name: "Galletas de Avena",
        category: "Galletas",
        units_sold: 290,
        revenue: 1450,
        growth: -3.2,
        margin: 75.8,
      },
    ],

    seasonal_trends: [
      { period: "Lunes", sales: 3200, comparison: -8.5 },
      { period: "Martes", sales: 3800, comparison: 5.2 },
      { period: "Miércoles", sales: 4100, comparison: 12.3 },
      { period: "Jueves", sales: 4500, comparison: 18.7 },
      { period: "Viernes", sales: 5200, comparison: 28.4 },
      { period: "Sábado", sales: 6100, comparison: 42.1 },
      { period: "Domingo", sales: 4800, comparison: 22.8 },
    ],
  }

  return NextResponse.json(salesData)
}
