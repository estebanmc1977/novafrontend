import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import HeroWithBar from "@/components/home/HeroWithBar";
import HowItWorks from "@/components/home/HowItWorks";
import ComparisonTable from "@/components/home/ComparisonTable";
import CTABanner from "@/components/home/CTABanner";
import { getProducts } from "@/lib/commerce";
import { medusa } from "@/lib/medusa";
import { MARKETS } from "@/lib/markets";
import type { Locale } from "@/i18n/routing";

// Client Components: lazy-loaded to unblock LCP/FCP
const AbsorptionSection = dynamic(() => import("@/components/home/AbsorptionSection"));
const ProductGrid     = dynamic(() => import("@/components/home/ProductGrid"));
const Testimonials    = dynamic(() => import("@/components/home/Testimonials"));
const HomeFAQ         = dynamic(() => import("@/components/home/HomeFAQ"));
const Footer          = dynamic(() => import("@/components/Footer"));

export const revalidate = 3600;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const market = MARKETS[locale as Locale] ?? MARKETS.mx;
  const regionId = market.medusaRegionId || undefined;
  const currency = market.currency;

  const products = await getProducts(regionId, currency);
  const basePrice = products[0]?.price ?? 750;

  // Raw fetch directly via global fetch to isolate SDK vs network
  let rawDebug = "no-raw";
  const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL ?? "MISSING";
  const pubKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "MISSING";
  try {
    const r = await fetch(`${backendUrl}/store/products?region_id=${regionId}&limit=1`, {
      headers: { "x-publishable-api-key": pubKey },
      cache: "no-store",
    });
    const body = await r.text();
    rawDebug = `url=${backendUrl} status=${r.status} keyPrefix=${pubKey.slice(0, 8)} bodyLen=${body.length} bodyHead=${body.slice(0, 120)}`;
  } catch (e) {
    const err = e as Error;
    rawDebug = `url=${backendUrl} keyPrefix=${pubKey.slice(0, 8)} errName=${err.name} errMsg=${err.message} cause=${JSON.stringify((err as any).cause ?? null)}`;
  }

  const debugMarker = `locale=${locale} regionId=${regionId ?? "undefined"} currency=${currency} productsCount=${products.length} firstPrice=${products[0]?.price ?? "none"} | RAW: ${rawDebug}`;

  return (
    <>
      {/* NVP_DEBUG: ${debugMarker} */}
      <div data-nvp-debug={debugMarker} style={{ display: "none" }} />
      <Navbar />
      <main>
        {/* 1. Hero + Features Bar — shared carousel state */}
        <HeroWithBar />
        {/* 3. Cómo Funciona — how it works, 3 steps */}
        <HowItWorks />
        {/* 4. Absorción — science section, dark blue bg */}
        <AbsorptionSection />
        {/* 5. Comparativo — comparison table */}
        <ComparisonTable />
        {/* 6. Cards de Producto — product grid */}
        <ProductGrid basePrice={basePrice} currency={currency} />
        {/* 7. Suscripciones — subscription plans */}
        <CTABanner basePrice={basePrice} currency={currency} />
        {/* 8. Social Proof — testimonials */}
        <Testimonials />
        {/* 9. FAQ */}
        <HomeFAQ />
      </main>
      <Footer />
    </>
  );
}
