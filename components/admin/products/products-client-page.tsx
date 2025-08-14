"use client"

import { ProductsOverview } from "@/components/admin/products/products-overview";
import { ProductsFilters } from "@/components/admin/products/products-filters";
import { ProductsTable } from "@/components/admin/products/products-table";

export function ProductsClientPage() {
  // En el futuro, la lógica de estado para los filtros y la carga de datos iría aquí.
  // Por ahora, los componentes internos manejan su propia carga de datos.
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900">Gestión de Productos</h1>
        <p className="text-gray-600">Administra tu catálogo de productos y sus variantes.</p>
      </div>
      
      <ProductsOverview />
      <ProductsFilters />
      <ProductsTable />
    </div>
  );
}