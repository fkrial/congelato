// Usamos llaves {} porque importamos un componente con exportación NOMBRADA
import { SettingsClientPageContent } from "@/components/admin/settings/settings-client-page-content";

export default function SettingsPage() {
  // Simplemente devuelve el componente cliente
  return <SettingsClientPageContent />;
}