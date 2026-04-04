/**
 * lib/medusa.ts — Cliente REST completo para Medusa V2
 *
 * Cubre las 5 secciones del mapa de integración:
 *   1. Catálogo y Visualización (público)
 *   2. Gestión del Carrito (público / autenticado)
 *   3. Flujo de Checkout y Pagos
 *   4. Portal de Suscripciones (protegido por Clerk JWT)
 *   5. Gestión de Tarjetas (protegido por Clerk JWT)
 *
 * Uso:
 *   import { medusa } from "@/lib/medusa";
 *   const products = await medusa.catalog.getProducts({ region_id: "reg_MX" });
 *   const cart    = await medusa.cart.create("reg_MX");
 */

const MEDUSA_URL =
  process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "http://localhost:9000";

// ─── Error tipado ─────────────────────────────────────────────────────────────

export class MedusaError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = "MedusaError";
  }
}

// ─── Tipos de dominio ─────────────────────────────────────────────────────────

export type MedusaProduct = {
  id: string;
  title: string;
  description: string | null;
  handle: string;
  variants: MedusaVariant[];
  images: { url: string }[];
  thumbnail: string | null;
};

export type MedusaVariant = {
  id: string;
  title: string;
  prices: { amount: number; currency_code: string }[];
};

export type MedusaCart = {
  id: string;
  region_id: string;
  items: MedusaLineItem[];
  total: number;
  subtotal: number;
  payment_sessions?: { provider_id: string; status: string }[];
};

export type MedusaLineItem = {
  id: string;
  variant_id: string;
  title: string;
  quantity: number;
  unit_price: number;
  metadata?: Record<string, unknown>;
};

export type MedusaOrder = {
  id: string;
  display_id: number;
  status: string;
  total: number;
  items: MedusaLineItem[];
};

export type MedusaSubscription = {
  id: string;
  status: "active" | "paused" | "cancelled";
  interval_days: 30 | 60 | 90;
  next_delivery_at: string;
  product_title: string;
  variant_id: string;
  unit_price: number;
  quantity: number;
  created_at: string;
};

export type MedusaPaymentMethod = {
  id: string;
  brand: string;
  last4: string;
  exp_month: number;
  exp_year: number;
  is_default: boolean;
};

// ─── Fetch helper ─────────────────────────────────────────────────────────────

