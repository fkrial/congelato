"use client"

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Eye, MoreHorizontal, Clock, CheckCircle, AlertCircle, Truck, XCircle, Trash2, Download, MessageCircle } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, DropdownMenuSub, DropdownMenuSubTrigger, DropdownMenuSubContent, DropdownMenuPortal } from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Order {
    id: string; 
    order_number: string; 
    first_name: string; 
    last_name: string;
    phone: string; 
    order_type: string; 
    status: string; 
    total: string;
    delivery_date: string; 
    created_at: string;
}

interface OrdersTableProps {
    orders: Order[];
    onDataChange: () => void;
}

const statusConfig: { [key: string]: { label: string; color: string; icon: React.ElementType } } = {
    pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800", icon: Clock },
    confirmed: { label: "Confirmado", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
    in_production: { label: "En Producción", color: "bg-purple-100 text-purple-800", icon: AlertCircle },
    ready: { label: "Listo", color: "bg-green-100 text-green-800", icon: CheckCircle },
    delivered: { label: "Entregado", color: "bg-gray-100 text-gray-800", icon: Truck },
    cancelled: { label: "Cancelado", color: "bg-red-100 text-red-800", icon: XCircle },
};
const typeConfig: { [key: string]: { label: string; color: string } } = {
    retail: { label: "Retail", color: "bg-blue-50 text-blue-700" },
    wholesale: { label: "Mayorista", color: "bg-purple-50 text-purple-700" },
};

export function OrdersTable({ orders, onDataChange }: OrdersTableProps) {
    const router = useRouter();
    const { toast } = useToast();

    const handleStatusChange = async (orderId: string, newStatus: string) => {
        try {
            const res = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }),
            });
            if (!res.ok) throw new Error("No se pudo actualizar el estado.");
            toast({ title: 'Éxito', description: 'Estado del pedido actualizado.' });
            onDataChange();
        } catch (error) { toast({ variant: 'destructive', title: 'Error', description: 'No se pudo actualizar el estado.' }); }
    };

    const handleDelete = async (orderId: string) => {
        try {
            const res = await fetch(`/api/orders/${orderId}`, { method: 'DELETE' });
            if (!res.ok) throw new Error("No se pudo borrar el pedido.");
            toast({ title: "Éxito", description: "Pedido borrado correctamente." });
            onDataChange();
        } catch (error) { toast({ variant: "destructive", title: "Error", description: "No se pudo borrar el pedido." }); }
    };

    const handleSendWhatsApp = (order: Order) => {
        if (!order.phone) {
            toast({ variant: "destructive", title: "Error", description: "El cliente no tiene un número de teléfono." });
            return;
        }
        const orderLink = `${window.location.origin}/orders/${order.id}`;
        const message = `¡Hola ${order.first_name || 'cliente'}! Tu pedido #${order.order_number} está confirmado. Puedes ver los detalles aquí: ${orderLink}`;
        const whatsappUrl = `https://wa.me/${order.phone}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    };

    if (orders.length === 0) {
        return (
            <Card><CardContent className="p-8 text-center text-gray-500">No se encontraron pedidos.</CardContent></Card>
        );
    }
    
    return (
        <Card>
            <Toaster />
            <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader><TableRow><TableHead>Pedido</TableHead><TableHead>Cliente</TableHead><TableHead>Tipo</TableHead><TableHead>Estado</TableHead><TableHead>Total</TableHead><TableHead>Entrega</TableHead><TableHead>Fecha Pedido</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {orders.map((order) => {
                                const status = statusConfig[order.status] || statusConfig.pending;
                                const type = typeConfig[order.order_type] || typeConfig.retail;
                                const StatusIcon = status.icon;

                                return (
                                    <TableRow key={order.id}>
                                        <TableCell><div className="font-medium text-gray-900">{order.order_number}</div></TableCell>
                                        <TableCell><div><div className="font-medium">{order.first_name} {order.last_name}</div><div className="text-sm text-gray-500">{order.phone}</div></div></TableCell>
                                        <TableCell><Badge className={type.color}>{type.label}</Badge></TableCell>
                                        <TableCell><Badge className={status.color}><StatusIcon className="w-3 h-3 mr-1" />{status.label}</Badge></TableCell>
                                        <TableCell><span className="font-medium">€{parseFloat(order.total).toFixed(2)}</span></TableCell>
                                        <TableCell><div className="font-medium">{new Date(order.delivery_date).toLocaleDateString('es-ES')}</div></TableCell>
                                        <TableCell><span className="text-sm text-gray-500">{new Date(order.created_at).toLocaleString('es-ES')}</span></TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="w-4 h-4" /></Button></DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => router.push(`/admin/orders/${order.id}`)}><Eye className="w-4 h-4 mr-2" />Ver Detalles</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => window.open(`/api/orders/${order.id}/pdf`, '_blank')}><Download className="w-4 h-4 mr-2" />Descargar PDF</DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleSendWhatsApp(order)}><MessageCircle className="w-4 h-4 mr-2" />Enviar WhatsApp</DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuSub>
                                                        <DropdownMenuSubTrigger>Cambiar Estado</DropdownMenuSubTrigger>
                                                        <DropdownMenuPortal><DropdownMenuSubContent>{Object.entries(statusConfig).map(([key, value]) => (<DropdownMenuItem key={key} onClick={() => handleStatusChange(order.id, key)}>{value.label}</DropdownMenuItem>))}</DropdownMenuSubContent></DropdownMenuPortal>
                                                    </DropdownMenuSub>
                                                    <DropdownMenuSeparator />
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">Borrar Pedido</DropdownMenuItem></AlertDialogTrigger>
                                                        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Confirmas la eliminación?</AlertDialogTitle><AlertDialogDescription>El pedido {order.order_number} será eliminado permanentemente.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(order.id)}>Sí, borrar</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                                                    </AlertDialog>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}