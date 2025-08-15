import CreateRecipeForm from "@/components/admin/recipes/create-recipe-form";

export default function NewRecipePage() {
  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-serif font-bold text-gray-900">Nueva Receta</h1>
        <p className="text-gray-600">Crea una nueva receta con ingredientes y pasos de preparación</p>
      </div>
      <CreateRecipeForm />
    </div>
  );
}