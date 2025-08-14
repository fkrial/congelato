import { DashboardStats } from "@/components/admin/dashboard-stats";
import { RecentOrders } from "@/components/admin/recent-orders";
import { ProductionOverview } from "@/components/admin/production-overview";
import { QuickActions } from "@/components/admin/quick-actions";

export default function AdminDashboardPage() {
  // Devuelve solo el contenido, sin envolverlo en <AdminLayout>
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600">Resumen general de tu panadería</p>
      </div>
      <DashboardStats />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrders />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
      <ProductionOverview />
    </div>
  );
}