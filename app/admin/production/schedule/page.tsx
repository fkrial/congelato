import { ProductionScheduler } from "@/components/admin/production/production-scheduler"
import { BatchOptimizer } from "@/components/admin/production/batch-optimizer"

export default function ProductionSchedulePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Programación de Producción</h1>
        <p className="text-muted-foreground">Programa y optimiza los lotes de producción</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ProductionScheduler />
        </div>
        <div>
          <BatchOptimizer />
        </div>
      </div>
    </div>
  )
}
