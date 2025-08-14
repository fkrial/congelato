import AdminServerLayout from "@/components/admin/admin-server-layout";
import { QuoteForm } from "@/components/admin/quotes/quote-form";

export default function NewQuotePage() {
  return (
    <AdminServerLayout>
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-serif font-bold text-gray-900">Crear Nuevo Presupuesto</h1>
          <p className="text-gray-600">Genera una cotización para un cliente.</p>
        </div>
        <QuoteForm />
      </div>
    </AdminServerLayout>
  );
}