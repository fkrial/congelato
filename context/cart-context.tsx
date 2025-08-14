"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Las interfaces no cambian
interface Product {
  id: number;
  name: string;
  base_price: string;
  image_url: string | null;
}
interface Variant {
  id: number;
  name: string;
  price_modifier: string;
}
interface CartItem extends Product {
  quantity: number;
  variant?: Variant;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, variant?: Variant) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Se exporta para poder usarla en CartContents
export const generateCartItemId = (productId: number, variantId?: number) => {
  return variantId ? `${productId}-${variantId}` : `${productId}`;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('shoppingCart');
      if (storedCart) {
        setCartItems(JSON.parse(storedCart));
      }
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('shoppingCart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product: Product, quantity: number, variant?: Variant) => {
    setCartItems(prevItems => {
      const cartItemId = generateCartItemId(product.id, variant?.id);
      const existingItem = prevItems.find(item => generateCartItemId(item.id, item.variant?.id) === cartItemId);

      if (existingItem) {
        return prevItems.map(item =>
          generateCartItemId(item.id, item.variant?.id) === cartItemId
            ? { ...item, quantity: (item.quantity || 0) + quantity } // Lógica robusta
            : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => generateCartItemId(item.id, item.variant?.id) !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    const safeQuantity = Math.max(0, quantity); // Asegurarse de que la cantidad no sea negativa
    if (safeQuantity === 0) {
      removeFromCart(cartItemId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(item =>
          generateCartItemId(item.id, item.variant?.id) === cartItemId ? { ...item, quantity: safeQuantity } : item
        )
      );
    }
  };

  const clearCart = () => {
    setCartItems([]);
  };

  // Cálculos robustos para evitar NaN
  const itemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const totalPrice = cartItems.reduce((sum, item) => {
    const price = parseFloat(item.base_price) || 0;
    const modifier = item.variant ? (parseFloat(item.variant.price_modifier) || 0) : 0;
    const quantity = item.quantity || 0;
    return sum + (price + modifier) * quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, itemCount, totalPrice }}>
      {children}
    </CartContext.Provider>
  );
};