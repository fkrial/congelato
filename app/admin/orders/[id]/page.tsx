import { OrderDetails } from "@/components/admin/orders/order-details";
import { getOrderById } from "@/lib/data/orders";
import { notFound } from "next/navigation";

// Esta página se ejecuta en el servidor.
// Obtiene los datos del pedido directamente de la base de datos
// y se los pasa al componente de cliente 'OrderDetails'.
export default async function OrderDetailsPage({ params }: { params: { id: string } }) {
  const order = await getOrderById(params.id);
  
  if (!order) {
    notFound();
  }
  
  return (
      <OrderDetails initialOrder={order} />
  );
}