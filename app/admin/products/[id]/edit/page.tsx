import { EditProductClientPage } from "@/components/admin/products/edit-product-client-page";

export default function EditProductPage({ params }: { params: { id: string } }) {
  return <EditProductClientPage productId={params.id} />;
}