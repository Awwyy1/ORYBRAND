import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { CartItem, Product, ProductSize } from '../types';

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, size: ProductSize) => void;
  removeFromCart: (id: string, size: ProductSize) => void;
  updateQuantity: (id: string, size: ProductSize, delta: number) => void;
  clearCart: () => void;
  totalPrice: number;
  cartCount: number;
  cartBump: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

function loadCart(): CartItem[] {
  try {
    const saved = localStorage.getItem('ory-cart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(loadCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartBump, setCartBump] = useState(0);

  useEffect(() => {
    localStorage.setItem('ory-cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback((product: Product, size: ProductSize) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id && item.selectedSize === size);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id && item.selectedSize === size
            ? { ...item, quantity: Math.min(item.quantity + 1, 10) }
            : item
        );
      }
      return [...prev, { ...product, selectedSize: size, quantity: 1 }];
    });
    setCartBump((prev) => prev + 1);
  }, []);

  const removeFromCart = useCallback((id: string, size: ProductSize) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.selectedSize === size)));
  }, []);

  const updateQuantity = useCallback((id: string, size: ProductSize, delta: number) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id && item.selectedSize === size) {
          const nextQty = item.quantity + delta;
          return { ...item, quantity: Math.max(1, Math.min(10, nextQty)) };
        }
        return item;
      })
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const totalPrice = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0), [cart]);
  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

  const value = useMemo(() => ({
    cart,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPrice,
    cartCount,
    cartBump
  }), [cart, isCartOpen, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice, cartCount, cartBump]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
