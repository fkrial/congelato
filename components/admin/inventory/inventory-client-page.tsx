"use client"

import { useState, useEffect, useMemo } from "react";
import { InventoryOverview } from "@/components/admin/inventory/inventory-overview";
import { InventoryTable } from "@/components/admin/inventory/inventory-table";
import { InventoryFilters } from "@/components/admin/inventory/inventory-filters";
import { Loader2 } from "lucide-react";

interface InventoryItem {
  id: number;
  status: string;
  costPerUnit: number;
  currentStock: number;
  // ... resto de propiedades
  name: string;
  category: string;
  minStock: number;
  unit: string;
  supplier: string;
  lastUpdated: string;
}

export function InventoryClientPage() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [allInventory, setAllInventory] = useState<InventoryItem[]>([]); // Guardamos una copia sin filtros de status
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    category: "all",
  });

  const fetchInventory = async () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category !== 'all') params.append('category', filters.category);
    
    try {
      // Pedimos todos los estados a la API para calcular las tarjetas de resumen
      const response = await fetch(`/api/inventory?${params.toString()}`);
      const data = await response.json();
      const allData = data.inventory || [];
      setAllInventory(allData); // Guardamos todos los resultados

      // Aplicamos el filtro de status localmente
      if (filters.status !== 'all') {
        setInventoryItems(allData.filter((item: InventoryItem) => item.status === filters.status));
      } else {
        setInventoryItems(allData);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchInventory();
    }, 300);
    return () => clearTimeout(debounce);
  }, [filters]);

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };
  
  const handleClearFilters = () => {
    setFilters({ search: "", status: "all", category: "all" });
  };
  
  const overviewData = useMemo(() => {
    const totalValue = allInventory.reduce((sum, item) => sum + (item.costPerUnit * item.currentStock), 0);
    return {
      totalItems: allInventory.length,
      lowStock: allInventory.filter(item => item.status === 'low_stock').length,
      outOfStock: allInventory.filter(item => item.status === 'out_of_stock').length,
      totalValue: totalValue,
    };
  }, [allInventory]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Gestión de Inventario</h1>
          <p className="text-gray-600">Controla el stock de materias primas y ingredientes</p>
        </div>
      </div>
      <InventoryOverview data={overviewData} />
      <InventoryFilters filters={filters} onFilterChange={handleFilterChange} onClearFilters={handleClearFilters} />
      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
      ) : (
        <InventoryTable inventory={inventoryItems} onDataChange={fetchInventory} />
      )}
    </div>
  );
}