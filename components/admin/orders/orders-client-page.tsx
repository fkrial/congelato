"use client"

import { useState, useEffect, useMemo } from "react";
import { OrdersOverview } from "@/components/admin/orders/orders-overview";
import { OrdersTable } from "@/components/admin/orders/orders-table";
import { OrdersFilters } from "@/components/admin/orders/orders-filters";
import { Loader2 } from "lucide-react";

interface Order {
    id: string; 
    status: string;
    total: string;
    order_number: string;
    first_name: string;
    last_name: string;
    phone: string;
    order_type: string;
    delivery_date: string;
    created_at: string;
}

export function OrdersClientPageContent() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [allOrders, setAllOrders] = useState<Order[]>([]); // Para los KPIs
    const [isLoading, setIsLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: "",
        status: "all",
        type: "all",
        dateFrom: undefined as Date | undefined,
        dateTo: undefined as Date | undefined,
    });

    const fetchOrders = async () => {
        setIsLoading(true);
        const params = new URLSearchParams();
        if (filters.search) params.append('search', filters.search);
        if (filters.status !== 'all') params.append('status', filters.status);
        if (filters.type !== 'all') params.append('type', filters.type);
        if (filters.dateFrom) params.append('dateFrom', filters.dateFrom.toISOString().split('T')[0]);
        if (filters.dateTo) params.append('dateTo', filters.dateTo.toISOString().split('T')[0]);
        
        try {
            const response = await fetch(`/api/orders?${params.toString()}`);
            const data = await response.json();
            setOrders(data.orders || []);
            // Si es la carga inicial, también guardamos todos los pedidos para los KPIs
            if (filters.status === 'all' && filters.type === 'all' && !filters.search) {
                setAllOrders(data.orders || []);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const debounce = setTimeout(() => {
            fetchOrders();
        }, 300);
        return () => clearTimeout(debounce);
    }, [filters]);

    const handleFilterChange = (filterName: string, value: any) => {
        setFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const handleClearFilters = () => {
        setFilters({
            search: "",
            status: "all",
            type: "all",
            dateFrom: undefined,
            dateTo: undefined,
        });
    };
    
    const overviewData = useMemo(() => {
        const sourceData = (filters.status === 'all' && filters.type === 'all' && !filters.search) ? allOrders : orders;
        const pending = sourceData.filter(o => o.status === 'pending').length;
        const inProduction = sourceData.filter(o => o.status === 'in_production').length;
        const readyOrDelivered = sourceData.filter(o => o.status === 'ready' || o.status === 'delivered').length;
        return { totalOrders: sourceData.length, pending, inProduction, readyOrDelivered };
    }, [orders, allOrders, filters]);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-serif font-bold text-gray-900">Gestión de Pedidos</h1>
                <p className="text-gray-600">Administra todos los pedidos y su estado de producción</p>
            </div>
            
            <OrdersOverview data={overviewData} />
            <OrdersFilters filters={filters} onFilterChange={handleFilterChange} onClearFilters={handleClearFilters} />
            
            {isLoading ? (
                <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
            ) : (
                <OrdersTable orders={orders} onDataChange={fetchOrders} />
            )}
        </div>
    );
}