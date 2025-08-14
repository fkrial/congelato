"use client"

import type React from "react";
import { usePathname } from "next/navigation";
import { NotificationProvider } from "@/context/notification-context";
import { DesktopSidebar } from "./desktop-sidebar";
import { MobileSidebar } from "./mobile-sidebar";
import { UserNav } from "./user-nav";

const navigation = [
    { name: "Dashboard", href: "/admin/dashboard", icon: "LayoutDashboard", roles: ['admin', 'baker'] },
    { name: "Caja", href: "/admin/cash-register", icon: "DollarSign", roles: ['admin'] },
    { name: "Pedidos", href: "/admin/orders", icon: "ShoppingCart", roles: ['admin'] },
    { name: "Productos", href: "/admin/products", icon: "Package", roles: ['admin'] },
    { name: "Categorías", href: "/admin/categories", icon: "Folder", roles: ['admin'] },
    { name: "Recetas", href: "/admin/recipes", icon: "ChefHat", roles: ['admin', 'baker'] },
    { name: "Inventario", href: "/admin/inventory", icon: "Package", roles: ['admin', 'baker'] },
    { name: "Presupuestos", href: "/admin/quotes", icon: "FileText", roles: ['admin'] },
    { name: "Pagos Mayoristas", href: "/admin/wholesale-payments", icon: "CreditCard", roles: ['admin'] },
    { name: "Producción", href: "/admin/production", icon: "Calendar", roles: ['admin', 'baker'] },
    { name: "Integraciones", href: "/admin/integrations", icon: "Zap", roles: ['admin'] },
    { name: "Reportes", href: "/admin/analytics", icon: "BarChart3", roles: ['admin'] },
    { name: "Configuración", href: "/admin/settings", icon: "Settings", roles: ['admin'] },
];

export default function AdminLayoutClient({ user, children }: { user: any, children: React.ReactNode }) {
  const pathname = usePathname();
  const filteredNavigation = navigation.filter(item => item.roles.includes(user.role as string));

  return (
    // 1. El NotificationProvider envuelve toda la UI del admin
    <NotificationProvider>
      <div className="min-h-screen bg-gray-50">
        <DesktopSidebar navigation={filteredNavigation} currentPath={pathname} />
        <div className="lg:pl-64">
          <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
            <div className="flex items-center justify-between h-16 px-4">
              <MobileSidebar navigation={filteredNavigation} />
              <div className="flex-1" />
              <div className="flex items-center space-x-4">
                <UserNav user={user} />
              </div>
            </div>
          </header>
          {/* 2. Aquí se renderiza el contenido de la página específica */}
          <main className="p-6">{children}</main>
        </div>
      </div>
    </NotificationProvider>
  );
}