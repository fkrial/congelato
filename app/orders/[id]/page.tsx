import { notFound } from 'next/navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getOrderById } from '@/lib/data/orders';

const formatCurrency = (value: any) => `€${(parseFloat(value) || 0).toFixed(2)}`;
const formatDate = (dateString: any) => {
    if (!dateString) return "No especificada";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "Fecha inválida" : date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

export default async function PublicOrderPage({ params }: { params: { id: string } }) {
    // *** LA CORRECCIÓN CLAVE ESTÁ AQUÍ ***
    // Ya no hacemos fetch, llamamos directamente a la base de datos.
    const order = await getOrderById(params.id);
    
    if (!order) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 sm:p-8 flex items-center justify-center">
            <main className="w-full max-w-4xl mx-auto bg-white p-6 sm:p-10 rounded-lg shadow-lg">
                <header className="flex justify-between items-start mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Detalle del Pedido</h1>
                        <p className="text-gray-500">{order.order_number}</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-xl font-semibold">{order.business_name || 'Panadería Artesanal'}</h2>
                        <p className="text-sm text-gray-600">{order.business_address || 'Calle del Pan 123, Madrid'}</p>
                    </div>
                </header>

                <section className="grid grid-cols-2 gap-4 mb-8">
                    <div>
                        <h3 className="font-semibold text-gray-700 mb-2">Cliente:</h3>
                        <p>{order.first_name} {order.last_name}</p>
                        <p className="text-sm text-gray-500">{order.email}</p>
                        <p className="text-sm text-gray-500">{order.phone}</p>
                    </div>
                    <div className="text-right">
                        <h3 className="font-semibold text-gray-700 mb-2">Fecha del Pedido:</h3>
                        <p>{formatDate(order.created_at)}</p>
                        <h3 className="font-semibold text-gray-700 mt-2 mb-2">Fecha de Entrega:</h3>
                        <p>{formatDate(order.delivery_date)}</p>
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
                            {order.items?.map((item: any) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.product_name} {item.variant_name && `(${item.variant_name})`}</TableCell>
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
                           <div className="flex justify-between"><span className="text-gray-600">Subtotal:</span><span>{formatCurrency(order.subtotal)}</span></div>
                           <div className="flex justify-between font-bold text-xl border-t pt-2 mt-2">
                                <span>Total:</span>
                                <span>{formatCurrency(order.total)}</span>
                           </div>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    );
}