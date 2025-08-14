"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Plus, Download } from "lucide-react"

interface RecipeFiltersProps {
  filters: {
    search: string;
    category: string;
    difficulty: string;
  };
  onFilterChange: (filterName: string, value: string) => void;
  onClearFilters: () => void;
}

export function RecipeFilters({ filters, onFilterChange, onClearFilters }: RecipeFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-wrap gap-4 items-center">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar recetas..."
            value={filters.search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="pl-10 w-full sm:w-auto"
          />
        </div>
        <Select value={filters.category} onValueChange={(value) => onFilterChange('category', value)}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            <SelectItem value="Panes">Panes</SelectItem>
            <SelectItem value="Bollería">Bollería</SelectItem>
            <SelectItem value="Pasteles">Pasteles</SelectItem>
          </SelectContent>
        </Select>
        <Select value={filters.difficulty} onValueChange={(value) => onFilterChange('difficulty', value)}>
          <SelectTrigger className="w-[180px]"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las dificultades</SelectItem>
            <SelectItem value="easy">Fácil</SelectItem>
            <SelectItem value="medium">Intermedio</SelectItem>
            <SelectItem value="hard">Avanzado</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="ghost" size="sm" onClick={onClearFilters}>Limpiar</Button>
      </div>
      <div className="flex gap-2">
        <Button variant="outline" size="sm"><Download className="w-4 h-4 mr-2" />Exportar</Button>
        <Button asChild size="sm" className="bg-primary hover:bg-primary/90">
          <Link href="/admin/recipes/new"><Plus className="w-4 h-4 mr-2" />Nueva Receta</Link>
        </Button>
      </div>
    </div>
  )
}