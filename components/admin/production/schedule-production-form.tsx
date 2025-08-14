"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Plus } from "lucide-react";

interface Product {
    id: number;
    name: string;
}

interface ScheduleProductionFormProps {
    onProductionScheduled: () => void;
}

export function ScheduleProductionForm({ onProductionScheduled }: ScheduleProductionFormProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [formData, setFormData] = useState({
        productId: "",
        quantity: "",
        date: new Date().toISOString().split('T')[0], // Default a hoy
    });
    const { toast } = useToast();

    useEffect(() => {
        // En una app real, cargaríamos los productos desde la API
        if (open) {
            setProducts([
                { id: 1, name: "Pan Integral" },
                { id: 2, name: "Croissant de Mantequilla" },
                { id: 3, name: "Tarta de Chocolate" },
            ]);
        }
    }, [open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch('/api/production/plans', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    date: formData.date,
                    productId: parseInt(formData.productId),
                    quantity: parseInt(formData.quantity)
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "No se pudo programar la producción.");
            }
            
            toast({ title: "Éxito", description: "Lote de producción programado." });
            onProductionScheduled(); // Avisa al padre para que recargue
            setOpen(false); // Cierra el diálogo
        } catch (error) {
            toast({ variant: 'destructive', title: "Error", description: (error as Error).message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-full bg-transparent" variant="outline">
                    <Plus className="h-4 w-4 mr-2" />
                    Programar Producción
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Programar Nuevo Lote de Producción</DialogTitle>
                    <DialogDescription>
                        Añade un nuevo ítem a la cola de producción para una fecha específica.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="date">Fecha de Producción</Label>
                        <Input 
                            id="date" 
                            type="date" 
                            value={formData.date}
                            onChange={(e) => setFormData(p => ({ ...p, date: e.target.value }))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="product">Producto</Label>
                        <Select value={formData.productId} onValueChange={(value) => setFormData(p => ({ ...p, productId: value }))}>
                            <SelectTrigger id="product">
                                <SelectValue placeholder="Selecciona un producto..." />
                            </SelectTrigger>
                            <SelectContent>
                                {products.map(p => <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="quantity">Cantidad a Producir</Label>
                        <Input 
                            id="quantity" 
                            type="number" 
                            min="1"
                            value={formData.quantity}
                            onChange={(e) => setFormData(p => ({ ...p, quantity: e.target.value }))}
                            placeholder="Ej: 50"
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Programar
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}