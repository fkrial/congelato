"use client"

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Icon } from "./icon-map";
import { LogOut } from "lucide-react";

interface NavItem {
    name: string;
    href: string;
    icon: string;
}

export function DesktopSidebar({ navigation }: { navigation: NavItem[] }) {
    const router = useRouter();

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/admin/login');
        router.refresh();
    };

    return (
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
            <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
                <div className="flex items-center h-16 px-4 border-b">
                    <Link href="/admin/dashboard" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center"><span className="text-white font-bold text-sm">P</span></div>
                        <span className="font-serif font-bold text-lg">Admin Panel</span>
                    </Link>
                </div>
                <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
                    {navigation.map((item) => (
                        <Link key={item.name} href={item.href}
                            className="flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors text-gray-700 hover:bg-gray-100">
                            <Icon name={item.icon} />
                            {item.name}
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t">
                    <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-gray-700 hover:text-gray-900">
                        <LogOut className="mr-3 h-5 w-5" />
                        Cerrar Sesión
                    </Button>
                </div>
            </div>
        </div>
    );
}