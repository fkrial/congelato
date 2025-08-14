// File: components/admin/integrations/whatsapp-panel.tsx

"use client"

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

export function WhatsAppPanel() {
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!message || !recipient) {
      toast({
        variant: "destructive",
        title: "Campos requeridos",
        description: "Por favor, introduce un número y un mensaje.",
      });
      return;
    }

    setIsSending(true);
    try {
      // ¡ESTE ES EL CAMBIO CLAVE!
      // Llamamos a nuestro propio endpoint, que se encargará de la lógica de envío.
      const response = await fetch("/api/whatsapp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: recipient, message: message }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "El envío del mensaje falló.");
      }

      toast({
        title: "¡Éxito!",
        description: `Mensaje enviado a ${recipient}.`,
      });
      setMessage("");
      setRecipient("");

    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: (error as Error).message,
      });
    } finally {
      setIsSending(false);
    }
  };

  const quickMessages = [
    "Su pedido está listo para retirar.",
    "Recordatorio: Su pedido será entregado mañana.",
    "¡Gracias por su compra! ¿Cómo calificaría nuestro servicio?",
    "Nuevos productos disponibles esta semana.",
  ];

  return (
    <div className="space-y-6">
        <Toaster />
      <Card>
        <CardHeader>
          <CardTitle>Enviar Mensaje Manual</CardTitle>
          <CardDescription>Envía mensajes directos a tus clientes por WhatsApp.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Número de teléfono (ej: 5491123456789)"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
          />
          <Textarea
            placeholder="Escribe tu mensaje..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
          />
          <div className="flex flex-wrap gap-2">
            {quickMessages.map((msg, index) => (
              <Button key={index} variant="outline" size="sm" onClick={() => setMessage(msg)}>
                {msg}
              </Button>
            ))}
          </div>
          <Button onClick={handleSendMessage} disabled={isSending} className="w-full">
            {isSending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
            {isSending ? "Enviando..." : "Enviar Mensaje"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}