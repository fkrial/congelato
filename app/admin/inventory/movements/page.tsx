// app/admin/inventory/movements/page.tsx
import { AdminLayout } from "@/components/admin/admin-server-layout";
import { MovementsTable } from "@/components/admin/inventory/movements-table";
import { MovementFilters } from "@/components/admin/inventory/movement-filters";

export default function InventoryMovementsPage() {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Movimientos de Inventario</h1>
          <p className="text-gray-600">Historial de entradas, salidas y ajustes de stock</p>
        </div>
        <MovementFilters />
        <MovementsTable />
      </div>
    </AdminLayout>
  );
}