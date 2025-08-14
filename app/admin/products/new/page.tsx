import AdminServerLayout from "@/components/admin/admin-server-layout";
import { NewProductClientPage } from "@/components/admin/products/new-product-client-page";

export default function NewProductPage() {
  return (
    <AdminServerLayout>
      <NewProductClientPage />
    </AdminServerLayout>
  );
}