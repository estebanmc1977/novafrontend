import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroWithBar from "@/components/home/HeroWithBar";
import HowItWorks from "@/components/home/HowItWorks";
import AbsorptionSection from "@/components/home/AbsorptionSection";
import ComparisonTable from "@/components/home/ComparisonTable";
import ProductGrid from "@/components/home/ProductGrid";
import Testimonials from "@/components/home/Testimonials";
import CTABanner from "@/components/home/CTABanner";
import HomeFAQ from "@/components/home/HomeFAQ";

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
