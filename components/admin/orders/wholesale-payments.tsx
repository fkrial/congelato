"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertTriangle, DollarSign, Clock, CheckCircle, Phone, Mail } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface WholesaleOrder {
  id: number
  order_number: string
  customer_name: string
  customer_email: string
  customer_phone: string
  payment_status: string
  payment_terms: string
  delivery_date: string
  payment_due_date: string
  days_overdue: number
  total_amount: number
}

interface WholesalePaymentsProps {
    initialOrders: WholesaleOrder[];
    onDataChange: () => void;
}

export default function WholesalePayments({ initialOrders, onDataChange }: WholesalePaymentsProps) {
  const [orders, setOrders] = useState(initialOrders);
  const [filteredOrders, setFilteredOrders] = useState(initialOrders);
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);
  
  useEffect(() => {
    let filtered = orders;
    if (paymentFilter !== "all") {
      filtered = filtered.filter((order) => order.payment_status === paymentFilter);
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.order_number.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    setFilteredOrders(filtered);
  }, [orders, paymentFilter, searchTerm]);

  const handleMarkAsPaid = async (orderId: number) => {
    try {
      const response = await fetch("/api/orders/wholesale", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, payment_status: "paid" }),
      });
      if (!response.ok) throw new Error("No se pudo actualizar el estado de pago.");
      toast({ title: "Éxito", description: "El pago se ha marcado como pagado." });
      onDataChange(); // Recargar datos desde el padre
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: (error as Error).message });
    }
  };

  const getPaymentStatusBadge = (status: string, daysOverdue: number) => {
    if (status === "paid") return <Badge className="bg-green-500 text-white">Pagado</Badge>;
    if (status === "overdue") return <Badge variant="destructive">Vencido ({daysOverdue} días)</Badge>;
    return <Badge variant="secondary">Pendiente</Badge>;
  };

  const stats = useMemo(() => ({
    total: orders.length,
    pending: orders.filter((o) => o.payment_status === "pending").length,
    overdue: orders.filter((o) => o.payment_status === "overdue").length,
    paid: orders.filter((o) => o.payment_status === "paid").length,
    totalPending: orders.filter((o) => o.payment_status !== "paid").reduce((sum, o) => sum + Number(o.total_amount), 0),
  }), [orders]);

  return (
    <div className="space-y-6">
      {/* ... (Tu JSX para las tarjetas de estadísticas, sin cambios) ... */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* ... */}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pagos Mayoristas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            <Input
              placeholder="Buscar por cliente o pedido..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Select value={paymentFilter} onValueChange={setPaymentFilter}>
              <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="overdue">Vencidos</SelectItem>
                <SelectItem value="paid">Pagados</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <Card key={order.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <div className="flex items-center gap-3">
                            <h3 className="font-semibold">{order.order_number}</h3>
                            {getPaymentStatusBadge(order.payment_status, order.days_overdue)}
                        </div>
                        <p className="text-sm text-gray-600">{order.customer_name}</p>
                        <div className="flex gap-4 text-sm text-gray-500">
                            <span>Vence: {new Date(order.payment_due_date).toLocaleDateString()}</span>
                        </div>
                    </div>
                    <div className="text-right space-y-2">
                        <p className="text-2xl font-bold text-green-600">€{Number(order.total_amount).toLocaleString()}</p>
                        {order.payment_status !== "paid" && (
                            <Button size="sm" onClick={() => handleMarkAsPaid(order.id)}>Marcar Pagado</Button>
                        )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}