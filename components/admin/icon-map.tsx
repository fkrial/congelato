import {
  LayoutDashboard, Package, ChefHat, ShoppingCart, Calendar, BarChart3,
  Settings, Folder, DollarSign, FileText, CreditCard, Zap
} from "lucide-react";

// Mapeo de nombres de string a componentes de icono
export const iconMap: { [key: string]: React.ElementType } = {
  LayoutDashboard,
  Package,
  ChefHat,
  ShoppingCart,
  Calendar,
  BarChart3,
  Settings,
  Folder,
  DollarSign,
  FileText,
  CreditCard,
  Zap,
};

// Componente auxiliar para renderizar el icono por nombre
export function Icon({ name }: { name: string }) {
  const IconComponent = iconMap[name];
  if (!IconComponent) return null; // O un ícono por defecto
  return <IconComponent className="mr-3 h-5 w-5" />;
}