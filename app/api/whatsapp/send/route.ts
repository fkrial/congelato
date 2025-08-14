// File: app/api/whatsapp/send/route.ts

import { type NextRequest, NextResponse } from "next/server";
import { sendWhatsAppMessage } from "@/lib/whatsapp/utils"; // Importamos nuestra función de envío

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { to, message } = body;

        if (!to || !message) {
            return NextResponse.json({ error: "El número de destinatario y el mensaje son requeridos." }, { status: 400 });
        }

        // Usamos la misma función de envío que nuestro bot automático usaría.
        // Esto mantiene nuestro código centralizado y reutilizable.
        await sendWhatsAppMessage(to, message);

        return NextResponse.json({ success: true, message: `Mensaje enviado a ${to}` });

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Error desconocido";
        console.error("Error en el endpoint /api/whatsapp/send:", errorMessage);
        return NextResponse.json({ error: "Error interno al enviar el mensaje.", details: errorMessage }, { status: 500 });
    }
}