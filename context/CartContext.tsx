import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { CartItem, Product, ProductSize } from '../types';

export interface PromoCode {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  minOrder?: number;
  description: string;
}

const PROMO_CODES: PromoCode[] = [
  { code: 'BALLS10', type: 'percent', value: 10, description: '10% off your order' },
  { code: 'SILK20', type: 'percent', value: 20, minOrder: 200, description: '20% off orders over $200' },
  { code: 'FIRST15', type: 'fixed', value: 15, description: '$15 off your first order' },
  { code: 'MIDNIGHT', type: 'percent', value: 15, description: '15% off the entire order' },
];

interface CartContextType {
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (product: Product, size: ProductSize) => void;
  removeFromCart: (id: string, size: ProductSize) => void;
  updateQuantity: (id: string, size: ProductSize, delta: number) => void;
  clearCart: () => void;
  totalPrice: number;
  subtotalPrice: number;
  discount: number;
  cartCount: number;
  cartBump: number;
  appliedPromo: PromoCode | null;
  promoError: string;
  applyPromo: (code: string) => boolean;
  removePromo: () => void;
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
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [promoError, setPromoError] = useState('');

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
    setAppliedPromo(null);
    setPromoError('');
  }, []);

  const subtotalPrice = useMemo(() => cart.reduce((acc, item) => acc + item.price * item.quantity, 0), [cart]);

  const discount = useMemo(() => {
    if (!appliedPromo) return 0;
    if (appliedPromo.minOrder && subtotalPrice < appliedPromo.minOrder) return 0;
    if (appliedPromo.type === 'percent') return Math.round(subtotalPrice * appliedPromo.value / 100);
    return Math.min(appliedPromo.value, subtotalPrice);
  }, [appliedPromo, subtotalPrice]);

  const totalPrice = useMemo(() => Math.max(0, subtotalPrice - discount), [subtotalPrice, discount]);
  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);

  const applyPromo = useCallback((code: string) => {
    setPromoError('');
    const upper = code.trim().toUpperCase();
    const promo = PROMO_CODES.find(p => p.code === upper);
    if (!promo) {
      setPromoError('Invalid promo code');
      return false;
    }
    if (promo.minOrder && subtotalPrice < promo.minOrder) {
      setPromoError(`Minimum order $${promo.minOrder} required`);
      return false;
    }
    setAppliedPromo(promo);
    return true;
  }, [subtotalPrice]);

  const removePromo = useCallback(() => {
    setAppliedPromo(null);
    setPromoError('');
  }, []);

  const value = useMemo(() => ({
    cart,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    totalPrice,
    subtotalPrice,
    discount,
    cartCount,
    cartBump,
    appliedPromo,
    promoError,
    applyPromo,
    removePromo,
  }), [cart, isCartOpen, addToCart, removeFromCart, updateQuantity, clearCart, totalPrice, subtotalPrice, discount, cartCount, cartBump, appliedPromo, promoError, applyPromo, removePromo]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
