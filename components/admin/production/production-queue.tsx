"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Clock, Users, Package } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { EditProductionItemForm } from "./edit-production-item-form"; // Importamos el nuevo formulario

interface ProductionItem {
    id: number;
    product_name: string;
    quantity_needed: number;
    priority: number;
    assigned_to: string;
    status: string;
    progress: number;
}

interface ProductionQueueProps {
    queue: ProductionItem[];
    onDataChange: () => void;
}

export function ProductionQueue({ queue, onDataChange }: ProductionQueueProps) {
    const { toast } = useToast();

    const handleStatusUpdate = async (itemId: number, status: string, progress?: number) => {
        try {
            const res = await fetch(`/api/production/items/${itemId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status, progress })
            });
            if (!res.ok) throw new Error("No se pudo actualizar el lote.");
            toast({ title: "Éxito", description: "Lote de producción actualizado." });
            onDataChange();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: (error as Error).message });
        }
    };
  
    const getPriorityBadge = (priority: number) => {
        if (priority === 1) return <Badge variant="destructive">Alta</Badge>;
        if (priority === 2) return <Badge variant="secondary">Media</Badge>;
        return <Badge variant="outline">Baja</Badge>;
    };

    const getStatusBadge = (status: string) => {
        if (status === 'in-progress') return <Badge>En Proceso</Badge>;
        if (status === 'waiting') return <Badge variant="secondary">Esperando</Badge>;
        if (status === 'completed') return <Badge className="bg-green-100 text-green-800">Completado</Badge>;
        return <Badge variant="outline">Programado</Badge>;
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Cola de Producción para Hoy</CardTitle>
            </CardHeader>
            <CardContent>
                {queue.length === 0 ? (
                    <p className="text-center text-gray-500 p-8">No hay nada programado para producir hoy.</p>
                ) : (
                    <div className="space-y-4">
                        {queue.map((item) => (
                            <div key={item.id} className="border rounded-lg p-4 space-y-3">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium">{item.product_name}</h4>
                                    <div className="flex gap-2">
                                        {getPriorityBadge(item.priority)}
                                        {getStatusBadge(item.status)}
                                    </div>
                                </div>
                                <div className="grid grid-cols-3 gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Package className="h-4 w-4 text-muted-foreground" />
                                        <span>{item.quantity_needed} unidades</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span>{item.estimated_time || 'N/A'}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4 text-muted-foreground" />
                                        <span>{item.assigned_to || 'N/A'}</span>
                                    </div>
                                </div>
                                {(item.status === "in-progress" || item.status === "completed") && (
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>Progreso</span>
                                            <span>{item.progress}%</span>
                                        </div>
                                        <Progress value={item.progress} className="h-2" />
                                    </div>
                                )}
                                <div className="flex gap-2 pt-2 border-t">
                                    {item.status === 'scheduled' && <Button size="sm" variant="outline" onClick={() => handleStatusUpdate(item.id, 'in-progress', 10)}>Iniciar</Button>}
                                    {item.status === 'in-progress' && <Button size="sm" onClick={() => handleStatusUpdate(item.id, 'completed', 100)}>Completar</Button>}
                                    {/* Componente de Edición */}
                                    <EditProductionItemForm item={item} onItemUpdated={onDataChange} />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}