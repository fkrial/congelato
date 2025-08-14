"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Save, Plus, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface Variant {
    id?: number;
    name: string;
    price_modifier: string;
    cost_modifier: string;
    is_available: boolean;
}

interface Category {
    id: number;
    name: string;
}

interface CreateProductFormProps {
    productId?: string;
}

export function CreateProductForm({ productId }: CreateProductFormProps) {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(!!productId);
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        categoryId: "",
        basePrice: "",
        costPrice: "",
        isActive: true,
        isFeatured: false,
    });
    const [variants, setVariants] = useState<Variant[]>([]);
    const isEditMode = !!productId;

    useEffect(() => {
        const fetchData = async () => {
            // Fetch categories
            try {
                const res = await fetch('/api/categories'); // Asumimos que existirá este endpoint
                const data = await res.json();
                setCategories(data.categories || []);
            } catch (error) {
                // Usamos mock data si la API falla o no existe
                setCategories([
                    { id: 1, name: "Panes" }, { id: 2, name: "Pasteles" },
                    { id: 3, name: "Galletas" }, { id: 4, name: "Bollería" }
                ]);
            }

            // Fetch product data if in edit mode
            if (isEditMode) {
                try {
                    const res = await fetch(`/api/products/${productId}`);
                    if (!res.ok) throw new Error("Producto no encontrado");
                    const data = await res.json();
                    setFormData({
                        name: data.name,
                        description: data.description || "",
                        categoryId: String(data.category_id),
                        basePrice: String(data.base_price),
                        costPrice: String(data.cost_price),
                        isActive: data.is_active,
                        isFeatured: data.is_featured,
                    });
                    setVariants(data.variants || []);
                } catch (error) {
                    toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar los datos del producto." });
                } finally {
                    setIsFetching(false);
                }
            }
        };
        fetchData();
    }, [productId, isEditMode, toast]);


    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSwitchChange = (field: 'isActive' | 'isFeatured', checked: boolean) => {
        setFormData(prev => ({ ...prev, [field]: checked }));
    };
    
    const addVariant = () => {
        setVariants([...variants, { name: "", price_modifier: "0", cost_modifier: "0", is_available: true }]);
    };

    const updateVariant = (index: number, field: keyof Variant, value: string | boolean) => {
        const newVariants = [...variants];
        (newVariants[index] as any)[field] = value;
        setVariants(newVariants);
    };

    const removeVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const payload = { ...formData, variants };
        const url = isEditMode ? `/api/products/${productId}` : '/api/products';
        const method = isEditMode ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Error al guardar el producto.");
            }

            toast({ title: "Éxito", description: `Producto ${isEditMode ? 'actualizado' : 'creado'} correctamente.` });
            router.push('/admin/products');
            router.refresh();
        } catch (error) {
            toast({ variant: 'destructive', title: 'Error', description: (error as Error).message });
        } finally {
            setIsLoading(false);
        }
    };
    
    if (isFetching) return <div className="flex justify-center items-center h-64"><Loader2 className="h-8 w-8 animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <Toaster />
            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader><CardTitle>Información Básica</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2"><Label htmlFor="name">Nombre *</Label><Input id="name" value={formData.name} onChange={handleInputChange} required /></div>
                            <div className="space-y-2"><Label htmlFor="categoryId">Categoría *</Label><Select value={formData.categoryId} onValueChange={(v) => setFormData(p => ({ ...p, categoryId: v }))} required><SelectTrigger><SelectValue placeholder="Seleccionar..." /></SelectTrigger><SelectContent>{categories.map(c => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}</SelectContent></Select></div>
                            <div className="space-y-2"><Label htmlFor="basePrice">Precio Base (€) *</Label><Input id="basePrice" type="number" step="0.01" value={formData.basePrice} onChange={handleInputChange} required /></div>
                            <div className="space-y-2"><Label htmlFor="costPrice">Costo de Producción (€)</Label><Input id="costPrice" type="number" step="0.01" value={formData.costPrice} onChange={handleInputChange} /></div>
                        </div>
                        <div className="space-y-2"><Label htmlFor="description">Descripción</Label><Textarea id="description" value={formData.description} onChange={handleInputChange} rows={3} /></div>
                        <div className="flex items-center space-x-6 pt-2">
                            <div className="flex items-center space-x-2"><Switch id="isActive" checked={formData.isActive} onCheckedChange={(c) => handleSwitchChange('isActive', c)} /><Label htmlFor="isActive">Activo</Label></div>
                            <div className="flex items-center space-x-2"><Switch id="isFeatured" checked={formData.isFeatured} onCheckedChange={(c) => handleSwitchChange('isFeatured', c)} /><Label htmlFor="isFeatured">Destacado</Label></div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between"><CardTitle>Variantes</CardTitle><Button type="button" variant="outline" size="sm" onClick={addVariant}><Plus className="w-4 h-4 mr-2" />Añadir Variante</Button></CardHeader>
                    <CardContent className="space-y-4">
                        {variants.map((variant, index) => (
                            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 border rounded-lg">
                                <div className="space-y-2 md:col-span-2"><Label>Nombre Variante</Label><Input value={variant.name} onChange={(e) => updateVariant(index, 'name', e.target.value)} /></div>
                                <div className="space-y-2"><Label>Mod. Precio</Label><Input type="number" step="0.01" value={variant.price_modifier} onChange={(e) => updateVariant(index, 'price_modifier', e.target.value)} /></div>
                                <div className="space-y-2"><Label>Mod. Costo</Label><Input type="number" step="0.01" value={variant.cost_modifier} onChange={(e) => updateVariant(index, 'cost_modifier', e.target.value)} /></div>
                                <div className="flex items-end gap-2"><div className="space-y-2 flex-1"><Label>Disponible</Label><Switch checked={variant.is_available} onCheckedChange={(c) => updateVariant(index, 'is_available', c)} /></div><Button type="button" variant="ghost" size="icon" className="text-red-600" onClick={() => removeVariant(index)}><Trash2 className="w-4 h-4" /></Button></div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <div className="flex gap-4 pt-4">
                    <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90"><Save className="w-4 h-4 mr-2" />{isLoading ? "Guardando..." : "Guardar Producto"}</Button>
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancelar</Button>
                </div>
            </form>
        </div>
    );
}