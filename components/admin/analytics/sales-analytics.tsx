"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock, Package, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, AreaChart, Area } from "recharts";

interface SalesData {
  daily_sales: Array<{ date: string; sales: number; orders: number; }>;
  hourly_distribution: Array<{ hour: number; sales: number; orders: number; }>;
  product_performance: Array<{ product_id: string; name: string; category: string; units_sold: number; revenue: number; growth: number; margin: number; }>;
  seasonal_trends: Array<{ period: string; sales: number; comparison: number; }>;
}

export function SalesAnalytics() {
  const [data, setData] = useState<SalesData | null>(null);
  const [period, setPeriod] = useState("30d");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ period });
        if (category !== "all") params.append("category", category);

        const response = await fetch(`/api/analytics/sales?${params.toString()}`);
        if(!response.ok) throw new Error("No se pudieron cargar los datos de ventas.");
        const salesData = await response.json();
        setData(salesData);
      } catch (error) {
        console.error("Error fetching sales data:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchSalesData();
  }, [period, category]);

  const formatCurrency = (amount: number) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount);
  const getGrowthIcon = (growth: number) => growth >= 0 ? <ArrowUp className="h-4 w-4 text-green-500" /> : <ArrowDown className="h-4 w-4 text-red-500" />;
  const getGrowthColor = (growth: number) => growth >= 0 ? "text-green-600" : "text-red-600";

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }
  if (!data) {
    return <p className="text-center text-red-500">Error al cargar los datos de ventas.</p>;
  }

  const totalSales = data.daily_sales.reduce((sum, day) => sum + day.sales, 0);
  const totalOrders = data.daily_sales.reduce((sum, day) => sum + day.orders, 0);
  const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Análisis de Ventas</h2>
        <div className="flex gap-4">
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              <SelectItem value="panes">Panes</SelectItem>
              <SelectItem value="bolleria">Bollería</SelectItem>
              <SelectItem value="tortas">Tortas</SelectItem>
              <SelectItem value="galletas">Galletas</SelectItem>
            </SelectContent>
          </Select>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Últimos 7 días</SelectItem>
              <SelectItem value="30d">Últimos 30 días</SelectItem>
              <SelectItem value="90d">Últimos 90 días</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardHeader><CardTitle className="text-sm font-medium">Ventas Totales</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{formatCurrency(totalSales)}</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm font-medium">Pedidos Totales</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{totalOrders.toLocaleString()}</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm font-medium">Valor Promedio</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{formatCurrency(avgOrderValue)}</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Tendencia de Ventas Diarias</CardTitle></CardHeader>
          <CardContent><div className="h-80"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data.daily_sales}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" tickFormatter={(value) => new Date(value).toLocaleDateString("es-ES", { day: "2-digit", month: "short" })} /><YAxis tickFormatter={(value) => `€${value/1000}k`} /><Tooltip labelFormatter={(value) => new Date(value).toLocaleDateString("es-ES")} formatter={(value: number, name: string) => [name === "sales" ? formatCurrency(value) : value, name === "sales" ? "Ventas" : "Pedidos"]} /><Area type="monotone" dataKey="sales" stroke="#e11d48" fill="#e11d48" fillOpacity={0.3} /></AreaChart></ResponsiveContainer></div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Distribución de Ventas por Hora</CardTitle></CardHeader>
          <CardContent><div className="h-80"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.hourly_distribution}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="hour" tickFormatter={(value) => `${value}:00`} /><YAxis /><Tooltip labelFormatter={(value) => `${value}:00`} formatter={(value: number, name: string) => [name === "sales" ? formatCurrency(value) : value, name === "sales" ? "Ventas" : "Pedidos"]} /><Bar dataKey="sales" fill="#3b82f6" /></BarChart></ResponsiveContainer></div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Rendimiento de Productos</CardTitle></CardHeader>
        <CardContent><div className="space-y-4">{data.product_performance.map((product, index) => (<div key={product.product_id} className="p-4 border rounded-lg"><div className="flex items-center justify-between mb-3"><div className="flex items-center gap-3"><Badge variant="outline">#{index + 1}</Badge><div><h4 className="font-medium">{product.name}</h4><p className="text-sm text-gray-600">{product.category}</p></div></div><div className="flex items-center gap-2">{getGrowthIcon(product.growth)}<span className={`text-sm font-medium ${getGrowthColor(product.growth)}`}>{Math.abs(product.growth)}%</span></div></div><div className="grid grid-cols-2 md:grid-cols-4 gap-4"><div className="text-center p-3 bg-blue-50 rounded-lg"><p className="text-xl font-bold text-blue-600">{product.units_sold}</p><p className="text-sm text-gray-600">Unidades</p></div><div className="text-center p-3 bg-green-50 rounded-lg"><p className="text-xl font-bold text-green-600">{formatCurrency(product.revenue)}</p><p className="text-sm text-gray-600">Ingresos</p></div><div className="text-center p-3 bg-purple-50 rounded-lg"><p className="text-xl font-bold text-purple-600">{product.margin.toFixed(1)}%</p><p className="text-sm text-gray-600">Margen</p></div><div className="text-center p-3 bg-orange-50 rounded-lg"><p className="text-xl font-bold text-orange-600">{formatCurrency(product.revenue / product.units_sold)}</p><p className="text-sm text-gray-600">Precio Prom.</p></div></div></div>))}</div></CardContent>
      </Card>
    </div>
  )
}