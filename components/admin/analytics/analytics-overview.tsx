"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, DollarSign, ShoppingCart, Users, Package, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

interface AnalyticsData {
  revenue: { total: number; growth: number; monthly_trend: Array<{ month: string; revenue: number }>; };
  orders: { total: number; growth: number; average_value: number; completion_rate: number; };
  customers: { total: number; new_customers: number; retention_rate: number; lifetime_value: number; };
  products: { total_sold: number; top_performers: Array<{ name: string; sales: number; revenue: number }>; inventory_turnover: number; };
  profitability: { gross_margin: number; net_margin: number; cost_breakdown: Array<{ category: string; percentage: number }>; };
}

const COLORS = ["#e11d48", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6"];

export function AnalyticsOverview() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [period, setPeriod] = useState("30d");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/analytics/overview?period=${period}`);
            if (!response.ok) throw new Error("No se pudieron cargar los datos.");
            const analyticsData = await response.json();
            setData(analyticsData);
        } catch (error) {
            console.error("Error fetching analytics:", error);
            setData(null);
        } finally {
            setLoading(false);
        }
    };
    fetchAnalytics();
  }, [period]);

  const formatCurrency = (amount: number) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount);
  const getGrowthIcon = (growth: number) => growth >= 0 ? <ArrowUp className="h-4 w-4 text-green-500" /> : <ArrowDown className="h-4 w-4 text-red-500" />;
  const getGrowthColor = (growth: number) => growth >= 0 ? "text-green-600" : "text-red-600";

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }
  if (!data) {
    return <p className="text-center text-red-500">Error al cargar los datos del resumen. Por favor, inténtalo de nuevo.</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Resumen Ejecutivo</h2>
        <Select value={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Últimos 7 días</SelectItem>
            <SelectItem value="30d">Últimos 30 días</SelectItem>
            <SelectItem value="90d">Últimos 90 días</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Ingresos Totales</CardTitle><DollarSign className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.revenue.total)}</div>
            <p className={`text-xs ${getGrowthColor(data.revenue.growth)}`}>{data.revenue.growth.toFixed(1)}% vs período anterior</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Pedidos Totales</CardTitle><ShoppingCart className="h-4 w-4 text-muted-foreground" /></CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{Math.round(data.orders.total).toLocaleString()}</div>
            <p className={`text-xs ${getGrowthColor(data.orders.growth)}`}>{data.orders.growth.toFixed(1)}% vs período anterior</p>
          </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Nuevos Clientes</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">+{Math.round(data.customers.new_customers).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">En el período seleccionado</p>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Productos Vendidos</CardTitle><Package className="h-4 w-4 text-muted-foreground" /></CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{Math.round(data.products.total_sold).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">Unidades totales</p>
            </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Tendencia de Ingresos</CardTitle></CardHeader>
          <CardContent><div className="h-80"><ResponsiveContainer width="100%" height="100%"><LineChart data={data.revenue.monthly_trend}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis tickFormatter={(value) => `€${value/1000}k`} /><Tooltip formatter={(value: number) => [formatCurrency(value), "Ingresos"]} /><Line type="monotone" dataKey="revenue" stroke="#e11d48" strokeWidth={2} /></LineChart></ResponsiveContainer></div></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Distribución de Costos</CardTitle></CardHeader>
          <CardContent><div className="h-80"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data.profitability.cost_breakdown} cx="50%" cy="50%" labelLine={false} label={({ category, percentage }) => `${category}: ${percentage}%`} outerRadius={80} fill="#8884d8" dataKey="percentage">{data.profitability.cost_breakdown.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip /></PieChart></ResponsiveContainer></div></CardContent>
        </Card>
      </div>
    </div>
  )
}