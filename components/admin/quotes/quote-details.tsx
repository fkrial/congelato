"use client"

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, ArrowLeft, Printer, Download } from "lucide-react"; // Se añade Download
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

const formatCurrency = (value: any) => {
    const number = parseFloat(value);
    return isNaN(number) ? "€0.00" : `€${number.toFixed(2)}`;
};

const formatDate = (dateString: any) => {
    if (!dateString) return "No especificada";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Fecha inválida" : date.toLocaleDateString('es-ES');
};

export function QuoteDetails() {
    const [quote, setQuote] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const quoteId = params.id as string;

    useEffect(() => {
        if (quoteId) {
            const fetchQuote = async () => {
                try {
                    const res = await fetch(`/api/quotes/${quoteId}`);
                    if (!res.ok) throw new Error("Presupuesto no encontrado.");
                    const data = await res.json();
                    setQuote(data);
                } catch (error) {
                    toast({ variant: "destructive", title: "Error", description: (error as Error).message });
                } finally {
                    setIsLoading(false);
                }
            };
            fetchQuote();
        }
    }, [quoteId, toast]);
    
    const handleDownloadPDF = () => {
        if (!quoteId) return;
        window.open(`/api/quotes/${quoteId}/pdf`, '_blank');
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    if (!quote) return <p>Presupuesto no encontrado.</p>;

    return (
        <div className="space-y-6">
            <Toaster />
            <div>
                <Button variant="ghost" onClick={() => router.back()}><ArrowLeft className="w-4 h-4 mr-2" />Volver</Button>
            </div>
            <Card>
                <CardHeader>
                    <div className="flex justify-between items-start">
                        <div>
                            <CardTitle>Presupuesto #{quote.quote_number}</CardTitle>
                            <CardDescription>Creado el {formatDate(quote.created_at)}, válido hasta {formatDate(quote.valid_until)}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                           <Button onClick={handleDownloadPDF} variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Descargar PDF</Button>
                           <Button variant="outline" size="sm"><Printer className="w-4 h-4 mr-2" />Imprimir</Button>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <h3 className="font-semibold">Cliente</h3>
                            <p>{quote.customer_name}</p>
                            <p className="text-sm text-gray-500">{quote.customer_email}</p>
                        </div>
                         <div>
                            <h3 className="font-semibold">Estado</h3>
                            <p className="capitalize">{quote.status}</p>
                        </div>
                    </div>
                    <Table>
                        <TableHeader>
                            <TableRow><TableHead>Producto</TableHead><TableHead className="text-center">Cantidad</TableHead><TableHead className="text-right">Precio Unit.</TableHead><TableHead className="text-right">Total</TableHead></TableRow>
                        </TableHeader>
                        <TableBody>
                            {quote.items?.map((item: any) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.product_name || `Producto ID ${item.product_id}`}</TableCell>
                                    <TableCell className="text-center">{item.quantity}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(item.unit_price)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(item.total_price)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <div className="text-right font-bold text-xl mt-4">
                        Total Presupuestado: {formatCurrency(quote.total_amount)}
                    </div>
                    {quote.notes && <div className="mt-6"><h3 className="font-semibold">Notas Adicionales</h3><p className="text-sm text-gray-600 mt-2 p-3 bg-gray-50 rounded-md">{quote.notes}</p></div>}
                </CardContent>
            </Card>
        </div>
    );
}