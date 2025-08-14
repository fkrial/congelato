// Ya no se importa NINGÚN layout
import { CreateOrderForm } from "@/components/admin/orders/create-order-form";

export default function NewOrderPage() {
  // Simplemente devuelve el contenido de la página
  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Nuevo Pedido</h1>
        <p className="text-gray-600">Crear pedido para cliente presencial o telefónico</p>
      </div>
      <CreateOrderForm />
    </div>
  );
}