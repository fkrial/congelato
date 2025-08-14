import { LoyaltyDashboard } from "@/components/admin/loyalty/loyalty-dashboard"
import { CustomerManagement } from "@/components/admin/loyalty/customer-management"
import { RewardsManagement } from "@/components/admin/loyalty/rewards-management"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function LoyaltyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Programa de Fidelidad</h1>
        <p className="text-gray-600">Gestiona el programa de puntos y recompensas para clientes</p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="customers">Clientes</TabsTrigger>
          <TabsTrigger value="rewards">Recompensas</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <LoyaltyDashboard />
        </TabsContent>

        <TabsContent value="customers">
          <CustomerManagement />
        </TabsContent>

        <TabsContent value="rewards">
          <RewardsManagement />
        </TabsContent>
      </Tabs>
    </div>
  )
}
