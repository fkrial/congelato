"use client"

import { AddMaterialForm } from "@/components/admin/inventory/add-material-form";

export function NewMaterialClientPage() {
  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Agregar Materia Prima</h1>
        <p className="text-gray-600">Registra un nuevo ingrediente o material en el inventario</p>
      </div>
      <AddMaterialForm />
    </div>
  );
}