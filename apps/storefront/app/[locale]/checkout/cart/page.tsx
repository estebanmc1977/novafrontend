"use client";

// Ruta de fallback — abre el drawer automáticamente al entrar vía URL directa
import { useEffect } from "react";
import { useCart } from "@/contexts/CartContext";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { openCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    openCart();
    router.replace("/tienda");
  }, [openCart, router]);

  return null;
}
