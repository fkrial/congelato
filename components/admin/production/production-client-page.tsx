"use client"

import { useState, useEffect, useMemo } from "react";
import { ProductionOverview } from "@/components/admin/production/production-overview";
import { ProductionCalendar } from "@/components/admin/production/production-calendar";
import { ProductionQueue } from "@/components/admin/production/production-queue";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface ProductionItem {
    id: number;
    product_name: string;
    quantity_needed: number;
    priority: number;
    assigned_to: string;
    status: string;
    progress: number;
}

interface ProductionPlan {
    date: string;
    status: string;
    items: ProductionItem[];
}

export function ProductionClientPage() {
    const [plan, setPlan] = useState<ProductionPlan | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchPlan = async (date = new Date()) => {
        setIsLoading(true);
        const dateString = date.toISOString().split('T')[0];
        try {
            const res = await fetch(`/api/production/plans?date=${dateString}`);
            if (!res.ok) throw new Error("No se pudo cargar el plan de producción.");
            const data = await res.json();
            setPlan(data.plan);
        } catch (error) {
            toast({ variant: "destructive", title: "Error", description: (error as Error).message });
            setPlan(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPlan();
    }, []);

    const overviewData = useMemo(() => {
        if (!plan?.items) return { pendingOrders: 0, capacityUsed: 0, timeAvg: "0h", activeAlerts: 0 };
        const itemsInProgress = plan.items.filter((item: any) => item.status === 'in-progress').length;
        return {
            pendingOrders: plan.items.length,
            capacityUsed: 78, // Simulado
            timeAvg: "3.2h", // Simulado
            activeAlerts: itemsInProgress,
        };
    }, [plan]);

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }
    
    return (
        <div className="space-y-6">
            <Toaster />
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Planificador de Producción</h1>
                <p className="text-muted-foreground">Gestiona la programación de producción, capacidad y recursos</p>
            </div>
            
            <ProductionOverview data={overviewData} />

            <div className="grid gap-6 lg:grid-cols-2">
                <ProductionCalendar 
                    schedule={plan?.items || []} 
                    onDateChange={fetchPlan} 
                    onDataChange={fetchPlan} // Pasamos la función para que el formulario pueda recargar
                />
                <ProductionQueue queue={plan?.items || []} onDataChange={fetchPlan} />
            </div>
        </div>
    );
}