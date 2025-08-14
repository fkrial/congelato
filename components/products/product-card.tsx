"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/components/ui/use-toast";

interface Product {
  id: number;
  name: string;
  base_price: string;
  image_url: string | null;
  category_name: string;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  // Esta función ahora solo añade el producto base (sin variantes)
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevenir la navegación del Link padre
    e.stopPropagation(); // Detener la propagación del evento
    addToCart(product, 1); // Añade el producto base, sin variante
    toast({
      title: "¡Añadido!",
      description: `${product.name} ha sido añadido a tu carrito.`,
    });
  };

  return (
    <Link href={`/products/${product.id}`} className="block h-full">
      <div className="bg-white rounded-2xl shadow-sm card-hover overflow-hidden h-full flex flex-col">
        <div className="relative overflow-hidden">
          <img
            src={product.image_url || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            className="w-full h-48 object-cover product-image-hover"
          />
        </div>
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center justify-between mb-2">
            <Badge variant="outline" className="text-xs">{product.category_name}</Badge>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600">4.9</span>
            </div>
          </div>
          <h3 className="font-semibold text-lg text-gray-900 mb-4 flex-grow line-clamp-2">{product.name}</h3>
          <div className="flex items-center justify-between mt-auto">
            <span className="font-bold text-lg text-primary">€{parseFloat(product.base_price).toFixed(2)}</span>
            <Button onClick={handleAddToCart} size="sm" className="bg-primary hover:bg-primary/90 text-white">Añadir</Button>
          </div>
        </div>
      </div>
    </Link>
  );
}