"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Lock, Mail, Loader2 } from "lucide-react"

export function LoginForm() {
  const [email, setEmail] = useState("admin@panaderia.com")
  const [password, setPassword] = useState("admin123")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    // 1. Prevenir el comportamiento por defecto del formulario (recargar la página)
    e.preventDefault();
    console.log("Formulario enviado, recarga prevenida."); // Log de depuración

    setIsLoading(true);
    setError("");

    try {
      console.log("Enviando petición fetch a /api/auth/login..."); // Log de depuración

      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      
      console.log("Respuesta recibida del servidor, status:", response.status); // Log de depuración

      const data = await response.json();
      console.log("Datos de la respuesta:", data); // Log de depuración

      if (response.ok) {
        console.log("Login OK, redirigiendo al dashboard..."); // Log de depuración
        router.push("/admin/dashboard");
        router.refresh(); 
      } else {
        setError(data.message || "Credenciales incorrectas.");
      }
    } catch (err) {
      console.error("Error en el bloque try-catch de handleSubmit:", err); // Log de error
      setError("Error de conexión. Revisa la consola para más detalles.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center">Iniciar Sesión</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email" type="email" placeholder="admin@panaderia.com"
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="pl-10" required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password" type={showPassword ? "text" : "password"} placeholder="••••••••"
                value={password} onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10" required
              />
              <button
                type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
            {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Iniciando...</> : "Iniciar Sesión"}
          </Button>

        </form>
      </CardContent>
    </Card>
  )
}