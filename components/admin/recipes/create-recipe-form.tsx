"use client"

import type React from "react"
import { useState, useMemo, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Plus, Trash2, Calculator, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

interface Ingredient {
  id: string
  materialId: string
  materialName: string
  quantity: number
  unit: string
  cost: number
}
interface Step {
  id: string
  order: number
  description: string
  time: number
  temperature?: number
}
const categories = [
  { value: "Panes", label: "Panes" },
  { value: "Bollería", label: "Bollería" },
  { value: "Pasteles", label: "Pasteles" },
  { value: "Galletas", label: "Galletas" },
  { value: "Postres", label: "Postres" },
];
const difficulties = [
  { value: "easy", label: "Fácil" },
  { value: "medium", label: "Intermedio" },
  { value: "hard", label: "Avanzado" },
];
const mockMaterials = [
  { id: "1", name: "Harina de trigo", unit: "kg", cost: 1.5 },
  { id: "2", name: "Azúcar blanca", unit: "kg", cost: 2.0 },
  { id: "3", name: "Mantequilla", unit: "kg", cost: 8.5 },
  { id: "4", name: "Huevos", unit: "unidades", cost: 0.25 },
  { id: "5", name: "Levadura fresca", unit: "kg", cost: 12.0 },
  { id: "6", name: "Sal", unit: "kg", cost: 0.8 },
  { id: "7", name: "Leche entera", unit: "L", cost: 1.2 },
];

interface CreateRecipeFormProps {
  recipeId?: string;
}

export default function CreateRecipeForm({ recipeId }: CreateRecipeFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(!!recipeId);
  const [formData, setFormData] = useState({
    name: "", category: "", difficulty: "", description: "",
    prepTime: 0, cookTime: 0, yield_quantity: 1, yield_unit: "", sellingPrice: 0,
  });
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [steps, setSteps] = useState<Step[]>([]);
  const isEditMode = !!recipeId;

  const { totalCost, margin } = useMemo(() => {
    const cost = ingredients.reduce((sum, ing) => sum + ing.cost, 0);
    const price = Number(formData.sellingPrice) || 0;
    const calculatedMargin = price > 0 ? ((price - cost) / price) * 100 : 0;
    return { totalCost: cost, margin: calculatedMargin };
  }, [ingredients, formData.sellingPrice]);

  useEffect(() => {
    if (isEditMode) {
      const fetchRecipeData = async () => {
        try {
          const res = await fetch(`/api/recipes/${recipeId}`);
          if (!res.ok) throw new Error("No se pudo cargar la receta para editar");
          const data = await res.json();
          
          setFormData({
            name: data.name || "",
            category: data.category || "",
            difficulty: data.difficulty || "",
            description: data.description || "",
            prepTime: data.prep_time || 0,
            cookTime: data.cook_time || 0,
            yield_quantity: data.yield_quantity || 1,
            yield_unit: data.yield_unit || "",
            sellingPrice: data.selling_price || 0,
          });

          if (Array.isArray(data.ingredients)) {
            const fetchedIngredients = data.ingredients.map((ing: any) => ({
                id: String(ing.id),
                materialId: String(ing.raw_material_id),
                quantity: ing.quantity,
                unit: ing.unit,
                cost: ing.cost,
                materialName: mockMaterials.find(m => m.id === String(ing.raw_material_id))?.name || 'Desconocido',
            }));
            setIngredients(fetchedIngredients);
          }
        } catch (error) {
          toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar los datos de la receta." });
        } finally {
          setIsFetching(false);
        }
      };
      fetchRecipeData();
    }
  }, [recipeId, isEditMode, toast]);

  const addIngredient = () => setIngredients([...ingredients, { id: Date.now().toString(), materialId: "", materialName: "", quantity: 0, unit: "", cost: 0 }]);
  const removeIngredient = (id: string) => setIngredients(prev => prev.filter(ing => ing.id !== id));
  
  const updateIngredient = (id: string, field: keyof Ingredient, value: any) => {
    setIngredients(prev =>
      prev.map(ing => {
        if (ing.id !== id) return ing;
        const updated = { ...ing, [field]: value };
        const material = mockMaterials.find(m => m.id === updated.materialId);
        if (material) {
          updated.materialName = material.name;
          updated.unit = material.unit;
          updated.cost = (material.cost || 0) * (Number(updated.quantity) || 0);
        }
        return updated;
      })
    );
  };
  
  const addStep = () => setSteps([...steps, { id: Date.now().toString(), order: steps.length + 1, description: "", time: 0 }]);
  const removeStep = (id: string) => setSteps(prev => prev.filter(step => step.id !== id).map((step, index) => ({ ...step, order: index + 1 })));
  const updateStep = (id: string, field: keyof Step, value: any) => setSteps(prev => prev.map(step => (step.id === id ? { ...step, [field]: value } : step)));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const payload = { ...formData, ingredients, steps, totalCost };
    const url = isEditMode ? `/api/recipes/${recipeId}` : '/api/recipes';
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || "Error al guardar la receta");

      toast({ title: "Éxito", description: `La receta ha sido ${isEditMode ? 'actualizada' : 'creada'}.` });
      router.push('/admin/recipes');
      router.refresh();
    } catch (error) {
      toast({ variant: 'destructive', title: "Error", description: error instanceof Error ? error.message : "Error desconocido" });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <Toaster />
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => router.back()}><ArrowLeft className="w-4 h-4 mr-2" /> Volver</Button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader><CardTitle>{isEditMode ? "Editar Receta" : "Nueva Receta"}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la Receta *</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Categoría *</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })} required><SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger><SelectContent>{categories.map(c => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent></Select>
              </div>
              <div className="space-y-2">
                <Label>Dificultad *</Label>
                <Select value={formData.difficulty} onValueChange={(v) => setFormData({ ...formData, difficulty: v })} required><SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger><SelectContent>{difficulties.map(d => <SelectItem key={d.value} value={d.value}>{d.label}</SelectItem>)}</SelectContent></Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="prepTime">Tiempo de Preparación (min) *</Label>
                <Input id="prepTime" type="number" value={formData.prepTime} onChange={(e) => setFormData({ ...formData, prepTime: Number(e.target.value) })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yield_quantity">Rendimiento *</Label>
                <Input id="yield_quantity" type="number" value={formData.yield_quantity} onChange={(e) => setFormData({ ...formData, yield_quantity: Number(e.target.value) })} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="yield_unit">Unidad de Rendimiento *</Label>
                <Input id="yield_unit" value={formData.yield_unit} onChange={(e) => setFormData({ ...formData, yield_unit: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción</Label>
              <Textarea id="description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between"><CardTitle>Ingredientes</CardTitle><Button type="button" variant="outline" size="sm" onClick={addIngredient}><Plus className="w-4 h-4 mr-2" />Agregar</Button></CardHeader>
          <CardContent className="space-y-4">
            {ingredients.map((ing) => (
              <div key={ing.id} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                <div className="space-y-2"><Label>Material</Label><Select value={ing.materialId} onValueChange={(v) => updateIngredient(ing.id, "materialId", v)}><SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger><SelectContent>{mockMaterials.map(m => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}</SelectContent></Select></div>
                <div className="space-y-2"><Label>Cantidad</Label><Input type="number" step="0.01" value={ing.quantity} onChange={(e) => updateIngredient(ing.id, "quantity", Number(e.target.value))} /></div>
                <div className="space-y-2"><Label>Unidad</Label><Input value={ing.unit} disabled className="bg-gray-50" /></div>
                <div className="space-y-2"><Label>Costo</Label><Input value={`€${ing.cost.toFixed(2)}`} disabled className="bg-gray-50" /></div>
                <div className="flex items-end"><Button type="button" variant="ghost" size="sm" onClick={() => removeIngredient(ing.id)} className="text-red-600"><Trash2 className="w-4 h-4" /></Button></div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between"><CardTitle>Pasos</CardTitle><Button type="button" variant="outline" size="sm" onClick={addStep}><Plus className="w-4 h-4 mr-2" />Agregar</Button></CardHeader>
          <CardContent className="space-y-4">
            {steps.map((step) => (
              <div key={step.id} className="flex gap-4 p-4 border rounded-lg">
                <Badge variant="outline" className="h-8 w-8 flex items-center justify-center rounded-full">{step.order}</Badge>
                <div className="flex-1 space-y-4">
                  <Textarea value={step.description} onChange={(e) => updateStep(step.id, "description", e.target.value)} placeholder="Describe el paso..." />
                  <div className="grid grid-cols-2 gap-4">
                    <Input type="number" placeholder="Tiempo (min)" value={step.time} onChange={(e) => updateStep(step.id, "time", Number(e.target.value))} />
                    <Input type="number" placeholder="Temp (°C)" value={step.temperature || ""} onChange={(e) => updateStep(step.id, "temperature", e.target.value ? Number(e.target.value) : undefined)} />
                  </div>
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeStep(step.id)} className="text-red-600"><Trash2 className="w-4 h-4" /></Button>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><CardTitle className="flex items-center gap-2"><Calculator />Análisis de Costos</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2"><Label>Costo Total</Label><div className="text-2xl font-bold">€{totalCost.toFixed(2)}</div></div>
              <div className="space-y-2">
                <Label htmlFor="sellingPrice">Precio de Venta</Label>
                <Input id="sellingPrice" type="number" step="0.01" value={formData.sellingPrice} onChange={(e) => setFormData({ ...formData, sellingPrice: Number(e.target.value) })} />
              </div>
              <div className="space-y-2"><Label>Margen</Label><div className={`text-2xl font-bold ${margin > 60 ? 'text-green-600' : 'text-yellow-600'}`}>{margin.toFixed(1)}%</div></div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-4 pt-4">
          <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            {isEditMode ? 'Actualizar Receta' : 'Guardar Receta'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
        </div>
      </form>
    </div>
  );
}