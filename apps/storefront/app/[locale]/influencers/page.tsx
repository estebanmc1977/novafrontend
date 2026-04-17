import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InfluencerHero from "./InfluencerHero";
import InfluencerForm from "./InfluencerForm";

export const metadata: Metadata = {
  title: "Programa de Influencers | Novapatch",
  description: "Únete a la red de embajadores de Novapatch. Aplica ahora y comienza a compartir el bienestar.",
  robots: { index: false, follow: false },
};

export default function InfluencersPage() {
  return (
    <>
      <Navbar />
      <main>
        <InfluencerHero />
        <InfluencerForm />
      </main>
      <Footer />
    </>
  );
}
