"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Save, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface AddMaterialFormProps {
  materialId?: string;
}

const categories = [
  { value: "harinas", label: "Harinas" },
  { value: "lacteos", label: "Lácteos" },
  { value: "endulzantes", label: "Endulzantes" },
  { value: "especias", label: "Especias" },
  { value: "grasas", label: "Grasas" },
  { value: "otros", label: "Otros" },
];

const units = [
  { value: "kg", label: "Kilogramos (kg)" },
  { value: "g", label: "Gramos (g)" },
  { value: "L", label: "Litros (L)" },
  { value: "ml", label: "Mililitros (ml)" },
  { value: "unidades", label: "Unidades" },
];

export function AddMaterialForm({ materialId }: AddMaterialFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(!!materialId);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    unit: "",
    costPerUnit: "",
    currentStock: "",
    minStock: "",
    supplier: "",
    description: "",
  });

  const isEditMode = !!materialId;

  useEffect(() => {
    if (isEditMode) {
      const fetchMaterialData = async () => {
        try {
          const res = await fetch(`/api/inventory/${materialId}`);
          if (!res.ok) {
            throw new Error("No se pudo cargar la información del material para editar.");
          }
          const data = await res.json();
          // Mapeamos los nombres de la DB a los del formulario
          setFormData({
            name: data.name || "",
            category: data.category || "",
            unit: data.unit || "",
            costPerUnit: String(data.cost_per_unit || ""),
            currentStock: String(data.current_stock || ""),
            minStock: String(data.minimum_stock || ""),
            supplier: data.supplier || "",
            description: "", // La description no está en la DB, la dejamos vacía.
          });
        } catch (error) {
          toast({
            variant: "destructive",
            title: "Error de carga",
            description: error instanceof Error ? error.message : "Error desconocido.",
          });
        } finally {
          setIsFetchingData(false);
        }
      };
      fetchMaterialData();
    }
  }, [materialId, isEditMode, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = isEditMode ? `/api/inventory/${materialId}` : '/api/inventory';
      const method = isEditMode ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const responseData = await response.json();
      if (!response.ok) {
        throw new Error(responseData.message || "Ocurrió un error al guardar.");
      }

      toast({
        title: "¡Éxito!",
        description: `El material ha sido ${isEditMode ? 'actualizado' : 'agregado'} correctamente.`,
      });

      router.push("/admin/inventory");
      router.refresh();

    } catch (error) {
      toast({
        variant: "destructive",
        title: "¡Oh no! Algo salió mal.",
        description: error instanceof Error ? error.message : "No se pudo guardar el material.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (isFetchingData) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="ml-2">Cargando datos del material...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster />
      <Card>
        <CardHeader>
          <CardTitle>{isEditMode ? "Editar Material" : "Nuevo Material"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Material *</Label>
                <Input id="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Categoría *</Label>
                <Select value={formData.category} onValueChange={(value) => handleSelectChange('category', value)} required>
                  <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                  <SelectContent>{categories.map((c) => <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unidad de Medida *</Label>
                <Select value={formData.unit} onValueChange={(value) => handleSelectChange('unit', value)} required>
                  <SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger>
                  <SelectContent>{units.map((u) => <SelectItem key={u.value} value={u.value}>{u.label}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="costPerUnit">Costo por Unidad (€) *</Label>
                <Input id="costPerUnit" type="number" step="0.01" min="0" value={formData.costPerUnit} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currentStock">Stock Actual</Label>
                <Input id="currentStock" type="number" step="0.01" min="0" value={formData.currentStock} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minStock">Stock Mínimo *</Label>
                <Input id="minStock" type="number" step="0.01" min="0" value={formData.minStock} onChange={handleInputChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="supplier">Proveedor</Label>
              <Input id="supplier" value={formData.supplier} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Descripción (Formulario)</Label>
              <Textarea id="description" value={formData.description} onChange={handleInputChange} />
            </div>
            <div className="flex gap-4 pt-4">
              <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                {isLoading ? "Guardando..." : "Guardar Cambios"}
              </Button>
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}