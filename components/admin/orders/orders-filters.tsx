"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Search, CalendarIcon, Download, Plus, Filter } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

// La interfaz define qué props espera el componente
interface OrdersFiltersProps {
  filters: {
    search: string;
    status: string;
    type: string;
    dateFrom?: Date;
    dateTo?: Date;
  };
  onFilterChange: (filterName: string, value: any) => void;
  onClearFilters: () => void;
}

// El componente ahora recibe las props para ser controlado desde fuera
export function OrdersFilters({ filters, onFilterChange, onClearFilters }: OrdersFiltersProps) {
  const areFiltersActive = filters.search || filters.status !== "all" || filters.type !== "all" || filters.dateFrom || filters.dateTo;

  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-4 flex-1">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar pedidos..."
            value={filters.search} // Usamos el valor de las props
            onChange={(e) => onFilterChange('search', e.target.value)} // Llamamos a la función de la prop
            className="pl-10"
          />
        </div>

        <Select value={filters.status} onValueChange={(value) => onFilterChange('status', value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="pending">Pendientes</SelectItem>
            <SelectItem value="confirmed">Confirmados</SelectItem>
            <SelectItem value="in_production">En Producción</SelectItem>
            <SelectItem value="ready">Listos</SelectItem>
            <SelectItem value="delivered">Entregados</SelectItem>
            <SelectItem value="cancelled">Cancelados</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filters.type} onValueChange={(value) => onFilterChange('type', value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value="retail">Retail</SelectItem>
            <SelectItem value="wholesale">Mayorista</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[140px] justify-start text-left font-normal bg-transparent">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateFrom ? format(filters.dateFrom, "dd/MM/yyyy", { locale: es }) : "Desde"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={filters.dateFrom} onSelect={(date) => onFilterChange('dateFrom', date)} initialFocus />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[140px] justify-start text-left font-normal bg-transparent">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {filters.dateTo ? format(filters.dateTo, "dd/MM/yyyy", { locale: es }) : "Hasta"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={filters.dateTo} onSelect={(date) => onFilterChange('dateTo', date)} initialFocus />
            </PopoverContent>
          </Popover>
        </div>

        {areFiltersActive && (
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              <Filter className="w-3 h-3 mr-1" />
              Filtros activos
            </Badge>
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              Limpiar
            </Button>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Exportar
        </Button>
        <Button size="sm" className="bg-primary hover:bg-primary/90" asChild>
          <Link href="/admin/orders/new">
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Pedido
          </Link>
        </Button>
      </div>
    </div>
  )
}