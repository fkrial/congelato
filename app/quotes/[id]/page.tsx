import { notFound } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Printer } from 'lucide-react';

async function getQuoteData(id: string) {
    // En una app real, la URL vendría de una variable de entorno
    const res = await fetch(`http://localhost:3000/api/quotes/${id}`, { cache: 'no-store' });
    if (!res.ok) return undefined;
    return res.json();
}

const formatCurrency = (value: any) => {
    const number = parseFloat(value);
    return isNaN(number) ? "€0.00" : `€${number.toFixed(2)}`;
};

const formatDate = (dateString: any) => {
    if (!dateString) return "No especificada";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Fecha inválida" : date.toLocaleDateString('es-ES');
};

export default async function PublicQuotePage({ params }: { params: { id: string } }) {
    const quote = await getQuoteData(params.id);

    if (!quote) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8 flex items-center justify-center">
            <main className="w-full max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-lg shadow-lg">
                <header className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Presupuesto</h1>
                        <p className="text-gray-500">{quote.quote_number}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-semibold">Panadería Artesanal</h2>
                        <p className="text-sm text-gray-600">Calle del Pan 123, Madrid</p>
                    </div>
                </header>

                <section className="grid grid-cols-2 gap-4 mb-8">
                    <div>
                        <h3 className="font-semibold text-gray-700 mb-2">Presupuesto Para:</h3>
                        <p>{quote.customer_name}</p>
                        <p className="text-sm text-gray-500">{quote.customer_email}</p>
                    </div>
                    <div className="text-right">
                        <h3 className="font-semibold text-gray-700 mb-2">Fecha de Emisión:</h3>
                        <p>{formatDate(quote.created_at)}</p>
                        <h3 className="font-semibold text-gray-700 mt-2 mb-2">Válido Hasta:</h3>
                        <p>{formatDate(quote.valid_until)}</p>
                    </div>
                </section>

                <section>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Producto</TableHead>
                                <TableHead className="text-center">Cantidad</TableHead>
                                <TableHead className="text-right">Precio Unitario</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {quote.items?.map((item: any) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.product_name}</TableCell>
                                    <TableCell className="text-center">{item.quantity}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(item.unit_price)}</TableCell>
                                    <TableCell className="text-right">{formatCurrency(item.total_price)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </section>

                <footer className="mt-8">
                    <div className="flex justify-end">
                        <div className="w-full max-w-xs space-y-2">
                           <div className="flex justify-between font-bold text-xl">
                                <span>Total:</span>
                                <span>{formatCurrency(quote.total_amount)}</span>
                           </div>
                        </div>
                    </div>
                     {quote.notes && (
                        <div className="mt-6 border-t pt-4">
                            <h3 className="font-semibold">Notas Adicionales</h3>
                            <p className="text-sm text-gray-600 mt-1">{quote.notes}</p>
                        </div>
                    )}
                </footer>
            </main>
        </div>
    );
}