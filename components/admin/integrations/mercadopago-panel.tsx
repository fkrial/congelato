"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, DollarSign, TrendingUp, AlertCircle, Clock, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface Transaction {
    id: string;
    amount: number;
    status: 'approved' | 'pending' | 'rejected';
    customer: string;
    date: string;
    orderId: string;
}

interface Summary {
    totalRevenue: number;
    processedPayments: number;
    pendingPayments: number;
    recentTransactions: Transaction[];
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'approved':
            return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1"/>Aprobado</Badge>;
        case 'pending':
            return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1"/>Pendiente</Badge>;
        case 'rejected':
            return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1"/>Rechazado</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
}

export function MercadoPagoPanel() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/payments/mercadopago');
            if (!res.ok) throw new Error("No se pudieron cargar los datos de MercadoPago.");
            const data = await res.json();
            setSummary(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };
    fetchSummary();
  }, []);
  
  if (isLoading) {
      return (
          <div className="flex justify-center items-center p-8">
              <Loader2 className="h-8 w-8 animate-spin" />
          </div>
      );
  }

  if (!summary) {
      return <p>No se pudieron cargar los datos de MercadoPago.</p>
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Ingresos Aprobados</p>
                <p className="text-2xl font-bold">€{summary.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Pagos Procesados</p>
                <p className="text-2xl font-bold">{summary.processedPayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <div>
                <p className="text-sm font-medium">Pagos Pendientes</p>
                <p className="text-2xl font-bold">{summary.pendingPayments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <div>
                <p className="text-sm font-medium">Conectado</p>
                <Badge className="bg-green-100 text-green-800 mt-1">Activo</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Payments */}
      <Card>
        <CardHeader>
          <CardTitle>Transacciones Recientes</CardTitle>
          <CardDescription>Últimas transacciones procesadas por MercadoPago.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {summary.recentTransactions.map((payment) => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="font-medium">{payment.customer}</p>
                    {getStatusBadge(payment.status)}
                  </div>
                  <p className="text-sm text-gray-600">Pedido: {payment.orderId}</p>
                  <p className="text-xs text-gray-500">{new Date(payment.date).toLocaleString('es-ES')}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold">€{payment.amount.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}