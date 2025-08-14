"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, Plus, Star } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface Variant {
  id: number;
  name: string;
  price_modifier: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  base_price: string;
  image_url: string | null;
  category_name: string;
  variants: Variant[];
}

export function ProductDetail({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState<Variant | undefined>(undefined);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        if (!res.ok) throw new Error("Producto no encontrado");
        const data = await res.json();
        setProduct(data);
        if (data.variants && data.variants.length > 0) {
          setSelectedVariant(data.variants[0]);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);
  
  const handleAddToCart = () => {
    if (product) {
      addToCart(product, 1, selectedVariant);
      toast({
        title: "¡Añadido al carrito!",
        description: `${product.name} ${selectedVariant ? `(${selectedVariant.name})` : ''} ha sido añadido.`,
      });
    }
  };

  const finalPrice = product ? parseFloat(product.base_price) + (selectedVariant ? parseFloat(selectedVariant.price_modifier) : 0) : 0;

  if (isLoading) return <div className="flex justify-center items-center h-96"><Loader2 className="h-12 w-12 animate-spin text-primary" /></div>;
  if (!product) return <p>Producto no encontrado.</p>;

  return (
    <>
    <Toaster />
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>
        <img src={product.image_url || "/placeholder.svg?w=600&h=600"} alt={product.name} className="w-full h-auto object-cover rounded-lg shadow-md" />
      </div>
      <div className="space-y-6">
        <Badge variant="outline">{product.category_name}</Badge>
        <h1 className="text-4xl font-serif font-bold">{product.name}</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center"><Star className="w-5 h-5 fill-yellow-400 text-yellow-400" /><Star className="w-5 h-5 fill-yellow-400 text-yellow-400" /><Star className="w-5 h-5 fill-yellow-400 text-yellow-400" /><Star className="w-5 h-5 fill-yellow-400 text-yellow-400" /><Star className="w-5 h-5 fill-yellow-400 text-yellow-400" /></div>
          <span className="text-gray-600">(125 valoraciones)</span>
        </div>
        <p className="text-gray-600 text-lg leading-relaxed">{product.description}</p>
        
        {product.variants && product.variants.length > 0 && (
          <div>
            <Label className="text-base font-semibold mb-3 block">Elige una opción:</Label>
            <RadioGroup value={selectedVariant?.id.toString()} onValueChange={(value) => setSelectedVariant(product.variants.find(v => v.id.toString() === value))}>
              {product.variants.map(variant => (
                <div key={variant.id} className="flex items-center space-x-2">
                  <RadioGroupItem value={variant.id.toString()} id={`variant-${variant.id}`} />
                  <Label htmlFor={`variant-${variant.id}`} className="flex-grow">{variant.name}</Label>
                  <span className="text-sm font-medium">
                    {parseFloat(variant.price_modifier) > 0 ? `+€${parseFloat(variant.price_modifier).toFixed(2)}` : ''}
                  </span>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <span className="text-3xl font-bold text-primary">€{finalPrice.toFixed(2)}</span>
          <Button onClick={handleAddToCart} size="lg" className="bg-primary text-white hover:bg-primary/90">
            <Plus className="w-5 h-5 mr-2"/>
            Añadir al Carrito
          </Button>
        </div>
      </div>
    </div>
    </>
  );
}