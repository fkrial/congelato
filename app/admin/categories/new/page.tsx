// No necesitas importar un layout aquí. El layout raíz se aplica solo.
import { CategoryForm } from "@/components/admin/categories/category-form";

export default function NewCategoryPage() {
  return (
    <div className="max-w-2xl">
        <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">Crear Nueva Categoría</h1>
        <CategoryForm />
    </div>
  );
}