"use client"

import { useState, useEffect, useMemo } from "react";
import { RecipeOverview } from "@/components/admin/recipes/recipe-overview";
import { RecipeGrid } from "@/components/admin/recipes/recipe-grid";
import { RecipeFilters } from "@/components/admin/recipes/recipe-filters";
import { Loader2 } from "lucide-react";

interface Recipe {
  id: number;
  name: string;
  total_cost: string;
  // ... resto de propiedades
}

export function RecipesClientPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    category: "all",
    difficulty: "all",
  });

  const fetchRecipes = async () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (filters.search) params.append('search', filters.search);
    if (filters.category !== 'all') params.append('category', filters.category);
    if (filters.difficulty !== 'all') params.append('difficulty', filters.difficulty);

    try {
      const response = await fetch(`/api/recipes?${params.toString()}`);
      const data = await response.json();
      setRecipes(data.recipes || []);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchRecipes();
    }, 300);
    return () => clearTimeout(debounce);
  }, [filters]);

  const handleFilterChange = (filterName: string, value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };
  
  const handleClearFilters = () => {
    setFilters({ search: "", category: "all", difficulty: "all" });
  };

  // Datos para las tarjetas de resumen
  const overviewData = useMemo(() => {
    const totalRecipes = recipes.length;
    const avgCost = totalRecipes > 0 
      ? recipes.reduce((sum, r) => sum + parseFloat(r.total_cost || '0'), 0) / totalRecipes 
      : 0;
    return { totalRecipes, avgCost };
  }, [recipes]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-serif font-bold text-gray-900">Gestión de Recetas</h1>
          <p className="text-gray-600">Administra las recetas y calcula costos de producción</p>
        </div>
      </div>
      <RecipeOverview data={overviewData} />
      <RecipeFilters filters={filters} onFilterChange={handleFilterChange} onClearFilters={handleClearFilters} />
      {isLoading ? (
        <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
      ) : (
        <RecipeGrid recipes={recipes} onDataChange={fetchRecipes} />
      )}
    </div>
  );
}