"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { WhatsAppPanel } from "@/components/admin/integrations/whatsapp-panel";
import { MercadoPagoPanel } from "@/components/admin/integrations/mercadopago-panel";
import { MessageCircle, CreditCard } from "lucide-react";

export function IntegrationsClientPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Integraciones</h1>
                <p className="text-gray-600">Conecta tu panadería con servicios externos.</p>
            </div>
            <Tabs defaultValue="whatsapp" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="whatsapp" className="flex items-center space-x-2">
                        <MessageCircle className="h-4 w-4" />
                        <span>WhatsApp</span>
                    </TabsTrigger>
                    <TabsTrigger value="mercadopago" className="flex items-center space-x-2">
                        <CreditCard className="h-4 w-4" />
                        <span>MercadoPago</span>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="whatsapp">
                    <WhatsAppPanel />
                </TabsContent>
                <TabsContent value="mercadopago">
                    <MercadoPagoPanel />
                </TabsContent>
            </Tabs>
        </div>
    );
}