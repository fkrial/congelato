import { DemandPredictor } from "@/components/admin/ai/demand-predictor"
import { InventoryOptimizer } from "@/components/admin/ai/inventory-optimizer"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AIPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inteligencia Artificial</h1>
        <p className="text-gray-600">Predicción de demanda y optimización inteligente</p>
      </div>

      <Tabs defaultValue="demand" className="space-y-6">
        <TabsList>
          <TabsTrigger value="demand">Predicción de Demanda</TabsTrigger>
          <TabsTrigger value="inventory">Optimización de Inventario</TabsTrigger>
        </TabsList>

        <TabsContent value="demand">
          <DemandPredictor />
        </TabsContent>

        <TabsContent value="inventory">
          <InventoryOptimizer />
        </TabsContent>
      </Tabs>
    </div>
  )
}
