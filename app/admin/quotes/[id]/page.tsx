import AdminServerLayout from "@/components/admin/admin-server-layout";
import { QuoteDetails } from "@/components/admin/quotes/quote-details";

export default function QuoteDetailPage() {
  return (
    <AdminServerLayout>
      <QuoteDetails />
    </AdminServerLayout>
  );
}