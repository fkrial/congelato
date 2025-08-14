import AdminServerLayout from "@/components/admin/admin-server-layout";
import { NewMaterialClientPage } from "@/components/admin/inventory/new-material-client-page";

export default function NewMaterialPage() {
  return (
    <AdminServerLayout>
      <NewMaterialClientPage />
    </AdminServerLayout>
  );
}