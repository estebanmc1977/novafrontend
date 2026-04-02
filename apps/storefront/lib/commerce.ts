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

function medusaToProduct(p: Awaited<ReturnType<typeof medusa.catalog.getProducts>>[0]): Product {
  const slug = p.handle ?? p.id;
  const meta = PRODUCT_META[slug];
  const variant = p.variants?.[0];
  const mxnPrice = variant?.prices?.find((pr) => pr.currency_code === "mxn");

  return {
    id: p.id,
    slug,
    title: p.title,
    description: meta?.description ?? p.description ?? "",
    price: mxnPrice ? Math.round(mxnPrice.amount / 100) : 750,
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
export async function getProducts(): Promise<Product[]> {
  try {
    const medusaProducts = await medusa.catalog.getProducts(
      REGION_ID ? { region_id: REGION_ID } : undefined
    );

    if (medusaProducts.length === 0) return FALLBACK_PRODUCTS;

    // Reordenar según PRODUCT_ORDER cuando sea posible
    const mapped = medusaProducts.map(medusaToProduct);
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
