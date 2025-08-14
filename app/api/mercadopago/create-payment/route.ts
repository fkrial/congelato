// app/api/mercadopago/create-payment/route.ts
import { type NextRequest, NextResponse } from "next/server";

interface CartItem {
  id: number;
  name: string;
  base_price: string;
  quantity: number;
}

export async function POST(request: NextRequest) {
  try {
    const { items, orderId, customerEmail } = await request.json();
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;

    if (!accessToken) {
      throw new Error("MercadoPago Access Token no está configurado.");
    }
    
    if (!items || items.length === 0) {
        return NextResponse.json({ error: "El carrito está vacío." }, { status: 400 });
    }

    const preferenceItems = items.map((item: CartItem) => ({
      id: String(item.id),
      title: item.name,
      quantity: item.quantity,
      unit_price: parseFloat(item.base_price),
      currency_id: "ARS", // IMPORTANTE: Cambiar a tu moneda local (EUR, USD, etc.)
    }));
    
    // --- CORRECCIÓN CLAVE AQUÍ ---
    // Obtenemos el 'origin' (http://localhost:3001) directamente del objeto 'request'
    // Esto es más fiable que usar variables de entorno en el contexto de una API.
    const baseUrl = request.nextUrl.origin;

    const preferenceData = {
      items: preferenceItems,
      payer: {
        email: customerEmail || "test_user@test.com",
      },
      external_reference: orderId || `orden_${Date.now()}`,
      back_urls: {
        success: `${baseUrl}/payment-success`,
        failure: `${baseUrl}/cart`,
        pending: `${baseUrl}/cart`,
      },
      auto_return: "approved",
      notification_url: `${baseUrl}/api/mercadopago/webhook`,
    };

    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(preferenceData),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Error de MercadoPago:", result);
      throw new Error(result.message || "Error al crear la preferencia de pago.");
    }

    return NextResponse.json({ init_point: result.init_point });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    console.error("Error al crear pago de MercadoPago:", errorMessage);
    return NextResponse.json({ error: "Error interno al crear el pago.", details: errorMessage }, { status: 500 });
  }
}