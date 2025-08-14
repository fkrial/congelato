"use client"

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Edit } from "lucide-react";

interface ProductionItem {
    id: number;
    product_name: string;
    quantity_needed: number;
    assigned_to: string;
}

interface EditProductionItemFormProps {
    item: ProductionItem;
    onItemUpdated: () => void;
}

export function EditProductionItemForm({ item, onItemUpdated }: EditProductionItemFormProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        quantity_needed: item.quantity_needed,
        assigned_to: item.assigned_to || 'Equipo A',
    });
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await fetch(`/api/production/items/${item.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    quantity_needed: parseInt(String(formData.quantity_needed)),
                    assigned_to: formData.assigned_to
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "No se pudo actualizar el lote.");
            }
            
            toast({ title: "Éxito", description: "Lote de producción actualizado." });
            onItemUpdated();
            setOpen(false);
        } catch (error) {
            toast({ variant: 'destructive', title: "Error", description: (error as Error).message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="ghost"><Edit className="w-4 h-4 mr-2" />Editar</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Lote: {item.product_name}</DialogTitle>
                    <DialogDescription>
                        Ajusta la cantidad a producir o el equipo asignado.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="quantity">Cantidad a Producir</Label>
                        <Input 
                            id="quantity" 
                            type="number" 
                            min="1"
                            value={formData.quantity_needed}
                            onChange={(e) => setFormData(p => ({ ...p, quantity_needed: parseInt(e.target.value) || 0 }))}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="assigned_to">Asignado a</Label>
                         <Input 
                            id="assigned_to"
                            value={formData.assigned_to}
                            onChange={(e) => setFormData(p => ({ ...p, assigned_to: e.target.value }))}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancelar</Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Guardar Cambios
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}