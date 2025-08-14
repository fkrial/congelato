// app/admin/inventory/[id]/edit/page.tsx
import { AdminLayout } from "@/components/admin/admin-server-layout";
import { AddMaterialForm } from "@/components/admin/inventory/add-material-form";

export default function EditMaterialPage({ params }: { params: { id: string } }) {
  return (
    <AdminLayout>
      <div className="max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-serif font-bold text-gray-900">Editar Materia Prima</h1>
          <p className="text-gray-600">Modifica los detalles del material seleccionado.</p>
        </div>
        <AddMaterialForm materialId={params.id} />
      </div>
    </AdminLayout>
  );
}