// File: app/api/whatsapp/webhook/route.ts

import { type NextRequest, NextResponse } from 'next/server';
import { processWhatsAppMessage } from '@/lib/whatsapp/utils';
import { getAgnoResponse } from '@/lib/agno/agent'; // <-- IMPORTAMOS EL SERVICIO DE AGNO

// La función GET no cambia, la dejamos como está.
export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;

  if (mode === 'subscribe' && token === verifyToken) {
    console.log("✅ Verificación del Webhook exitosa.");
    return new NextResponse(challenge, { status: 200 });
  } else {
    console.error("❌ Verificación del Webhook fallida.");
    return new NextResponse('Forbidden', { status: 403 });
  }
}

// La función POST es la que actualizamos.
export async function POST(request: NextRequest) {
  console.log("--- [WHATSAPP WEBHOOK] Petición POST recibida ---");
  
  try {
    const body = await request.json();
    const messages = processWhatsAppMessage(body);

    if (messages.length > 0) {
      for (const message of messages) {
        console.log(`✅ Mensaje procesado de ${message.from}: "${message.text}"`);

        // --- ¡ESTA ES LA LÓGICA CLAVE! ---
        // 1. Obtenemos la respuesta del agente de AGNO
        console.log("🧠 Consultando al agente de AGNO...");
        const agentResponse = await getAgnoResponse(message.text, message.from);
        console.log(`🤖 Respuesta de AGNO: "${agentResponse}"`);

        // --- PRÓXIMO PASO: AQUÍ ENVIAREMOS LA RESPUESTA DE VUELTA A WHATSAPP ---
        // Por ahora, solo la mostramos en la consola.
      }
    } else {
      console.log("ℹ️ Webhook recibido, pero no contenía mensajes de texto procesables.");
    }

    return NextResponse.json({ status: 'success' }, { status: 200 });

  } catch (error) {
    console.error("Error al procesar el webhook:", error);
    return NextResponse.json({ status: 'error', message: 'Error interno' }, { status: 500 });
  }
}