"use client"

import { useState, useEffect, useCallback } from "react";
import { Loader2 } from "lucide-react";
import QuotesDashboard from "@/components/admin/quotes/quotes-dashboard";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

// Cambiamos el nombre de la función para que coincida con el nuevo nombre de archivo
export function QuotesClientPageContent() {
    const [quotes, setQuotes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const { toast } = useToast();

    const fetchQuotes = useCallback(async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/quotes');
            
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "No se pudieron cargar los presupuestos.");
            }
            
            const data = await res.json();
            setQuotes(data.quotes || []);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error de Carga",
                description: (error as Error).message,
            });
            setQuotes([]);
        } finally {
            setIsLoading(false);
        }
    }, [toast]); // useCallback para evitar re-crear la función

    // Fetch inicial
    useEffect(() => {
        fetchQuotes();
    }, [fetchQuotes]);

    // Recarga al volver a la página
    useEffect(() => {
        const handleFocus = () => {
            fetchQuotes();
        };

        window.addEventListener('focus', handleFocus);
        return () => {
            window.removeEventListener('focus', handleFocus);
        };
    }, [fetchQuotes]);

    return (
        <div className="space-y-6">
            <Toaster />
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Presupuestos</h1>
                <p className="text-gray-600">Gestiona cotizaciones y conviértelas en pedidos</p>
            </div>
            {isLoading ? (
                <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : (
                <QuotesDashboard initialQuotes={quotes} onDataChange={fetchQuotes} />
            )}
        </div>
    );
}