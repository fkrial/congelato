"use client"

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Bell, User, LogOut, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useNotifications } from "@/context/notification-context"; // <-- IMPORTAR
import { ScrollArea } from "@/components/ui/scroll-area";

interface AuthUser {
    email: string;
    role: string;
}

export function UserNav({ user }: { user: AuthUser }) {
    const router = useRouter();
    const { notifications, unreadCount, markAllAsRead } = useNotifications(); // <-- Usar el contexto

    const handleLogout = async () => {
        // ... (lógica de logout sin cambios)
    };

    return (
        <div className="flex items-center space-x-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="relative">
                        <Bell className="h-5 w-5" />
                        {unreadCount > 0 && (
                            <Badge className="absolute -top-1 -right-1 h-4 w-4 justify-center p-0">{unreadCount}</Badge>
                        )}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-80" align="end">
                    <DropdownMenuLabel className="flex justify-between items-center">
                        Notificaciones
                        <Button variant="ghost" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
                            <Check className="w-4 h-4 mr-1"/>Marcar todas leídas
                        </Button>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <ScrollArea className="h-[300px]">
                        {notifications.length > 0 ? notifications.map(n => (
                            <DropdownMenuItem key={n.id} className={`flex flex-col items-start gap-1 whitespace-normal ${!n.read ? 'bg-blue-50' : ''}`}>
                                <p className="font-semibold">{n.title}</p>
                                <p className="text-xs text-muted-foreground">{n.message}</p>
                                <p className="text-xs text-muted-foreground self-end">{new Date(n.timestamp).toLocaleTimeString()}</p>
                            </DropdownMenuItem>
                        )) : (
                            <p className="text-sm text-center text-muted-foreground p-4">No hay notificaciones.</p>
                        )}
                    </ScrollArea>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Menú de Usuario sin cambios */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                       <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center"><User className="h-4 w-4 text-gray-600" /></div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user.email}</p>
                            <p className="text-xs leading-none text-muted-foreground capitalize">{user.role}</p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Cerrar Sesión</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}