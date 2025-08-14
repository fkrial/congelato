import { OrdersClientPageContent } from "@/components/admin/orders/orders-client-page-content";

// La página es ahora un componente de servidor muy simple.
// No necesita importar ni usar ningún layout. El layout raíz se encargará de ello.
export default function OrdersPage() {
  return <OrdersClientPageContent />;
}