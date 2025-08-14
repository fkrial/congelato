import { AutomationDashboard } from "@/components/admin/automation/automation-dashboard"
import { RuleBuilder } from "@/components/admin/automation/rule-builder"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AutomationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Automatización de Workflows</h1>
        <p className="text-gray-600">Configura reglas automáticas para optimizar procesos</p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="builder">Crear Regla</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <AutomationDashboard />
        </TabsContent>

        <TabsContent value="builder">
          <RuleBuilder />
        </TabsContent>
      </Tabs>
    </div>
  )
}
