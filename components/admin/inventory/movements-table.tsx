"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUp, ArrowDown, RotateCcw, Trash2 } from "lucide-react"

const mockMovements = [
  {
    id: 1,
    material: "Harina de trigo",
    type: "purchase",
    quantity: 50.0,
    unit: "kg",
    unitCost: 1.5,
    totalCost: 75.0,
    reference: "COMP-001",
    notes: "Compra mensual regular",
    date: "2024-01-15 09:30",
    user: "Admin",
  },
  {
    id: 2,
    material: "Azúcar blanca",
    type: "usage",
    quantity: -12.5,
    unit: "kg",
    unitCost: 2.0,
    totalCost: 25.0,
    reference: "PROD-045",
    notes: "Producción de pasteles",
    date: "2024-01-15 08:15",
    user: "Baker1",
  },
  {
    id: 3,
    material: "Mantequilla",
    type: "adjustment",
    quantity: -2.0,
    unit: "kg",
    unitCost: 8.5,
    totalCost: 17.0,
    reference: "ADJ-003",
    notes: "Ajuste por caducidad",
    date: "2024-01-14 16:45",
    user: "Admin",
  },
  {
    id: 4,
    material: "Huevos",
    type: "purchase",
    quantity: 100,
    unit: "unidades",
    unitCost: 0.25,
    totalCost: 25.0,
    reference: "COMP-002",
    notes: "Reposición semanal",
    date: "2024-01-14 10:20",
    user: "Admin",
  },
]

const movementTypes = {
  purchase: { label: "Compra", color: "bg-green-100 text-green-800", icon: ArrowUp },
  usage: { label: "Uso", color: "bg-blue-100 text-blue-800", icon: ArrowDown },
  adjustment: { label: "Ajuste", color: "bg-yellow-100 text-yellow-800", icon: RotateCcw },
  waste: { label: "Desperdicio", color: "bg-red-100 text-red-800", icon: Trash2 },
}

export function MovementsTable() {
  const [movements] = useState(mockMovements)

  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Material</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Cantidad</TableHead>
                <TableHead>Costo Unitario</TableHead>
                <TableHead>Costo Total</TableHead>
                <TableHead>Referencia</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Notas</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movements.map((movement) => {
                const type = movementTypes[movement.type as keyof typeof movementTypes]
                const TypeIcon = type.icon

                return (
                  <TableRow key={movement.id}>
                    <TableCell>
                      <span className="text-sm text-gray-600">{movement.date}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-gray-900">{movement.material}</span>
                    </TableCell>
                    <TableCell>
                      <Badge className={type.color}>
                        <TypeIcon className="w-3 h-3 mr-1" />
                        {type.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${movement.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                        {movement.quantity > 0 ? "+" : ""}
                        {movement.quantity} {movement.unit}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-600">€{movement.unitCost.toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">€{movement.totalCost.toFixed(2)}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">{movement.reference}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-600">{movement.user}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-gray-500">{movement.notes}</span>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
