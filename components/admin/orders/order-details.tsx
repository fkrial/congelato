"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Printer, Mail, Phone, MapPin, User, Package, BarChart, Download, MessageCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Label } from "@/components/ui/label";

const formatCurrency = (value: any) => `€${(parseFloat(value) || 0).toFixed(2)}`;
const formatDate = (dateString: any) => {
    if (!dateString) return "Fecha no disponible";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Fecha inválida" : date.toLocaleString('es-ES');
};

const statusConfig: { [key: string]: { label: string; color: string; } } = {
  pending: { label: "Pendiente", color: "bg-yellow-100 text-yellow-800" },
  confirmed: { label: "Confirmado", color: "bg-blue-100 text-blue-800" },
  in_production: { label: "En Producción", color: "bg-purple-100 text-purple-800" },
  ready: { label: "Listo", color: "bg-green-100 text-green-800" },
  delivered: { label: "Entregado", color: "bg-gray-100 text-gray-800" },
  cancelled: { label: "Cancelado", color: "bg-red-100 text-red-800" },
};

export function OrderDetails({ initialOrder }: { initialOrder: any }) {
  const [order, setOrder] = useState<any>(initialOrder);
  const router = useRouter();
  const { toast } = useToast();
  const orderId = order.id;

  const handleStatusChange = async (newStatus: string) => {
    try {
        const res = await fetch(`/api/orders/${orderId}`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newStatus }),
        });
        if (!res.ok) throw new Error("No se pudo actualizar el estado.");
        const updatedOrderData = await res.json();
        setOrder(prev => ({ ...prev, status: updatedOrderData.order.status }));
        toast({ title: 'Éxito', description: 'Estado del pedido actualizado.' });
    } catch (error) {
        toast({ variant: 'destructive', title: 'Error', description: (error as Error).message });
    }
  };

  const handleSendWhatsApp = () => {
    if (!order || !order.phone) {
        toast({ variant: "destructive", title: "Error", description: "El cliente no tiene un número de teléfono registrado." });
        return;
    }
    // *** LA CORRECCIÓN ESTÁ AQUÍ ***
    const orderLink = `${window.location.origin}/public-order/${order.id}`; // Apunta a la nueva ruta pública
    const message = `¡Hola ${order.first_name || 'cliente'}! Aquí tienes los detalles de tu pedido #${order.order_number}: ${orderLink}`;
    const whatsappUrl = `https://wa.me/${order.phone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };
  
  if (!order) return <div className="text-center">Pedido no encontrado o inválido.</div>;
  
  const status = statusConfig[order.status] || { label: 'Desconocido', color: 'bg-gray-200' };
  const margin = (parseFloat(order.total) > 0 && order.profit) ? (parseFloat(order.profit) / parseFloat(order.total)) * 100 : 0;

  return (
    <div className="space-y-6">
        <Toaster />
      <div className="flex items-center justify-between">
          <div>
            <Button variant="ghost" className="mb-4" onClick={() => router.back()}><ArrowLeft className="w-4 h-4 mr-2" />Volver a Pedidos</Button>
            <h1 className="text-2xl font-serif font-bold text-gray-900">Pedido {order.order_number || `#${order.id}`}</h1>
            <p className="text-gray-600">Creado el {formatDate(order.created_at)}</p>
          </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSendWhatsApp}><MessageCircle className="w-4 h-4 mr-2" />Enviar</Button>
          <Button variant="outline" size="sm" onClick={() => window.open(`/api/orders/${order.id}/pdf`, '_blank')}><Download className="w-4 h-4 mr-2" />PDF</Button>
          <Button variant="outline" size="sm"><Printer className="w-4 h-4 mr-2" />Imprimir</Button>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center justify-between"><span>Estado del Pedido</span><Badge className={status.color}>{status.label}</Badge></CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <Select value={order.status} onValueChange={handleStatusChange}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{Object.keys(statusConfig).map(s => <SelectItem key={s} value={s}>{statusConfig[s].label}</SelectItem>)}</SelectContent></Select>
              <div><Label>Notas del Pedido:</Label><Textarea value={order.notes || ''} readOnly className="mt-1 bg-gray-50" rows={2}/></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Package className="w-5 h-5" />Productos</CardTitle></CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {order.items?.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between py-3 border-b last:border-0">
                            <div className="flex-1">
                                <h4 className="font-medium">{item.product_name} {item.variant_name && `(${item.variant_name})`}</h4>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                                <span className="text-gray-600">{item.quantity} × {formatCurrency(item.unit_price)}</span>
                                <span className="font-medium min-w-[80px] text-right">{formatCurrency(item.total_price)}</span>
                            </div>
                        </div>
                    ))}
                    <Separator className="my-4" />
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm"><span className="text-gray-600">Subtotal:</span><span>{formatCurrency(order.subtotal)}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-gray-600">Descuento:</span><span>-{formatCurrency(order.discount)}</span></div>
                        <div className="flex justify-between text-sm"><span className="text-gray-600">Impuestos:</span><span>+{formatCurrency(order.tax)}</span></div>
                        <Separator />
                        <div className="flex justify-between font-medium text-lg"><span>Total:</span><span>{formatCurrency(order.total)}</span></div>
                    </div>
                </div>
            </CardContent>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><BarChart className="w-5 h-5"/>Análisis de Rentabilidad</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm"><span className="text-gray-600">Venta Total:</span><span className="font-medium">{formatCurrency(order.total)}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-600">Costo Total:</span><span className="font-medium">-{formatCurrency(order.total_cost)}</span></div>
              <Separator />
              <div className="flex justify-between font-bold"><span className="text-green-600">Ganancia:</span><span className="text-green-600">{formatCurrency(order.profit)}</span></div>
              <div className="flex justify-between items-center text-sm"><span className="text-gray-600">Margen:</span><Badge variant={margin > 40 ? "default" : "secondary"} className={margin > 40 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>{margin.toFixed(1)}%</Badge></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><User className="w-5 h-5" />Cliente</CardTitle></CardHeader>
            <CardContent className="space-y-3">
                <div className="font-medium">{order.first_name || 'N/A'} {order.last_name}</div>
                <div className="flex items-center gap-3 text-sm text-gray-600"><Mail className="w-4 h-4" /><span>{order.email || 'N/A'}</span></div>
                <div className="flex items-center gap-3 text-sm text-gray-600"><Phone className="w-4 h-4" /><span>{order.phone || 'N/A'}</span></div>
                <div className="flex items-start gap-3 text-sm text-gray-600"><MapPin className="w-4 h-4 mt-0.5" /><span>{order.address || 'N/A'}</span></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}