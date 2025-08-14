"use client"

import { useState, useEffect } from "react";
import WholesalePayments from "@/components/admin/orders/wholesale-payments";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

export function WholesalePaymentsClientPage() {
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchWholesaleOrders = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("/api/orders/wholesale");
            if (!response.ok) throw new Error("No se pudieron cargar los datos.");
            const data = await response.json();
            setOrders(data.orders || []);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: (error as Error).message,
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWholesaleOrders();
    }, []);

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <>
            <Toaster />
            <WholesalePayments initialOrders={orders} onDataChange={fetchWholesaleOrders} />
        </>
    );
}