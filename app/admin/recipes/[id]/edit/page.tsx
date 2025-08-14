import { AdminLayout } from "@/components/admin/admin-server-layout";
import CreateRecipeForm from "@/components/admin/recipes/create-recipe-form";

export default function EditRecipePage({ params }: { params: { id: string } }) {
  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="mb-6">
          <h1 className="text-2xl font-serif font-bold text-gray-900">Editar Receta</h1>
          <p className="text-gray-600">Modifica los detalles de la receta y sus ingredientes</p>
        </div>
        <CreateRecipeForm recipeId={params.id} />
      </div>
    </AdminLayout>
  );
}