import { CategoryForm } from "@/components/admin/categories/category-form";

export default function EditCategoryPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-2xl">
        <h1 className="text-2xl font-serif font-bold text-gray-900 mb-6">Editar Categoría</h1>
        <CategoryForm categoryId={params.id} />
    </div>
  );
}