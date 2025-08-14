"use client"

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Eye, Edit, Copy, Trash2, Clock, Users, Calculator } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Recipe {
  id: number;
  name: string;
  yield_quantity: number;
  yield_unit: string;
  total_cost: number | string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  prepTime: number;
  sellingPrice: number;
  image: string;
}

interface RecipeGridProps {
    recipes: Recipe[];
    onDataChange: () => void;
}

const difficultyConfig = {
  easy: { label: "Fácil", color: "bg-green-100 text-green-800" },
  medium: { label: "Intermedio", color: "bg-yellow-100 text-yellow-800" },
  hard: { label: "Avanzado", color: "bg-red-100 text-red-800" },
};

const categoryColors: { [key: string]: string } = {
  Panes: "bg-amber-100 text-amber-800",
  Bollería: "bg-purple-100 text-purple-800",
  Pasteles: "bg-pink-100 text-pink-800",
  Galletas: "bg-orange-100 text-orange-800",
  Postres: "bg-indigo-100 text-indigo-800",
};

export function RecipeGrid({ recipes, onDataChange }: RecipeGridProps) {
  const { toast } = useToast();
  const router = useRouter();

  const handleDelete = async (recipeId: number) => {
    try {
      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'No se pudo borrar la receta.');
      }
      toast({ title: "Éxito", description: "Receta borrada correctamente." });
      onDataChange(); // Avisa al componente padre para que recargue la lista
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: error instanceof Error ? error.message : "Error desconocido al borrar." });
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins > 0 ? `${mins}m` : ""}`;
    }
    return `${mins}m`;
  };

  if (recipes.length === 0) {
    return (
        <Card>
            <CardContent className="p-8 text-center text-gray-500">
                No se encontraron recetas con los filtros seleccionados.
            </CardContent>
        </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Toaster />
      {recipes.map((recipe) => {
        // Simulación de datos que no vienen de la DB
        const recipeWithExtras = {
            ...recipe,
            difficulty: recipe.difficulty || 'medium',
            prepTime: recipe.prepTime || 120,
            sellingPrice: recipe.sellingPrice || (parseFloat(String(recipe.total_cost)) || 0) * 2.5,
            image: recipe.image || "/placeholder.svg?height=200&width=300",
            category: recipe.category || 'Panes',
        };

        const difficulty = difficultyConfig[recipeWithExtras.difficulty];
        const categoryColor = categoryColors[recipeWithExtras.category] || "bg-gray-100 text-gray-800";
        const cost = parseFloat(String(recipeWithExtras.total_cost));
        const margin = recipeWithExtras.sellingPrice > 0 ? ((recipeWithExtras.sellingPrice - cost) / recipeWithExtras.sellingPrice) * 100 : 0;

        return (
          <Card key={recipe.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img src={recipeWithExtras.image} alt={recipe.name} className="w-full h-48 object-cover" />
              <div className="absolute top-3 left-3 flex gap-2">
                <Badge className={categoryColor}>{recipeWithExtras.category}</Badge>
                <Badge className={difficulty.color}>{difficulty.label}</Badge>
              </div>
            </div>

            <CardHeader className="pb-3">
              <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">{recipe.name}</h3>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-1"><Clock className="w-4 h-4 text-gray-400" /> <span className="text-gray-600">{formatTime(recipeWithExtras.prepTime)}</span></div>
                <div className="flex items-center gap-1"><Users className="w-4 h-4 text-gray-400" /> <span className="text-gray-600">{recipe.yield_quantity} {recipe.yield_unit}</span></div>
                <div className="flex items-center gap-1"><Calculator className="w-4 h-4 text-gray-400" /> <span className="text-gray-600">-- ing.</span></div>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-600">Costo:</span><span className="font-medium">€{cost.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Precio venta:</span><span className="font-medium">€{recipeWithExtras.sellingPrice.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Margen:</span>
                  <span className={`font-medium ${margin > 60 ? "text-green-600" : "text-yellow-600"}`}>{margin.toFixed(1)}%</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={() => router.push(`/admin/recipes/${recipe.id}`)}>
                  <Eye className="w-4 h-4 mr-1" /> Ver
                </Button>
                <Button variant="ghost" size="sm" onClick={() => router.push(`/admin/recipes/${recipe.id}/edit`)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm"><Copy className="w-4 h-4" /></Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>Esta acción borrará permanentemente la receta "{recipe.name}".</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(recipe.id)}>Sí, borrar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}