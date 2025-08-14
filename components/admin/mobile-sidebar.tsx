"use client"

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, LogOut } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "./icon-map"; // Importamos el componente Icon

interface NavItem {
    name: string;
    href: string;
    icon: string; // Ahora es un string
}

export function MobileSidebar({ navigation }: { navigation: NavItem[] }) {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
        router.refresh();
    };

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Abrir menú</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-64">
                <div className="flex h-16 items-center justify-between px-4 border-b">
                    <Link href="/admin/dashboard" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center"><span className="text-white font-bold text-sm">P</span></div>
                        <span className="font-serif font-bold text-lg">Admin Panel</span>
                    </Link>
                </div>
                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                    {navigation.map((item) => {
                        const isActive = (pathname === item.href) || (pathname.startsWith(item.href + '/') && item.href !== '/admin/dashboard');
                        return (
                            <Link key={item.name} href={item.href} onClick={() => setOpen(false)}
                                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${isActive ? "bg-primary text-white" : "text-gray-700 hover:bg-gray-100"}`}>
                                <Icon name={item.icon} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>
                 <div className="p-4 border-t">
                    <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-gray-700 hover:text-gray-900">
                        <LogOut className="mr-3 h-5 w-5" />
                        Cerrar Sesión
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}