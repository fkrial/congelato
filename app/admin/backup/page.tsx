import { BackupDashboard } from "@/components/admin/backup/backup-dashboard"
import { BackupSettings } from "@/components/admin/backup/backup-settings"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function BackupPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Backup y Sincronización</h1>
        <p className="text-gray-600">Gestiona backups automáticos y sincronización de datos</p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard">
          <BackupDashboard />
        </TabsContent>

        <TabsContent value="settings">
          <BackupSettings />
        </TabsContent>
      </Tabs>
    </div>
  )
}
