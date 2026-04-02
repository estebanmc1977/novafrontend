"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useCart } from "@/contexts/CartContext";

const products = [
  {
    name: "Energy",
    slug: "energy",
    tagline: "Nutrición diaria para energía celular sostenida",
    taglineColor: "#1A5C9A",
    quote: '"Tu día no para. Tu energía tampoco."',
    tags: ["Energía sostenida", "Sin picos ni caídas"],
    color: "#2B7CC1",
    bg: "#EBF4FB",
    popular: false,
    imgSrc: "/products/Energy_thumb.webp",
  },
  {
    name: "Sleep",
    slug: "sleep",
    tagline: "Inductor natural para un sueño profundo y reparador",
    taglineColor: "#0F6B5C",
    quote: '"Porque descansar también es cuidarse."',
    tags: ["Descanso nocturno", "Sin somníferos"],
    color: "#138A75",
    bg: "#EBF7F5",
    popular: false,
    imgSrc: "/products/Sleep_thumb.webp",
  },
  {
    name: "Glow",
    slug: "glow",
    tagline: "Belleza y juventud para una piel visiblemente renovada",
    taglineColor: "#B83525",
    quote: '"La piel también refleja cómo te cuidás."',
    tags: ["Bienestar desde adentro", "Constancia"],
    color: "#C94030",
    bg: "#FAF0EE",
    popular: true,
    imgSrc: "/products/Glow_thumb.webp",
  },
  {
    name: "Shield",
    slug: "shield",
    tagline: "Fortaleza inmune para tus defensas naturales",
    taglineColor: "#8C6000",
    quote: '"Tu rutina de cuidado empieza hoy, no cuando algo pasa."',
    tags: ["Cuidado preventivo", "Uso diario"],
    color: "#A07000",
    bg: "#FAF6E9",
    popular: false,
    imgSrc: "/products/Shield_thumb.webp",
  },
  {
    name: "Zen",
    slug: "zen",
    tagline: "Equilibrio emocional para la calma mental diaria",
    taglineColor: "#2A5490",
    quote: '"El equilibrio que no se ve, pero se siente."',
    tags: ["Calma funcional", "Días intensos"],
    color: "#3A6FA8",
    bg: "#EBF0F9",
    popular: false,
    imgSrc: "/products/Zen_thumb.webp",
  },
  {
    name: "Woman",
    slug: "woman",
    tagline: "Soporte herbal para el bienestar hormonal femenino",
    taglineColor: "#6B3080",
    quote: '"Escucharte también es una forma de cuidarte."',
    tags: ["Bienestar femenino", "Ritmos naturales"],
    color: "#8A3EBE",
    bg: "#F3EBF9",
    popular: false,
    imgSrc: "/products/Woman_thumb.webp",
  },
];

export default function ProductGrid() {
  const { addToCart } = useCart();

  return (
    <section id="productos" className="bg-[#F9FAFB]" style={{ padding: "80px 48px 64px" }}>
      <div className="max-w-[1200px] mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] mb-2.5" style={{ color: "#3CBFAB" }}>
            Catálogo
          </p>
          <h2
            className="font-black text-[#005088] tracking-[-0.02em] mb-3"
            style={{ fontSize: "clamp(26px,3vw,38px)" }}
          >
            Elige el parche que tu cuerpo necesita
          </h2>
          <p className="text-[16px] text-[#6B7280] max-w-[480px] mx-auto leading-[1.6]">
            Seis fórmulas, seis objetivos. Un solo formato: pega, olvida y deja que trabaje.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {products.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="group flex flex-col bg-white rounded-[20px] overflow-hidden border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] hover:-translate-y-[5px] transition-all duration-300 h-full">

                {/* Image area */}
                <div
                  className="relative flex items-center justify-center"
                  style={{ background: p.bg, padding: "40px 24px" }}
                >
                  {p.popular && (
                    <span
                      className="absolute top-3 right-3 text-white text-[10px] font-extrabold uppercase tracking-[0.06em] px-3 py-1.5 rounded-full"
                      style={{ background: "#E8503A" }}
                    >
                      Más popular
                    </span>
                  )}
                  <div className="relative w-40 h-40">
                    <Image
                      src={p.imgSrc}
                      alt={`NovaPatch ${p.name}`}
                      fill
                      className="object-contain group-hover:scale-[1.06] transition-transform duration-300"
                    />
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 flex flex-col gap-2.5 flex-1">
                  <div>
                    <p
                      className="text-[22px] font-black tracking-[-0.01em]"
                      style={{ color: p.taglineColor }}
                    >
                      {p.name}
                    </p>
                    <p className="text-[13px] font-semibold leading-[1.45] mt-0.5" style={{ color: p.taglineColor }}>
                      {p.tagline}
                    </p>
                  </div>

                  <p className="text-[13px] text-[#6B7280] italic leading-[1.5]">{p.quote}</p>

                  <div className="flex flex-wrap gap-1.5">
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[11px] font-bold px-3 py-1 rounded-full border-[1.5px]"
                        style={{ borderColor: p.color, color: p.color }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    className="mt-1 w-full py-3 rounded-xl border-2 text-[14px] font-bold transition-all duration-200 active:scale-[0.97]"
                    style={{ borderColor: p.color, color: p.color, background: "transparent" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = p.color;
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = p.color;
                    }}
                    onClick={() =>
                      addToCart({
                        slug: p.slug,
                        title: p.name,
                        image: p.imgSrc,
                        price: 750,
                        color: p.color,
                        bg: p.bg,
                        mode: "once",
                        freq: 30,
                      })
                    }
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
