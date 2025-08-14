"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AnalyticsOverview } from "@/components/admin/analytics/analytics-overview";
import { SalesAnalytics } from "@/components/admin/analytics/sales-analytics";
import { CustomerAnalytics } from "@/components/admin/analytics/customer-analytics";

export function AnalyticsClientPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold">Analytics Avanzado</h1>
                <p className="text-gray-600">Análisis completo del rendimiento del negocio</p>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Resumen</TabsTrigger>
                    <TabsTrigger value="sales">Ventas</TabsTrigger>
                    <TabsTrigger value="customers">Clientes</TabsTrigger>
                </TabsList>

                <TabsContent value="overview">
                    <AnalyticsOverview />
                </TabsContent>

                <TabsContent value="sales">
                    <SalesAnalytics />
                </TabsContent>

                <TabsContent value="customers">
                    <CustomerAnalytics />
                </TabsContent>
            </Tabs>
        </div>
    );
}