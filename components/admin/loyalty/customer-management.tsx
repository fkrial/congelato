"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Gift, Mail, Phone, Calendar, Award, Star, Crown, Gem } from "lucide-react"

interface LoyaltyCustomer {
  id: string
  name: string
  email: string
  phone: string
  points: number
  total_spent: number
  membership_level: "bronze" | "silver" | "gold" | "platinum"
  join_date: string
  last_purchase: string
  purchases_count: number
  referrals_count: number
}

export function CustomerManagement() {
  const [customers, setCustomers] = useState<LoyaltyCustomer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<LoyaltyCustomer[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [levelFilter, setLevelFilter] = useState("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCustomers()
  }, [])

  useEffect(() => {
    filterCustomers()
  }, [customers, searchTerm, levelFilter])

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/loyalty/customers")
      const data = await response.json()
      setCustomers(data.customers || [])
    } catch (error) {
      console.error("Error fetching customers:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterCustomers = () => {
    let filtered = customers

    if (searchTerm) {
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (levelFilter !== "all") {
      filtered = filtered.filter((customer) => customer.membership_level === levelFilter)
    }

    setFilteredCustomers(filtered)
  }

  const getMembershipIcon = (level: string) => {
    switch (level) {
      case "bronze":
        return <Award className="h-4 w-4 text-amber-600" />
      case "silver":
        return <Star className="h-4 w-4 text-gray-500" />
      case "gold":
        return <Crown className="h-4 w-4 text-yellow-500" />
      case "platinum":
        return <Gem className="h-4 w-4 text-purple-500" />
      default:
        return null
    }
  }

  const getMembershipColor = (level: string) => {
    switch (level) {
      case "bronze":
        return "bg-amber-100 text-amber-800"
      case "silver":
        return "bg-gray-100 text-gray-800"
      case "gold":
        return "bg-yellow-100 text-yellow-800"
      case "platinum":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const awardBonusPoints = async (customerId: string, points: number) => {
    try {
      await fetch("/api/loyalty/points", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_id: customerId,
          type: "bonus",
          points: points,
          description: `Puntos bonus otorgados por administrador`,
        }),
      })

      alert(`${points} puntos bonus otorgados exitosamente`)
      fetchCustomers() // Refrescar datos
    } catch (error) {
      alert("Error al otorgar puntos bonus")
    }
  }

  if (loading) {
    return <div>Cargando clientes...</div>
  }

  return (
    <div className="space-y-6">
      {/* Controles */}
      <Card>
        <CardHeader>
          <CardTitle>Gestión de Clientes del Programa de Fidelidad</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filtrar por nivel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los niveles</SelectItem>
                <SelectItem value="bronze">Bronze</SelectItem>
                <SelectItem value="silver">Silver</SelectItem>
                <SelectItem value="gold">Gold</SelectItem>
                <SelectItem value="platinum">Platinum</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Clientes */}
      <div className="grid gap-4">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-lg">{customer.name}</h3>
                    <Badge className={getMembershipColor(customer.membership_level)}>
                      {getMembershipIcon(customer.membership_level)}
                      <span className="ml-1">{customer.membership_level.toUpperCase()}</span>
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Mail className="h-4 w-4" />
                      {customer.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Phone className="h-4 w-4" />
                      {customer.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      Miembro desde {new Date(customer.join_date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Gift className="h-4 w-4" />
                      {customer.referrals_count} referidos
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <p className="text-2xl font-bold text-blue-600">{customer.points.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Puntos</p>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <p className="text-2xl font-bold text-green-600">${customer.total_spent.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Total Gastado</p>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <p className="text-2xl font-bold text-purple-600">{customer.purchases_count}</p>
                      <p className="text-sm text-gray-600">Compras</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <p className="text-2xl font-bold text-orange-600">
                        ${Math.round(customer.total_spent / customer.purchases_count)}
                      </p>
                      <p className="text-sm text-gray-600">Promedio</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2 ml-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => awardBonusPoints(customer.id, 100)}
                    className="whitespace-nowrap"
                  >
                    <Gift className="h-4 w-4 mr-2" />
                    +100 Puntos
                  </Button>
                  <Button size="sm" variant="outline" className="whitespace-nowrap bg-transparent">
                    Ver Historial
                  </Button>
                  <Button size="sm" variant="outline" className="whitespace-nowrap bg-transparent">
                    Enviar Promoción
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500">No se encontraron clientes con los filtros aplicados</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
