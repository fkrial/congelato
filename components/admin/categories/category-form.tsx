"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Save, Loader2, ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface CategoryFormProps {
  categoryId?: string;
}

export function CategoryForm({ categoryId }: CategoryFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const isEditMode = !!categoryId;

  useEffect(() => {
    if (isEditMode) {
      const fetchCategory = async () => {
        try {
          const res = await fetch(`/api/categories/${categoryId}`);
          if (!res.ok) throw new Error("No se pudo cargar la categoría.");
          const data = await res.json();
          setFormData({ name: data.name, description: data.description || "" });
        } catch (error) {
          toast({ variant: "destructive", title: "Error", description: (error as Error).message });
        }
      };
      fetchCategory();
    }
  }, [categoryId, isEditMode, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const url = isEditMode ? `/api/categories/${categoryId}` : '/api/categories';
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error(`No se pudo guardar la categoría.`);
      
      toast({ title: "Éxito", description: `Categoría ${isEditMode ? 'actualizada' : 'creada'}.` });
      router.push('/admin/categories');
      router.refresh();
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error', description: (error as Error).message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la Categoría *</Label>
            <Input id="name" value={formData.name} onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea id="description" value={formData.description} onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} />
          </div>
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
              {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
              {isEditMode ? 'Actualizar Categoría' : 'Guardar Categoría'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}