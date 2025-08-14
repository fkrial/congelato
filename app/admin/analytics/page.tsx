// Usamos llaves {} porque importamos un componente con exportación NOMBRADA
import { AnalyticsClientPage } from "@/components/admin/analytics/analytics-client-page";

export default function AnalyticsPage() {
  // Simplemente devuelve el componente cliente que contiene el contenido de la página
  return <AnalyticsClientPage />;
}