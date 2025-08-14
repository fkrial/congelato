"use client";

import { useState } from "react";
// Importamos la función para generar el ID
import { useCart, generateCartItemId } from "@/context/cart-context"; 
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

export function CartContents() {
  const { cartItems, removeFromCart, updateQuantity, clearCart, itemCount, totalPrice } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
        const itemsForApi = cartItems.map(item => {
            const itemPrice = (parseFloat(item.base_price) || 0) + (item.variant ? (parseFloat(item.variant.price_modifier) || 0) : 0);
            return {
                id: item.id,
                title: item.variant ? `${item.name} (${item.variant.name})` : item.name,
                quantity: item.quantity || 1,
                unit_price: itemPrice,
                picture_url: item.image_url,
            };
        });
        const response = await fetch('/api/mercadopago/create-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: itemsForApi }),
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'Algo salió mal.');
        window.location.href = data.init_point;
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: (error as Error).message });
        setIsLoading(false);
    }
  };

  if (itemCount === 0 && !isLoading) {
    return (
      <div className="text-center py-16">
        <ShoppingBag className="mx-auto h-16 w-16 text-gray-400" />
        <h2 className="mt-4 text-2xl font-semibold">Tu carrito está vacío</h2>
        <p className="mt-2 text-gray-500">Parece que aún no has añadido ningún producto.</p>
        <Button asChild className="mt-6 bg-primary text-white hover:bg-primary/90">
          <Link href="/products">Explorar productos</Link>
        </Button>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
              <CardContent className="p-0">
                  <Table>
                      <TableHeader>
                          <TableRow><TableHead>Producto</TableHead><TableHead>Detalles</TableHead><TableHead className="text-center">Cantidad</TableHead><TableHead className="text-right">Total</TableHead><TableHead></TableHead></TableRow>
                      </TableHeader>
                      <TableBody>
                          {cartItems.map(item => {
                              const cartItemId = generateCartItemId(item.id, item.variant?.id);
                              const price = (parseFloat(item.base_price) || 0) + (item.variant ? (parseFloat(item.variant.price_modifier) || 0) : 0);
                              const quantity = item.quantity || 1;
                              
                              return (
                                <TableRow key={cartItemId}>
                                    <TableCell><img src={item.image_url || "/placeholder.svg?w=100&h=100"} alt={item.name} className="w-20 h-20 object-cover rounded-md" /></TableCell>
                                    <TableCell><div className="font-medium">{item.name}</div>{item.variant && <div className="text-sm text-gray-500">{item.variant.name}</div>}</TableCell>
                                    <TableCell>
                                        <div className="flex justify-center items-center">
                                            <Input
                                                type="number" min="1" value={quantity}
                                                onChange={(e) => updateQuantity(cartItemId, parseInt(e.target.value))}
                                                className="w-16 text-center"
                                            />
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-semibold">€{(price * quantity).toFixed(2)}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => removeFromCart(cartItemId)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                              );
                          })}
                      </TableBody>
                  </Table>
              </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-1">
          <Card>
            <CardHeader><CardTitle>Resumen del Pedido</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal ({itemCount} productos)</span>
                <span>€{totalPrice.toFixed(2)}</span>
              </div>
              <hr />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>€{totalPrice.toFixed(2)}</span>
              </div>
              <Button onClick={handleCheckout} className="w-full bg-primary text-white hover:bg-primary/90" disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 w-4 h-4" />}
                {isLoading ? "Procesando..." : "Finalizar Compra Segura"}
              </Button>
              <Button onClick={clearCart} variant="outline" className="w-full bg-transparent">Vaciar Carrito</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}