"use client"

import { useState } from "react"
import Link from "next/link"
import { ShoppingCart, Menu, X, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/context/cart-context" // Importar el hook del carrito

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { itemCount } = useCart(); // Usar el hook para obtener el contador de ítems

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-serif font-bold text-xl text-gray-900">Panadería Artesanal</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="text-gray-700 hover:text-primary transition-colors">
              Productos
            </Link>
            <Link href="/nosotros" className="text-gray-700 hover:text-primary transition-colors">
              Nosotros
            </Link>
            <Link href="/mayorista" className="text-gray-700 hover:text-primary transition-colors">
              Mayorista
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link href="/admin/dashboard" passHref>
                <Button variant="ghost" size="sm" className="hidden md:flex">
                    <User className="w-4 h-4 mr-2" />
                    Admin
                </Button>
            </Link>

            <Button asChild variant="ghost" size="sm" className="relative">
              <Link href="/cart">
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-bakery-accent text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
                    {itemCount}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <nav className="flex flex-col space-y-4">
              <Link href="/products" onClick={()=>setIsMenuOpen(false)} className="text-gray-700 hover:text-primary transition-colors">Productos</Link>
              <Link href="/nosotros" onClick={()=>setIsMenuOpen(false)} className="text-gray-700 hover:text-primary transition-colors">Nosotros</Link>
              <Link href="/mayorista" onClick={()=>setIsMenuOpen(false)} className="text-gray-700 hover:text-primary transition-colors">Mayorista</Link>
              <Link href="/admin/dashboard" onClick={()=>setIsMenuOpen(false)} className="text-gray-700 hover:text-primary transition-colors pt-4 border-t">Panel Admin</Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}