"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
// *** LA CORRECCIÓN ESTÁ AQUÍ ***
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Plus, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Product {
    id: string;
    name: string;
    base_price: number;
}

interface QuoteItem {
    id: string;
    productId: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export function QuoteForm() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState<Product[]>([]);
    const [customerData, setCustomerData] = useState({ name: "", email: "" });
    const [items, setItems] = useState<QuoteItem[]>([]);
    const [notes, setNotes] = useState("");
    const [validUntil, setValidUntil] = useState("");

    useEffect(() => {
        setProducts([
            { id: "1", name: "Pan Integral", base_price: 3.50 },
            { id: "2", name: "Croissant de Mantequilla", base_price: 2.80 },
            { id: "3", name: "Tarta de Chocolate", base_price: 25.00 },
        ]);
        const today = new Date();
        today.setDate(today.getDate() + 7);
        setValidUntil(today.toISOString().split('T')[0]);
    }, []);

    const total = items.reduce((sum, item) => sum + item.totalPrice, 0);

    const addItem = () => {
        setItems([...items, { id: Date.now().toString(), productId: "", productName: "", quantity: 1, unitPrice: 0, totalPrice: 0 }]);
    };
    
    const updateItem = (id: string, field: keyof QuoteItem, value: any) => {
        setItems(prev => prev.map(item => {
            if (item.id === id) {
                const updated = { ...item, [field]: value };
                if (field === "productId") {
                    const product = products.find(p => p.id === value);
                    if (product) {
                        updated.productName = product.name;
                        updated.unitPrice = product.base_price;
                    }
                }
                updated.totalPrice = updated.unitPrice * updated.quantity;
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
        setIsLoading(true);
        try {
            const res = await fetch('/api/quotes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ customer: customerData, items, total, notes, valid_until: validUntil })
            });
            if (!res.ok) throw new Error("No se pudo crear el presupuesto.");
            toast({ title: "Éxito", description: "Presupuesto creado." });
            router.push('/admin/quotes');
            router.refresh();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: (error as Error).message });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Toaster />
            <Card>
                <CardHeader>
                    <CardTitle>Datos del Cliente</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="customerName">Nombre Cliente *</Label>
                            <Input id="customerName" value={customerData.name} onChange={(e) => setCustomerData(p => ({ ...p, name: e.target.value }))} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="customerEmail">Email Cliente</Label>
                            <Input id="customerEmail" type="email" value={customerData.email} onChange={(e) => setCustomerData(p => ({ ...p, email: e.target.value }))} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle className="flex justify-between items-center">Productos <Button type="button" size="sm" variant="outline" onClick={addItem}><Plus className="w-4 h-4 mr-2" />Añadir</Button></CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {items.map(item => (
                        <div key={item.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                             <div className="space-y-2 md:col-span-2"><Label>Producto</Label><Select value={item.productId} onValueChange={(v) => updateItem(item.id, "productId", v)}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent>{products.map(p=><SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select></div>
                             <div className="space-y-2"><Label>Cantidad</Label><Input type="number" value={item.quantity} onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value))} min="1" /></div>
                             <div className="space-y-2"><Label>Precio Unit.</Label><Input type="number" value={item.unitPrice} onChange={(e) => updateItem(item.id, "unitPrice", parseFloat(e.target.value))} step="0.01" /></div>
                             <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(item.id)} className="text-red-500"><Trash2 className="w-4 h-4" /></Button>
                        </div>
                    ))}
                     <div className="text-right font-bold text-lg pt-4 border-t">Total: €{total.toFixed(2)}</div>
                </CardContent>
            </Card>

             <Card>
                <CardHeader><CardTitle>Condiciones</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="validUntil">Válido Hasta</Label>
                            <Input id="validUntil" type="date" value={validUntil} onChange={(e) => setValidUntil(e.target.value)} />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="notes">Notas</Label>
                        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <div className="flex gap-4">
                <Button type="submit" disabled={isLoading}>{isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}Guardar</Button>
                <Button type="button" variant="outline" onClick={() => router.back()}><ArrowLeft className="w-4 h-4 mr-2" />Cancelar</Button>
            </div>
        </form>
    );
}