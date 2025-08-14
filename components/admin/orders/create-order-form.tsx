"use client"

import type React from "react"
import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ArrowLeft, Save, Plus, Trash2, CalendarIcon, Calculator, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface OrderItem {
  id: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  notes: string
}

interface Product {
    id: string;
    name: string;
    base_price: number;
    category_id: number;
}

export function CreateOrderForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [deliveryDate, setDeliveryDate] = useState<Date>();
  const [customerData, setCustomerData] = useState({ name: "", email: "", phone: "", address: "", type: "retail" });
  const [orderData, setOrderData] = useState({ deliveryTime: "", deliveryAddress: "", paymentMethod: "cash", notes: "" });
  const [items, setItems] = useState<OrderItem[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
        try {
            // Asumimos que tienes un endpoint para obtener productos
            const res = await fetch('/api/products'); // Necesitarás crear este endpoint
            const data = await res.json();
            setProducts(data.products || []);
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: 'No se pudieron cargar los productos.' });
        }
    };
    // fetchProducts(); // Descomentar cuando el endpoint de productos exista
  }, [toast]);

  // Usamos mock data mientras no exista el endpoint de productos
  const mockProducts: Product[] = [
    { id: "1", name: "Pan Integral Artesanal", base_price: 3.5, category_id: 1 },
    { id: "2", name: "Croissant de Mantequilla", base_price: 2.8, category_id: 4 },
    { id: "3", name: "Tarta de Chocolate Premium", base_price: 25.0, category_id: 2 },
  ];
  useEffect(() => { setProducts(mockProducts) }, []);


  const { subtotal, total } = useMemo(() => {
    const sub = items.reduce((sum, item) => sum + item.totalPrice, 0);
    // Lógica de impuestos/descuentos aquí si es necesario
    return { subtotal: sub, total: sub };
  }, [items]);

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), productId: "", productName: "", quantity: 1, unitPrice: 0, totalPrice: 0, notes: "" }]);
  };

  const updateItem = (id: string, field: keyof OrderItem, value: any) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === "productId") {
          const product = products.find(p => p.id === value);
          if (product) {
            updated.productName = product.name;
            updated.unitPrice = product.base_price;
            updated.totalPrice = product.base_price * updated.quantity;
          }
        }
        if (field === "quantity") {
          updated.totalPrice = updated.unitPrice * Number(value);
        }
        return updated;
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
        toast({ variant: 'destructive', title: 'Error', description: 'El pedido debe tener al menos un producto.' });
        return;
    }
    setIsLoading(true);

    try {
      const orderPayload = {
        customer: customerData,
        items,
        deliveryDate: deliveryDate ? format(deliveryDate, "yyyy-MM-dd") : null,
        deliveryTime: orderData.deliveryTime,
        deliveryAddress: orderData.deliveryAddress || customerData.address,
        paymentMethod: orderData.paymentMethod,
        notes: orderData.notes,
        subtotal,
        total,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al crear el pedido");
      }
      
      toast({ title: 'Éxito', description: 'El pedido ha sido creado correctamente.' });
      router.push("/admin/orders");
      router.refresh();

    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: error instanceof Error ? error.message : "Error desconocido." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
        <Toaster/>
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}><ArrowLeft className="w-4 h-4 mr-2" />Volver</Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Información del Cliente</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="customerName">Nombre Completo *</Label>
                <Input id="customerName" value={customerData.name} onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerType">Tipo de Cliente *</Label>
                <Select value={customerData.type} onValueChange={(value) => setCustomerData({ ...customerData, type: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="retail">Cliente Retail</SelectItem><SelectItem value="wholesale">Cliente Mayorista</SelectItem></SelectContent></Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerEmail">Email</Label>
                <Input id="customerEmail" type="email" value={customerData.email} onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="customerPhone">Teléfono *</Label>
                <Input id="customerPhone" value={customerData.phone} onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })} required/>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerAddress">Dirección</Label>
              <Textarea id="customerAddress" value={customerData.address} onChange={(e) => setCustomerData({ ...customerData, address: e.target.value })} rows={2}/>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between"><CardTitle>Productos del Pedido</CardTitle><Button type="button" variant="outline" size="sm" onClick={addItem}><Plus className="w-4 h-4 mr-2" />Agregar Producto</Button></CardHeader>
          <CardContent className="space-y-4">
            {items.map((item) => (
              <div key={item.id} className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 border rounded-lg">
                <div className="md:col-span-2 space-y-2">
                  <Label>Producto</Label>
                  <Select value={item.productId} onValueChange={(value) => updateItem(item.id, "productId", value)}><SelectTrigger><SelectValue placeholder="Seleccionar producto" /></SelectTrigger><SelectContent>{products.map((product) => (<SelectItem key={product.id} value={product.id}><div className="flex items-center justify-between w-full"><span>{product.name}</span><Badge variant="outline" className="ml-2">€{product.base_price.toFixed(2)}</Badge></div></SelectItem>))}</SelectContent></Select>
                </div>
                <div className="space-y-2"><Label>Cantidad</Label><Input type="number" min="1" value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", Number(e.target.value) || 1)}/></div>
                <div className="space-y-2"><Label>Precio Unit.</Label><Input value={`€${item.unitPrice.toFixed(2)}`} disabled className="bg-gray-50" /></div>
                <div className="space-y-2"><Label>Total</Label><Input value={`€${item.totalPrice.toFixed(2)}`} disabled className="bg-gray-50" /></div>
                <div className="flex items-end"><Button type="button" variant="ghost" size="sm" onClick={() => removeItem(item.id)} className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></Button></div>
                {item.productId && (<div className="md:col-span-6 space-y-2"><Label>Notas del Producto</Label><Input value={item.notes} onChange={(e) => updateItem(item.id, "notes", e.target.value)} placeholder="Instrucciones especiales..."/></div>)}
              </div>
            ))}
            {items.length > 0 && (
              <div className="bg-gray-50 rounded-lg p-4"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Calculator className="w-4 h-4 text-gray-500" /><span className="font-medium text-gray-700">Resumen</span></div><div className="text-right"><div className="text-sm text-gray-600">Subtotal: €{subtotal.toFixed(2)}</div><div className="text-lg font-bold text-gray-900">Total: €{total.toFixed(2)}</div></div></div></div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Información de Entrega</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Fecha de Entrega</Label>
                <Popover><PopoverTrigger asChild><Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent"><CalendarIcon className="mr-2 h-4 w-4" />{deliveryDate ? format(deliveryDate, "dd/MM/yyyy", { locale: es }) : "Seleccionar fecha"}</Button></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={deliveryDate} onSelect={setDeliveryDate} initialFocus /></PopoverContent></Popover>
              </div>
              <div className="space-y-2"><Label htmlFor="deliveryTime">Hora de Entrega</Label><Input id="deliveryTime" type="time" value={orderData.deliveryTime} onChange={(e) => setOrderData({ ...orderData, deliveryTime: e.target.value })}/></div>
            </div>
            <div className="space-y-2"><Label htmlFor="deliveryAddress">Dirección de Entrega</Label><Textarea id="deliveryAddress" value={orderData.deliveryAddress} onChange={(e) => setOrderData({ ...orderData, deliveryAddress: e.target.value })} placeholder="Diferente a la del cliente..." rows={2}/></div>
            <div className="space-y-2"><Label htmlFor="paymentMethod">Método de Pago *</Label><Select value={orderData.paymentMethod} onValueChange={(value) => setOrderData({ ...orderData, paymentMethod: value })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="cash">Efectivo</SelectItem><SelectItem value="card">Tarjeta</SelectItem><SelectItem value="transfer">Transferencia</SelectItem><SelectItem value="pending">Pendiente</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label htmlFor="orderNotes">Notas del Pedido</Label><Textarea id="orderNotes" value={orderData.notes} onChange={(e) => setOrderData({ ...orderData, notes: e.target.value })} rows={3}/></div>
          </CardContent>
        </Card>

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={isLoading || items.length === 0} className="bg-primary hover:bg-primary/90"><Save className="w-4 h-4 mr-2" />{isLoading ? "Creando Pedido..." : "Crear Pedido"}</Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
        </div>
      </form>
    </div>
  )
}