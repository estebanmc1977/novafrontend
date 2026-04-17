import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import HeroWithBar from "@/components/home/HeroWithBar";
import HowItWorks from "@/components/home/HowItWorks";
import ComparisonTable from "@/components/home/ComparisonTable";
import CTABanner from "@/components/home/CTABanner";

// Client Components: lazy-loaded to unblock LCP/FCP
const AbsorptionSection = dynamic(() => import("@/components/home/AbsorptionSection"));
const ProductGrid     = dynamic(() => import("@/components/home/ProductGrid"));
const Testimonials    = dynamic(() => import("@/components/home/Testimonials"));
const HomeFAQ         = dynamic(() => import("@/components/home/HomeFAQ"));
const Footer          = dynamic(() => import("@/components/Footer"));

export default function HomePage() {
  return (
    <>
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
        <ProductGrid />
        {/* 7. Suscripciones — subscription plans */}
        <CTABanner />
        {/* 8. Social Proof — testimonials */}
        <Testimonials />
        {/* 9. FAQ */}
        <HomeFAQ />
      </main>
      <Footer />
    </>
  );
}
