"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MoreHorizontal, Eye, Send, CheckCircle, Trash2, Download } from "lucide-react"; // Se añade Download
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'draft': return <Badge variant="secondary">Borrador</Badge>;
        case 'sent': return <Badge className="bg-blue-100 text-blue-800">Enviado</Badge>;
        case 'accepted': return <Badge className="bg-green-100 text-green-800">Aceptado</Badge>;
        case 'rejected': return <Badge variant="destructive">Rechazado</Badge>;
        case 'converted': return <Badge>Convertido</Badge>;
        default: return <Badge variant="outline">{status}</Badge>;
    }
};

export default function QuotesDashboard({ initialQuotes, onDataChange }: { initialQuotes: any[], onDataChange: () => void }) {
  const [quotes, setQuotes] = useState(initialQuotes);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    setQuotes(initialQuotes);
  }, [initialQuotes]);

  const handleStatusUpdate = async (quoteId: number, status: string) => {
    try {
      const res = await fetch(`/api/quotes/${quoteId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error('No se pudo actualizar el estado.');
      
      toast({ title: "Éxito", description: "Estado del presupuesto actualizado." });
      
      if (status === 'sent') {
        const quote = quotes.find(q => q.id === quoteId);
        const quoteLink = `${window.location.origin}/quotes/${quoteId}`;
        const message = `¡Hola ${quote?.customer_name || 'cliente'}! Aquí tienes tu presupuesto de Panadería Artesanal. Puedes verlo en: ${quoteLink}`;
        const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
      }
      onDataChange();
    } catch (error) {
      toast({ variant: 'destructive', title: "Error", description: (error as Error).message });
    }
  };

  const handleConvertToOrder = async (quoteId: number) => {
    try {
      const res = await fetch(`/api/quotes/${quoteId}/convert`, { method: 'POST' });
      if (!res.ok) throw new Error('No se pudo convertir a pedido');
      toast({ title: "Éxito", description: "Presupuesto convertido a pedido." });
      onDataChange();
    } catch (error) {
      toast({ variant: 'destructive', title: "Error", description: (error as Error).message });
    }
  };

  const handleDelete = async (quoteId: number) => {
      // Implementación de borrado (simulada)
      console.log("Borrando presupuesto:", quoteId);
      toast({ title: "Acción no implementada", description: "La funcionalidad de borrado aún no está conectada." });
      // onDataChange(); // Descomentar cuando la API DELETE esté lista
  }
  
  return (
    <Card>
      <Toaster />
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Listado de Presupuestos</CardTitle>
        <Button asChild><Link href="/admin/quotes/new">Nuevo Presupuesto</Link></Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead><TableHead>Cliente</TableHead><TableHead>Estado</TableHead><TableHead>Total</TableHead><TableHead>Válido Hasta</TableHead><TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {quotes.map((quote: any) => (
              <TableRow key={quote.id}>
                <TableCell className="font-medium">{quote.quote_number}</TableCell>
                <TableCell>{quote.customer_name}</TableCell>
                <TableCell>{getStatusBadge(quote.status)}</TableCell>
                <TableCell>€{parseFloat(quote.total_amount).toFixed(2)}</TableCell>
                <TableCell>{new Date(quote.valid_until).toLocaleDateString()}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => router.push(`/admin/quotes/${quote.id}`)}><Eye className="mr-2 h-4 w-4" />Ver Detalles</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => window.open(`/api/quotes/${quote.id}/pdf`, '_blank')}><Download className="mr-2 h-4 w-4" />Descargar PDF</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => handleStatusUpdate(quote.id, 'sent')}><Send className="mr-2 h-4 w-4" />Marcar y Enviar</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusUpdate(quote.id, 'accepted')}><CheckCircle className="mr-2 h-4 w-4" />Marcar Aceptado</DropdownMenuItem>
                      {quote.status === 'accepted' && <DropdownMenuItem onClick={() => handleConvertToOrder(quote.id)}><CheckCircle className="mr-2 h-4 w-4" />Convertir a Pedido</DropdownMenuItem>}
                      <DropdownMenuSeparator />
                      <AlertDialog>
                          <AlertDialogTrigger asChild><DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600"><Trash2 className="mr-2 h-4 w-4" />Borrar</DropdownMenuItem></AlertDialogTrigger>
                          <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Confirmas la eliminación?</AlertDialogTitle><AlertDialogDescription>Esta acción es irreversible.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(quote.id)}>Sí, borrar</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}