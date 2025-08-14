// app/api/payments/mercadopago/route.ts
import { NextResponse } from 'next/server';

// Datos simulados que imitan una respuesta de la API de Mercado Pago
const mockPayments = [
    {
      id: "mp_1234567890",
      amount: 25.50,
      status: "approved",
      customer: "Juan Pérez (juan@example.com)",
      date: new Date(Date.now() - 3600000).toISOString(), // Hace 1 hora
      orderId: "ORD-175518",
    },
    {
      id: "mp_1234567891",
      amount: 18.00,
      status: "pending",
      customer: "María García (maria@example.com)",
      date: new Date(Date.now() - 7200000).toISOString(), // Hace 2 horas
      orderId: "ORD-175517",
    },
    {
      id: "mp_1234567892",
      amount: 32.75,
      status: "approved",
      customer: "Carlos López (carlos@example.com)",
      date: new Date(Date.now() - 86400000).toISOString(), // Ayer
      orderId: "ORD-175516",
    },
    {
      id: "mp_1234567893",
      amount: 9.50,
      status: "rejected",
      customer: "Ana Martín (ana@example.com)",
      date: new Date(Date.now() - 172800000).toISOString(), // Hace 2 días
      orderId: "ORD-175515",
    },
];

export async function GET() {
  try {
    // En una aplicación real, aquí harías una llamada a la API de Mercado Pago
    // con tu Access Token para obtener la lista de pagos.
    // const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    // const response = await fetch('https://api.mercadopago.com/v1/payments/search', ...);

    const approvedPayments = mockPayments.filter(p => p.status === 'approved');
    const totalRevenue = approvedPayments.reduce((sum, p) => sum + p.amount, 0);

    const summary = {
      totalRevenue: totalRevenue,
      processedPayments: approvedPayments.length,
      pendingPayments: mockPayments.filter(p => p.status === 'pending').length,
      recentTransactions: mockPayments.slice(0, 5), // Devolver las 5 más recientes
    };

    return NextResponse.json(summary);

  } catch (error) {
    console.error("Error fetching MercadoPago data:", error);
    return NextResponse.json({ message: 'Error interno del servidor' }, { status: 500 });
  }
}