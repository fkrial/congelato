import { NextResponse } from "next/server"

interface CustomerAnalytics {
  segmentation: Array<{
    segment: string
    count: number
    percentage: number
    avg_order_value: number
    frequency: number
  }>
  acquisition: Array<{
    channel: string
    customers: number
    cost_per_acquisition: number
    lifetime_value: number
    roi: number
  }>
  retention: Array<{
    cohort: string
    month_1: number
    month_3: number
    month_6: number
    month_12: number
  }>
  behavior: {
    avg_session_duration: number
    pages_per_session: number
    bounce_rate: number
    conversion_rate: number
  }
}

export async function GET() {
  const customerData: CustomerAnalytics = {
    segmentation: [
      {
        segment: "Clientes VIP",
        count: 87,
        percentage: 9.8,
        avg_order_value: 85.4,
        frequency: 12.3,
      },
      {
        segment: "Clientes Frecuentes",
        count: 234,
        percentage: 26.2,
        avg_order_value: 52.1,
        frequency: 6.8,
      },
      {
        segment: "Clientes Regulares",
        count: 398,
        percentage: 44.6,
        avg_order_value: 34.7,
        frequency: 3.2,
      },
      {
        segment: "Clientes Nuevos",
        count: 173,
        percentage: 19.4,
        avg_order_value: 28.9,
        frequency: 1.4,
      },
    ],

    acquisition: [
      {
        channel: "Redes Sociales",
        customers: 245,
        cost_per_acquisition: 12.5,
        lifetime_value: 285.4,
        roi: 2184,
      },
      {
        channel: "Referencias",
        customers: 189,
        cost_per_acquisition: 8.2,
        lifetime_value: 320.7,
        roi: 3812,
      },
      {
        channel: "Búsqueda Orgánica",
        customers: 156,
        cost_per_acquisition: 15.8,
        lifetime_value: 265.3,
        roi: 1579,
      },
      {
        channel: "Publicidad Pagada",
        customers: 134,
        cost_per_acquisition: 28.4,
        lifetime_value: 298.1,
        roi: 949,
      },
      {
        channel: "Email Marketing",
        customers: 98,
        cost_per_acquisition: 6.7,
        lifetime_value: 245.9,
        roi: 3571,
      },
    ],

    retention: [
      { cohort: "Enero 2024", month_1: 85, month_3: 72, month_6: 58, month_12: 45 },
      { cohort: "Febrero 2024", month_1: 88, month_3: 75, month_6: 62, month_12: 48 },
      { cohort: "Marzo 2024", month_1: 82, month_3: 69, month_6: 55, month_12: 42 },
      { cohort: "Abril 2024", month_1: 90, month_3: 78, month_6: 65, month_12: 52 },
    ],

    behavior: {
      avg_session_duration: 4.2,
      pages_per_session: 3.8,
      bounce_rate: 32.5,
      conversion_rate: 12.8,
    },
  }

  return NextResponse.json(customerData)
}
