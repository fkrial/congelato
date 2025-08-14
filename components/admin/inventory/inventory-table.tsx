"use client"

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2, AlertTriangle } from "lucide-react";
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

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  unit: string;
  costPerUnit: number;
  supplier: string;
  lastUpdated: string;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

interface InventoryTableProps {
    inventory: InventoryItem[];
    onDataChange: () => void;
}

const statusConfig = {
  in_stock: { label: "En Stock", color: "bg-green-100 text-green-800" },
  low_stock: { label: "Stock Bajo", color: "bg-yellow-100 text-yellow-800" },
  out_of_stock: { label: "Agotado", color: "bg-red-100 text-red-800" },
};

export function InventoryTable({ inventory, onDataChange }: InventoryTableProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleDelete = async (materialId: number) => {
    try {
      const response = await fetch(`/api/inventory/${materialId}`, { method: 'DELETE' });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'No se pudo borrar el material');
      }
      toast({ title: "Éxito", description: "Material borrado correctamente." });
      onDataChange(); // Notifica al componente padre para que recargue los datos
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: (error as Error).message });
    }
  };

  const getStockPercentage = (current: number, min: number) => {
    if (min <= 0) return current > 0 ? 100 : 0;
    if (current <= 0) return 0;
    // Consideramos que el 100% es tener el doble del stock mínimo
    return Math.min((current / (min * 2)) * 100, 100);
  };

  if (inventory.length === 0) {
      return (
          <Card>
              <CardContent className="p-8 text-center text-gray-500">
                  No se encontraron materiales en el inventario.
              </CardContent>
          </Card>
      );
  }

  return (
    <Card>
      <Toaster />
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Material</TableHead>
                <TableHead>Stock Actual</TableHead>
                <TableHead>Stock Mínimo</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Costo/Unidad</TableHead>
                <TableHead>Proveedor</TableHead>
                <TableHead>Última Actualización</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => {
                const statusInfo = statusConfig[item.status] || statusConfig.in_stock;
                const stockPercentage = getStockPercentage(item.currentStock, item.minStock);

                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">{item.category}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {item.currentStock} {item.unit}
                        </span>
                        {item.status === "low_stock" && <AlertTriangle className="w-4 h-4 text-yellow-500" />}
                        {item.status === "out_of_stock" && <AlertTriangle className="w-4 h-4 text-red-500" />}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                        <div
                          className={`h-1.5 rounded-full ${
                            stockPercentage > 50 ? "bg-green-500" :
                            stockPercentage > 25 ? "bg-yellow-500" : "bg-red-500"
                          }`}
                          style={{ width: `${stockPercentage}%` }}
                        ></div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-600">{item.minStock} {item.unit}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusInfo.color}>{statusInfo.label}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">€{item.costPerUnit.toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-600">{item.supplier}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-500 text-sm">{item.lastUpdated}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => router.push(`/admin/inventory/${item.id}/edit`)}>
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-red-600 hover:text-red-700">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>¿Estás realmente seguro?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Esta acción no se puede deshacer. Esto borrará permanentemente el material "{item.name}" de la base de datos.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(item.id)}>
                                Sí, borrar
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}