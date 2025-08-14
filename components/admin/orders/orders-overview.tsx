import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Clock, CheckCircle, AlertCircle } from "lucide-react"

interface OverviewData {
    totalOrders: number;
    pending: number;
    inProduction: number;
    readyOrDelivered: number;
}

// El componente ahora recibe los datos como props
export function OrdersOverview({ data }: { data: OverviewData }) {
    const stats = [
        { title: "Pedidos Totales", value: data.totalOrders, icon: ShoppingCart },
        { title: "Pendientes", value: data.pending, icon: Clock },
        { title: "En Producción", value: data.inProduction, icon: AlertCircle },
        { title: "Listos/Entregados", value: data.readyOrDelivered, icon: CheckCircle },
    ];
  
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat) => (
                <Card key={stat.title}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-gray-600">{stat.title}</CardTitle>
                        <stat.icon className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}