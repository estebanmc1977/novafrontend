export const CART_STORAGE_KEY = "novapatch_cart";
export const CART_UPDATED_EVENT = "cart:updated";

export type CartItem = {
  slug: string;
  title: string;
  image: string;
  price: number;       // precio regular MXN
  color: string;       // accent color del producto
  bg: string;          // bg color del producto
  mode: "once" | "sub";
  freq: 30 | 60 | 90;  // siempre presente; para "once" se ignora en el precio
  quantity: number;
  variantId?: string;  // Medusa variant ID (opcional hasta que el backend esté conectado)
};

export const FREQ_DISCOUNTS: Record<number, number> = { 30: 0.20, 60: 0.15, 90: 0.10 };
export const FREQ_LABELS: Record<number, string>    = { 30: "Mensual", 60: "Bimestral", 90: "Trimestral" };

// Clave única por línea de carrito (mismo producto puede entrar como once y como sub)
export function cartKey(item: Pick<CartItem, "slug" | "mode" | "freq">): string {
  return `${item.slug}__${item.mode}__${item.freq}`;
}

export function getCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]): void {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event(CART_UPDATED_EVENT));
}

export function addToCart(incoming: Omit<CartItem, "quantity"> & { quantity?: number }): void {
  const items = getCart();
  const key = cartKey(incoming);
  const idx = items.findIndex((i) => cartKey(i) === key);
  if (idx >= 0) {
    items[idx].quantity += incoming.quantity ?? 1;
  } else {
    items.push({ ...incoming, quantity: incoming.quantity ?? 1 });
  }
  saveCart(items);
}

export function updateQuantity(
  slug: string,
  mode: "once" | "sub",
  freq: 30 | 60 | 90,
  delta: number,
): void {
  const items = getCart();
  const key = cartKey({ slug, mode, freq });
  const idx = items.findIndex((i) => cartKey(i) === key);
  if (idx < 0) return;
  items[idx].quantity = Math.max(0, items[idx].quantity + delta);
  if (items[idx].quantity === 0) items.splice(idx, 1);
  saveCart(items);
}

export function removeFromCart(slug: string, mode: "once" | "sub", freq: 30 | 60 | 90): void {
  const items = getCart().filter((i) => cartKey(i) !== cartKey({ slug, mode, freq }));
  saveCart(items);
}

export function clearCart(): void {
  saveCart([]);
}

export function getCartItemCount(): number {
  return getCart().reduce((sum, i) => sum + i.quantity, 0);
}

export function itemDisplayPrice(item: Pick<CartItem, "price" | "mode" | "freq">): number {
  if (item.mode === "once") return item.price;
  return Math.round(item.price * (1 - FREQ_DISCOUNTS[item.freq]));
}

export function cartTotals(items: CartItem[]): {
  subtotal: number;
  savings: number;
  total: number;
} {
  let subtotal = 0;
  let total = 0;
  for (const item of items) {
    subtotal += item.price * item.quantity;
    total += itemDisplayPrice(item) * item.quantity;
  }
  return { subtotal, savings: subtotal - total, total };
}
