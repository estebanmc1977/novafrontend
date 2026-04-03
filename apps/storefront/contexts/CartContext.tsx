"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import {
  getCart,
  addToCart as cartAdd,
  updateQuantity as cartUpdateQty,
  removeFromCart as cartRemove,
  CART_UPDATED_EVENT,
  type CartItem,
} from "@/lib/cart";

export type AppliedCoupon = {
  code: string;
  discountPct: number;
  label: string;
};

type CartContextType = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item: Omit<CartItem, "quantity"> & { quantity?: number }) => void;
  updateQty: (slug: string, mode: "once" | "sub", freq: 30 | 60 | 90, delta: number) => void;
  removeItem: (slug: string, mode: "once" | "sub", freq: 30 | 60 | 90) => void;
  coupon: AppliedCoupon | null;
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [coupon, setCoupon] = useState<AppliedCoupon | null>(null);

  const sync = useCallback(() => setItems(getCart()), []);

  useEffect(() => {
    sync();
    window.addEventListener(CART_UPDATED_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CART_UPDATED_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, [sync]);

  // Cerrar con Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setIsOpen(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addToCart: (item) => {
          cartAdd(item);
          setIsOpen(true);
        },
        updateQty: (slug, mode, freq, delta) => {
          cartUpdateQty(slug, mode, freq, delta);
        },
        removeItem: (slug, mode, freq) => {
          cartRemove(slug, mode, freq);
        },
        coupon,
        applyCoupon: (c) => setCoupon(c),
        removeCoupon: () => setCoupon(null),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextType {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de CartProvider");
  return ctx;
}
