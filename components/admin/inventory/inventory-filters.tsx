"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Download } from "lucide-react"

interface InventoryFiltersProps {
  filters: {
    search: string;
    status: string;
    category: string;
  };
  onFilterChange: (filterName: string, value: string) => void;
  onClearFilters: () => void;
}

export function InventoryFilters({ filters, onFilterChange, onClearFilters }: InventoryFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar materias primas..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filters.status} onValueChange={(value) => onFilterChange('status', value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Estado del stock" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="in_stock">En stock</SelectItem>
            <SelectItem value="low_stock">Stock bajo</SelectItem>
            <SelectItem value="out_of_stock">Agotado</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.category} onValueChange={(value) => onFilterChange('category', value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            <SelectItem value="harinas">Harinas</SelectItem>
            <SelectItem value="lacteos">Lácteos</SelectItem>
            <SelectItem value="endulzantes">Endulzantes</SelectItem>
            <SelectItem value="especias">Especias</SelectItem>
            <SelectItem value="otros">Otros</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="ghost" size="sm" onClick={onClearFilters}>Limpiar Filtros</Button>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
        <Button size="sm" className="bg-primary hover:bg-primary/90" asChild>
          <Link href="/admin/inventory/new">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Material
          </Link>
        </Button>
      </div>
    </div>
  )
}