async function medusaFetch<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null
): Promise<T> {
  const url = `${MEDUSA_URL}${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
    "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(url, {
    ...options,
    headers: { ...headers, ...(options.headers as Record<string, string> ?? {}) },
  });

  if (!res.ok) {
    let message = `Medusa HTTP ${res.status}`;
    try {
      const body = await res.json();
      message = body?.message ?? body?.error ?? message;
    } catch { /* empty */ }
    throw new MedusaError(message, res.status);
  }

  return res.json() as Promise<T>;
}

// ─── 1. Catálogo y Visualización ─────────────────────────────────────────────

const catalog = {
  /**
   * GET /store/products?region_id=...
   * Carga la tienda inicial con precios en MXN.
   */
  async getProducts(params?: { region_id?: string }): Promise<MedusaProduct[]> {
    const qs = params?.region_id ? `?region_id=${params.region_id}` : "";
    const data = await medusaFetch<{ products: MedusaProduct[] }>(
      `/store/products${qs}`
    );
    return data.products;
  },

  /**
   * GET /store/variants/:id
   * Obtiene detalles de una variante (cross-sell, cambio de variante).
   */
  async getVariant(id: string): Promise<MedusaVariant> {
    const data = await medusaFetch<{ variant: MedusaVariant }>(
      `/store/variants/${id}`
    );
    return data.variant;
  },
};

// ─── 2. Gestión del Carrito ───────────────────────────────────────────────────

const cart = {
  /**
   * POST /store/carts
   * Inicia un nuevo carrito vacío con region_id.
   * Si se pasa customer_id (usuario logueado), el carrito queda vinculado al cliente.
   * Guarda el cart_id en localStorage para persistencia.
   */
  async create(region_id: string, customer_id?: string): Promise<MedusaCart> {
    const data = await medusaFetch<{ cart: MedusaCart }>("/store/carts", {
      method: "POST",
      body: JSON.stringify({ region_id, ...(customer_id ? { customer_id } : {}) }),
    });
    if (typeof window !== "undefined") {
      localStorage.setItem("novapatch_medusa_cart_id", data.cart.id);
    }
    return data.cart;
  },

  /**
   * Obtiene el cart_id persistido (o null si no hay uno).
   */
  getStoredId(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("novapatch_medusa_cart_id");
  },

  /**
   * Garantiza que existe un carrito en Medusa, creándolo si hace falta.
   * Pasa customer_id cuando el usuario está logueado (obligatorio para suscripciones).
   */
  async ensure(region_id: string, customer_id?: string): Promise<string> {
    const existing = cart.getStoredId();
    if (existing) return existing;
    const newCart = await cart.create(region_id, customer_id);
    return newCart.id;
  },

  /**
   * POST /store/carts/:id/line-items — Compra Única
   * Payload: { variant_id, quantity }
   */
  async addOnceItem(
    cart_id: string,
    variant_id: string,
    quantity = 1
  ): Promise<MedusaCart> {
    const data = await medusaFetch<{ cart: MedusaCart }>(
      `/store/carts/${cart_id}/line-items`,
      {
        method: "POST",
        body: JSON.stringify({ variant_id, quantity }),
      }
    );
    return data.cart;
  },

  /**
   * POST /store/carts/:id/line-items — Suscripción
   * Inyecta metadata: { is_subscription, interval_days, discount_percentage }
   */
  async addSubscriptionItem(
    cart_id: string,
    variant_id: string,
    interval_days: 30 | 60 | 90,
    discount_percentage: number,
    quantity = 1
  ): Promise<MedusaCart> {
    const data = await medusaFetch<{ cart: MedusaCart }>(
      `/store/carts/${cart_id}/line-items`,
      {
        method: "POST",
        body: JSON.stringify({
          variant_id,
          quantity,
          metadata: {
            is_subscription: true,
            interval_days,
            discount_percentage,
          },
        }),
      }
    );
    return data.cart;
  },

  /**
   * POST /store/carts/:id — Actualizar email y dirección de envío
   */
  async update(
    cart_id: string,
    fields: {
      email?: string;
      shipping_address?: {
        first_name?: string;
        last_name?: string;
        address_1?: string;
        address_2?: string;
        city?: string;
        province?: string;
        postal_code?: string;
        country_code?: string;
        phone?: string;
      };
    }
  ): Promise<MedusaCart> {
    const data = await medusaFetch<{ cart: MedusaCart }>(
      `/store/carts/${cart_id}`,
      { method: "POST", body: JSON.stringify(fields) }
    );
    return data.cart;
  },

  /**
   * POST /store/carts/:id/line-items/:line_id
   * Actualiza la cantidad de un ítem existente.
   */
  async updateItem(
    cart_id: string,
    line_id: string,
    quantity: number
  ): Promise<MedusaCart> {
    const data = await medusaFetch<{ cart: MedusaCart }>(
      `/store/carts/${cart_id}/line-items/${line_id}`,
      {
        method: "POST",
        body: JSON.stringify({ quantity }),
      }
    );
    return data.cart;
  },
};

// ─── 3. Checkout y Pagos ──────────────────────────────────────────────────────

const checkout = {
  /**
   * POST /store/carts/:id/payment-sessions
   * Registra la sesión de pago con Openpay como proveedor.
   */
  async createPaymentSession(cart_id: string): Promise<MedusaCart> {
    const data = await medusaFetch<{ cart: MedusaCart }>(
      `/store/carts/${cart_id}/payment-sessions`,
      { method: "POST" }
    );
    return data.cart;
  },

  /**
   * POST /store/carts/:id/complete
   * Procesa el pago y crea la orden.
   * Incluye el token_id generado por el SDK de Openpay en el frontend.
   */
  async completeCart(
    cart_id: string,
    openpay_token_id: string,
    email?: string,
    device_session_id?: string
  ): Promise<MedusaOrder> {
    const data = await medusaFetch<{ type: string; data: MedusaOrder }>(
      `/store/carts/${cart_id}/complete`,
      {
        method: "POST",
        body: JSON.stringify({ openpay_token_id, email, device_session_id }),
      }
    );
    // Limpiar cart_id del storage al completar
    if (typeof window !== "undefined") {
      localStorage.removeItem("novapatch_medusa_cart_id");
    }
    return data.data;
  },
};

// ─── 4. Cliente — Sync Clerk → Medusa (requiere Clerk JWT) ──────────────────

export type MedusaCustomer = {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
};

const customer = {
  /**
   * GET /store/me/customer
   * Busca o crea el cliente Medusa usando el email del JWT de Clerk.
   * Llamar después del login cuando el carrito tiene suscripciones.
   * Devuelve el customer_id para pasarlo a cart.ensure().
   */
  async sync(token: string): Promise<MedusaCustomer> {
    const data = await medusaFetch<{ customer: MedusaCustomer }>(
      "/store/me/customer",
      {},
      token
    );
    return data.customer;
  },
};

// ─── 5. Portal de Suscripciones (requiere Clerk JWT) ─────────────────────────

const subscriptions = {
  /**
   * GET /store/me/subscriptions
   * Lista las suscripciones activas, pausadas y canceladas del usuario.
   */
  async list(token: string): Promise<MedusaSubscription[]> {
    const data = await medusaFetch<{ subscriptions: MedusaSubscription[] }>(
      "/store/me/subscriptions",
      {},
      token
    );
    return data.subscriptions;
  },

  /**
   * POST /store/me/subscriptions/:sub_id/pause
   */
  async pause(sub_id: string, token: string): Promise<MedusaSubscription> {
    const data = await medusaFetch<{ subscription: MedusaSubscription }>(
      `/store/me/subscriptions/${sub_id}/pause`,
      { method: "POST" },
      token
    );
    return data.subscription;
  },

  /**
   * POST /store/me/subscriptions/:sub_id/resume
   */
  async resume(sub_id: string, token: string): Promise<MedusaSubscription> {
    const data = await medusaFetch<{ subscription: MedusaSubscription }>(
      `/store/me/subscriptions/${sub_id}/resume`,
      { method: "POST" },
      token
    );
    return data.subscription;
  },

  /**
   * POST /store/me/subscriptions/:sub_id/cancel
   */
  async cancel(sub_id: string, token: string): Promise<MedusaSubscription> {
    const data = await medusaFetch<{ subscription: MedusaSubscription }>(
      `/store/me/subscriptions/${sub_id}/cancel`,
      { method: "POST" },
      token
    );
    return data.subscription;
  },

  /**
   * POST /store/me/subscriptions/:sub_id/frequency
   * Cambia la frecuencia de entrega (ej. de 30 a 60 días).
   */
  async updateFrequency(
    sub_id: string,
    interval_days: 30 | 60 | 90,
    token: string
  ): Promise<MedusaSubscription> {
    const data = await medusaFetch<{ subscription: MedusaSubscription }>(
      `/store/me/subscriptions/${sub_id}/frequency`,
      {
        method: "POST",
        body: JSON.stringify({ interval_days }),
      },
      token
    );
    return data.subscription;
  },
};

// ─── 5. Gestión de Tarjetas (requiere Clerk JWT) ──────────────────────────────

const paymentMethods = {
  /**
   * GET /store/me/payment-methods
   * Lista las tarjetas guardadas (Medusa consulta a Openpay).
   */
  async list(token: string): Promise<MedusaPaymentMethod[]> {
    const data = await medusaFetch<{ payment_methods: MedusaPaymentMethod[] }>(
      "/store/me/payment-methods",
      {},
      token
    );
    return data.payment_methods;
  },

  /**
   * POST /store/me/payment-methods/default
   * Agrega o reemplaza la tarjeta principal.
   * El token_id fue generado por el SDK de Openpay en el frontend.
   */
  async setDefault(
    openpay_token_id: string,
    token: string
  ): Promise<MedusaPaymentMethod> {
    const data = await medusaFetch<{ payment_method: MedusaPaymentMethod }>(
      "/store/me/payment-methods/default",
      {
        method: "POST",
        body: JSON.stringify({ openpay_token_id }),
      },
      token
    );
    return data.payment_method;
  },
};

// ─── Export unificado ─────────────────────────────────────────────────────────

export const medusa = {
  catalog,
  cart,
  checkout,
  customer,
  subscriptions,
  paymentMethods,
};
