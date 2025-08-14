"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Loader2, Save } from 'lucide-react';

const initialSettings = {
    businessInfo: {
        name: '',
        address: '',
        phone: '',
        email: '',
    },
    orderSettings: {
        minPrepTime: '',
        deliveryFee: '',
    }
};

// *** CORRECCIÓN DEL NOMBRE DE LA FUNCIÓN ***
export function SettingsClientPageContent() {
    const [settings, setSettings] = useState(initialSettings);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const fetchSettings = async () => {
            setIsLoading(true);
            try {
                const res = await fetch('/api/settings');
                if (res.ok) {
                    const data = await res.json();
                    setSettings(prev => ({
                        businessInfo: { ...prev.businessInfo, ...data.businessInfo },
                        orderSettings: { ...prev.orderSettings, ...data.orderSettings },
                    }));
                }
            } catch (error) {
                toast({ variant: 'destructive', title: "Error", description: "No se pudo cargar la configuración." });
            } finally {
                setIsLoading(false);
            }
        };
        fetchSettings();
    }, [toast]);

    const handleInputChange = (section: keyof typeof initialSettings, field: string, value: string) => {
        setSettings(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value
            }
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            if (!res.ok) throw new Error("No se pudo guardar la configuración.");
            toast({ title: "Éxito", description: "Configuración guardada correctamente." });
        } catch (error) {
            toast({ variant: 'destructive', title: "Error", description: (error as Error).message });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <Toaster />
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Configuración</h1>
                    <p className="text-gray-600">Ajusta los parámetros generales de tu negocio.</p>
                </div>
                <Button onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Guardar Cambios
                </Button>
            </div>
            
            <Card>
                <CardHeader>
                    <CardTitle>Información del Negocio</CardTitle>
                    <CardDescription>Datos que aparecerán en facturas y en la web.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nombre del Negocio</Label>
                            <Input id="name" value={settings.businessInfo.name} onChange={e => handleInputChange('businessInfo', 'name', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Teléfono</Label>
                            <Input id="phone" value={settings.businessInfo.phone} onChange={e => handleInputChange('businessInfo', 'phone', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email de Contacto</Label>
                            <Input id="email" type="email" value={settings.businessInfo.email} onChange={e => handleInputChange('businessInfo', 'email', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Dirección</Label>
                            <Input id="address" value={settings.businessInfo.address} onChange={e => handleInputChange('businessInfo', 'address', e.target.value)} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Configuración de Pedidos</CardTitle>
                    <CardDescription>Parámetros para la gestión de nuevos pedidos.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="minPrepTime">Tiempo Mín. Preparación (minutos)</Label>
                            <Input id="minPrepTime" type="number" value={settings.orderSettings.minPrepTime} onChange={e => handleInputChange('orderSettings', 'minPrepTime', e.target.value)} />
                        </div>
                         <div className="space-y-2">
                            <Label htmlFor="deliveryFee">Costo de Envío Fijo (€)</Label>
                            <Input id="deliveryFee" type="number" step="0.01" value={settings.orderSettings.deliveryFee} onChange={e => handleInputChange('orderSettings', 'deliveryFee', e.target.value)} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}