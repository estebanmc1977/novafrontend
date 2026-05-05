import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import InfluencerHero from "./InfluencerHero";
import InfluencerForm from "./InfluencerForm";

export const metadata: Metadata = {
  title: "Creadores | Novapatch",
  description: "Estamos armando una red chica de creadores en México. Si lo que haces conecta con el bienestar real, hablemos.",
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
