import AdminServerLayout from "@/components/admin/admin-server-layout";
import { EditProductClientPage } from "@/components/admin/products/edit-product-client-page";

export default function EditProductPage({ params }: { params: { id: string } }) {
  return (
    <AdminServerLayout>
      <EditProductClientPage productId={params.id} />
    </AdminServerLayout>
  );
}