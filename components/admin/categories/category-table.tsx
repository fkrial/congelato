"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Category {
  id: number;
  name: string;
  description: string;
}

export function CategoryTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { toast } = useToast();

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/categories?all=true'); // Usamos un param para traer todas
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: "No se pudieron cargar las categorías." });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (categoryId: number) => {
    try {
      const res = await fetch(`/api/categories/${categoryId}`, { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast({ title: "Éxito", description: "Categoría borrada." });
      fetchCategories();
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: (error as Error).message });
    }
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;

  return (
    <>
      <Toaster />
      <Table>
        <TableHeader><TableRow><TableHead>Nombre</TableHead><TableHead>Descripción</TableHead><TableHead className="text-right">Acciones</TableHead></TableRow></TableHeader>
        <TableBody>
          {categories.map((cat) => (
            <TableRow key={cat.id}>
              <TableCell className="font-medium">{cat.name}</TableCell>
              <TableCell>{cat.description}</TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/categories/${cat.id}/edit`)}><Edit className="w-4 h-4" /></Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger>
                  <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle><AlertDialogDescription>Esta acción no se puede deshacer. Se borrará la categoría "{cat.name}".</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(cat.id)}>Sí, borrar</AlertDialogAction></AlertDialogFooter></AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
}