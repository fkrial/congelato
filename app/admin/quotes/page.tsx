// Usamos llaves {} porque la exportación es nombrada
import { QuotesClientPageContent } from "@/components/admin/quotes/quotes-client-page-content";

export default function QuotesPage() {
  // Ya no necesita el layout, solo devuelve el contenido
  return <QuotesClientPageContent />;
}