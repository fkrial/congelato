"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Users, Target, TrendingUp, Award, Loader2 } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

interface CustomerData {
  segmentation: Array<{ segment: string; count: number; percentage: number; avg_order_value: number; frequency: number; }>;
  acquisition: Array<{ channel: string; customers: number; cost_per_acquisition: number; lifetime_value: number; roi: number; }>;
  retention: Array<{ cohort: string; month_1: number; month_3: number; month_6: number; month_12: number; }>;
  behavior: { avg_session_duration: number; pages_per_session: number; bounce_rate: number; conversion_rate: number; };
}

const COLORS = ["#e11d48", "#f59e0b", "#10b981", "#3b82f6"];

export function CustomerAnalytics() {
  const [data, setData] = useState<CustomerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomerData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/analytics/customers");
        if (!response.ok) throw new Error("No se pudieron cargar los datos de clientes.");
        const customerData = await response.json();
        setData(customerData);
      } catch (error) {
        console.error("Error fetching customer data:", error);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomerData();
  }, []);
  
  const formatCurrency = (amount: number) => new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" }).format(amount);

  if (loading) {
    return <div className="flex justify-center items-center h-96"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  }
  if (!data) {
    return <p className="text-center text-red-500">Error al cargar los datos de clientes.</p>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Análisis de Clientes</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card><CardHeader><CardTitle className="text-sm font-medium">Duración Promedio</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{data.behavior.avg_session_duration.toFixed(1)} min</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{data.behavior.conversion_rate}%</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm font-medium">Páginas por Sesión</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{data.behavior.pages_per_session.toFixed(1)}</p></CardContent></Card>
        <Card><CardHeader><CardTitle className="text-sm font-medium">Tasa de Rebote</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">{data.behavior.bounce_rate}%</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Segmentación de Clientes</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data.segmentation} cx="50%" cy="50%" labelLine={false} label={({ segment, percentage }) => `${segment}: ${percentage.toFixed(0)}%`} outerRadius={80} fill="#8884d8" dataKey="count">{data.segmentation.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
            <div className="space-y-3 mt-4">{data.segmentation.map((segment, index) => (<div key={segment.segment} className="flex items-center justify-between p-3 border rounded-lg"><div className="flex items-center gap-3"><div className="w-4 h-4 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} /><div><h4 className="font-medium">{segment.segment}</h4><p className="text-sm text-gray-600">{segment.count} clientes</p></div></div><div className="text-right"><p className="font-bold">{formatCurrency(segment.avg_order_value)}</p><p className="text-sm text-gray-600">{segment.frequency.toFixed(1)} ped/mes</p></div></div>))}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Canales de Adquisición</CardTitle></CardHeader>
          <CardContent><div className="space-y-4">{data.acquisition.map((channel) => (<div key={channel.channel} className="p-4 border rounded-lg"><div className="flex items-center justify-between mb-3"><h4 className="font-medium">{channel.channel}</h4><Badge variant="outline">{channel.customers} clientes</Badge></div><div className="grid grid-cols-3 gap-4 text-sm"><div><p className="text-gray-600">CAC</p><p className="font-bold">{formatCurrency(channel.cost_per_acquisition)}</p></div><div><p className="text-gray-600">LTV</p><p className="font-bold">{formatCurrency(channel.lifetime_value)}</p></div><div><p className="text-gray-600">ROI</p><p className="font-bold text-green-600">{channel.roi}%</p></div></div></div>))}</div></CardContent>
        </Card>
      </div>
    </div>
  );
}