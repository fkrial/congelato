// File: lib/whatsapp/utils.ts

interface WhatsAppTextMessage {
  from: string; // Número de teléfono del remitente
  text: string; // El contenido del mensaje
}

/**
 * Procesa el cuerpo de un webhook de WhatsApp y extrae los mensajes de texto.
 * @param body El objeto JSON recibido del webhook de Meta.
 * @returns Un array de objetos WhatsAppTextMessage con la información relevante, o un array vacío si no hay mensajes de texto válidos.
 */
export function processWhatsAppMessage(body: any): WhatsAppTextMessage[] {
  const messages: WhatsAppTextMessage[] = [];

  try {
    // La estructura de Meta es anidada, navegamos hasta los mensajes
    if (body.object === 'whatsapp_business_account' && body.entry) {
      for (const entry of body.entry) {
        if (entry.changes) {
          for (const change of entry.changes) {
            if (change.field === 'messages' && change.value.messages) {
              for (const message of change.value.messages) {
                // Nos aseguramos de que sea un mensaje de texto
                if (message.type === 'text' && message.text) {
                  messages.push({
                    from: message.from,
                    text: message.text.body,
                  });
                }
              }
            }
          }
        }
      }
    }
  } catch (error) {
    console.error("Error al procesar el mensaje de WhatsApp:", error);
  }

  return messages;
}


/**
 * [VERSIÓN SIMULADA] Envía un mensaje de texto a WhatsApp.
 * En lugar de llamar a la API de Meta, imprime en la consola lo que enviaría.
 * @param to El número de teléfono del destinatario.
 * @param text El mensaje de texto a enviar.
 * @returns Una promesa que se resuelve inmediatamente.
 */
export async function sendWhatsAppMessage(to: string, text: string): Promise<void> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  // Aunque no las usemos para la llamada, es bueno verificar que existen
  // para cuando conectemos el sistema real.
  if (!accessToken || !phoneNumberId) {
    console.warn("ADVERTENCIA: Faltan las variables de entorno de WhatsApp. La simulación continuará.");
  }

  const payload = {
    messaging_product: "whatsapp",
    to: to,
    type: "text",
    text: {
      body: text,
    },
  };
  
  // --- SIMULACIÓN ---
  // En lugar de hacer un fetch, imprimimos en la consola.
  console.log("======================================================");
  console.log("📲 SIMULANDO ENVÍO DE RESPUESTA A WHATSAPP:");
  console.log(`   Destinatario: ${to}`);
  console.log(`   Mensaje: "${text}"`);
  console.log("   (En un entorno real, esto se enviaría a la API de Meta)");
  console.log("======================================================");

  // Devolvemos una promesa resuelta para que el código continúe como si el envío hubiera sido exitoso.
  return Promise.resolve();
}