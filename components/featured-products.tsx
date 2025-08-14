"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, Loader2 } from "lucide-react";
import { useCart } from "@/context/cart-context"; // Importar hook
import { useToast } from "@/components/ui/use-toast"; // Importar toast
import { Toaster } from "@/components/ui/toaster"; // Importar Toaster


interface Product {
  id: number;
  name: string;
  description: string;
  base_price: string;
  image_url: string | null;
  category_name: string;
  is_featured: boolean;
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hoveredProduct, setHoveredProduct] = useState<number | null>(null);
  const { addToCart } = useCart(); // Usar hook del carrito
  const { toast } = useToast(); // Usar hook de toast

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/products?featured=true');
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Error fetching featured products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    toast({
      title: "¡Añadido!",
      description: `${product.name} ha sido añadido a tu carrito.`,
    });
  };

  return (
    <section className="py-16 bg-bakery-primary-light">
      <Toaster />
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-serif font-bold text-3xl md:text-4xl text-gray-900 mb-4">
            Nuestras Creaciones Especiales
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Cada producto es elaborado con ingredientes premium y técnicas tradicionales.
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl shadow-sm card-hover overflow-hidden"
                onMouseEnter={() => setHoveredProduct(product.id)}
                onMouseLeave={() => setHoveredProduct(null)}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image_url || "/placeholder.svg?height=300&width=300"}
                    alt={product.name}
                    className="w-full h-48 object-cover product-image-hover"
                  />
                  {hoveredProduct === product.id && (
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                      <Button onClick={() => handleAddToCart(product)} className="bg-white text-primary hover:bg-gray-50"><Plus className="w-4 h-4 mr-2" />Agregar</Button>
                    </div>
                  )}
                </div>
                <div className="p-6 flex flex-col h-full">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">{product.category_name}</Badge>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm text-gray-600">4.9</span>
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-4 flex-grow line-clamp-2">{product.name}</h3>
                  <div className="flex items-center justify-between mt-auto mb-4">
                    <span className="font-bold text-lg text-primary">€{parseFloat(product.base_price).toFixed(2)}</span>
                  </div>
                  <Button onClick={() => handleAddToCart(product)} className="w-full bg-primary hover:bg-primary/90 text-white">Agregar al Carrito</Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}