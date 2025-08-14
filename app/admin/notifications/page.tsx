import { NotificationCenter } from "@/components/admin/notifications/notification-center"
import { NotificationSettings } from "@/components/admin/notifications/notification-settings"

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Notificaciones</h1>
        <p className="text-gray-600">Gestiona las notificaciones y alertas del sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <NotificationCenter />
        </div>
        <div className="lg:col-span-2">
          <NotificationSettings />
        </div>
      </div>
    </div>
  )
}
