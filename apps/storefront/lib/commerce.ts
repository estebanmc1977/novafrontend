/**
 * lib/commerce.ts — Capa de abstracción del catálogo de productos
 *
 * Intenta obtener productos desde Medusa (/store/products).
 * Si el backend no está disponible (dev sin backend), usa los datos
 * hardcodeados como fallback para que el frontend funcione de forma autónoma.
 */

import { medusa } from "@/lib/medusa";
import { PRODUCT_META, PRODUCT_ORDER } from "@/lib/product-meta";

export type Product = {
  id: string;
  slug: string;          // handle de Medusa o slug local
  title: string;
  description: string;
  price: number;         // MXN, precio regular (sin descuento)
  image: string;
  variantId?: string;    // ID de la variante default en Medusa (para cart)
};

// ─── Datos de fallback (mientras no hay backend) ──────────────────────────────
// Usar descripciones reales de product-meta.ts

const FALLBACK_PRODUCTS: Product[] = PRODUCT_ORDER.map((slug) => {
  const meta = PRODUCT_META[slug];
  return {
    id: slug,
    slug,
    title: meta.name,
    description: meta.description,
    price: 750,
    image: meta.imgSrc,
    variantId: undefined, // se asigna cuando Medusa esté disponible
  };
});

// ─── Mapeo Medusa → Product local ─────────────────────────────────────────────

// Per-currency divisor reflecting how Medusa admin stores amounts in this
// project: MXN in cents (×100), ARS as whole units. Defaults to 100.
const CURRENCY_DIVISOR: Record<string, number> = {
  mxn: 100,
  ars: 1,
};

function amountToDisplay(rawAmount: number, currencyCode: string): number {
  const divisor = CURRENCY_DIVISOR[currencyCode.toLowerCase()] ?? 100;
  return Math.round(rawAmount / divisor);
}

function medusaToProduct(p: Awaited<ReturnType<typeof medusa.catalog.getProducts>>[0], currencyCode = "mxn"): Product {
  const slug = p.handle ?? p.id;
  const meta = PRODUCT_META[slug];
  // Prefer the "once" variant (non-subscription retail price) over the first one
  const onceVariant = p.variants?.find(
    (v) => (v as any)?.metadata?.is_subscription === false
  );
  const variant = onceVariant ?? p.variants?.[0];
  const calculatedAmount = (variant as any)?.calculated_price?.calculated_amount;
  const fallbackPrice = variant?.prices?.find((pr) => pr.currency_code === currencyCode);
  const rawAmount = calculatedAmount ?? fallbackPrice?.amount;

  return {
    id: p.id,
    slug,
    title: p.title,
    description: meta?.description ?? p.description ?? "",
    price: rawAmount ? amountToDisplay(rawAmount, currencyCode) : 750,
    image: p.thumbnail ?? meta?.imgSrc ?? `/products/${slug}_thumb.webp`,
    variantId: variant?.id,
  };
}

// ─── Exports principales ───────────────────────────────────────────────────────

const REGION_ID = process.env.NEXT_PUBLIC_MEDUSA_REGION_ID ?? "";

/**
 * Obtiene el catálogo de productos.
 * Intenta Medusa primero; si falla, usa fallback hardcodeado.
 */
export async function getProducts(regionId?: string, currencyCode?: string): Promise<Product[]> {
  const resolvedRegionId = regionId || REGION_ID;
  try {
    const medusaProducts = await medusa.catalog.getProducts(
      resolvedRegionId ? { region_id: resolvedRegionId } : undefined
    );

    if (medusaProducts.length === 0) return FALLBACK_PRODUCTS;

    const currency = (currencyCode ?? "mxn").toLowerCase();
    // Reordenar según PRODUCT_ORDER cuando sea posible
    const mapped = medusaProducts.map((p) => medusaToProduct(p, currency));
    const ordered = PRODUCT_ORDER
      .map((slug) => mapped.find((p) => p.slug === slug))
      .filter((p): p is Product => Boolean(p));

    // Agregar productos de Medusa que no estén en PRODUCT_ORDER
    const rest = mapped.filter((p) => !PRODUCT_ORDER.includes(p.slug));
    return [...ordered, ...rest];
  } catch {
    // Backend no disponible — continuar con datos locales
    return FALLBACK_PRODUCTS;
  }
}

/**
 * Alias para compatibilidad con TiendaExperience que llama getOrderedProducts().
 */
export async function getOrderedProducts(): Promise<Product[]> {
  return getProducts();
}
