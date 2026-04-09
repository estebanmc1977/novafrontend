"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const testimonials = [
  {
    name: "Carlos M.",
    product: "Energy",
    dot: "#83B5F4",
    img: "/socialproof/testimonial_2_1x.webp",
    text: "Lo pongo en la mañana y siento que llego al final del día sin ese bajón de siempre. Ya no dependo del tercer café.",
  },
  {
    name: "Sofía R.",
    product: "Sleep",
    dot: "#1EB1BC",
    img: "/socialproof/testimonial_1_1x.webp",
    text: "Me ayuda a desconectar antes de dormir. Llego a la cama más tranquila y eso lo cambia todo.",
  },
  {
    name: "Diego T.",
    product: "Zen",
    dot: "#4E82BC",
    img: "/socialproof/testimonial_5_1x.webp",
    text: "Días de reuniones seguidas y lo noto. No es que el estrés desaparezca, pero lo manejo diferente.",
  },
  {
    name: "Valentina G.",
    product: "Glow",
    dot: "#F25C54",
    img: "/socialproof/testimonial_3_1x.webp",
    text: "Llevo dos meses y mi piel se ve diferente. Más uniforme, más luminosa. La gente me pregunta qué estoy haciendo.",
  },
  {
    name: "Andrés P.",
    product: "Shield",
    dot: "#FFA849",
    img: "/socialproof/testimonial_9_1x.webp",
    text: "Entreno fuerte y necesito que mi cuerpo responda bien. Desde que lo uso me enfermo mucho menos. Simple así.",
  },
  {
    name: "Mariana L.",
    product: "Woman",
    dot: "#C693C4",
    img: "/socialproof/testimonial_8_1x.webp",
    text: "Sentía que mis ciclos me manejaban a mí. Ahora lo vivo diferente — más estable, con menos altibajos emocionales.",
  },
];

const PAGE_SIZE = 3;

const Stars = () => (
  <div className="flex gap-0.5 mb-3.5">
    {[...Array(5)].map((_, i) => (
      <span key={i} className="text-[18px]" style={{ color: "var(--color-teal)" }}>★</span>
    ))}
  </div>
);

export default function Testimonials() {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(testimonials.length / PAGE_SIZE);
  const visible = testimonials.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const go = (dir: number) => {
    setPage((p) => (p + dir + totalPages) % totalPages);
  };

  return (
    <div style={{ background: "var(--color-teal-pale)" }}>
      {/* Wave top */}
      <svg
        viewBox="0 0 1440 60"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="block w-full"
        style={{ height: "60px", transform: "scaleY(-1)", background: "white", marginBottom: "-1px" }}
      >
        <path d="M0,40 C360,80 1080,0 1440,40 L1440,60 L0,60 Z" fill="var(--color-teal-pale)" />
      </svg>

      <section style={{ background: "var(--color-teal-pale)", padding: "80px 48px", position: "relative" }}>
        {/* Header — social proof number instead of standard label */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-[600px] mx-auto mb-12"
        >
          <div className="flex items-center justify-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-[24px]" style={{ color: "var(--color-teal)" }}>★</span>
            ))}
          </div>
          <h2
            className="font-black text-ocean tracking-[-0.02em]"
            style={{ fontSize: "clamp(26px,3vw,40px)" }}
          >
            Lo que dicen quienes ya lo usan.
          </h2>
          <p className="text-[15px] text-ocean/60 mt-2">
            4.8 de 5 estrellas en promedio
          </p>
        </motion.div>

        {/* Cards */}
        <div className="max-w-[1100px] mx-auto relative overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={page}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="grid grid-cols-1 md:grid-cols-3 gap-5"
            >
              {visible.map((t) => (
                <div
                  key={t.name}
                  className="bg-white rounded-[32px] p-7 shadow-[0_1px_4px_rgba(0,0,0,0.07)] flex flex-col"
                >
                  <Stars />
                  <p className="text-[15px] text-gray-900 leading-[1.7] flex-1 mb-5">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={t.img}
                        alt={t.name}
                        width={48}
                        height={48}
                        loading="lazy"
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <p className="font-bold text-[14px] text-gray-900">{t.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className="w-2 h-2 rounded-full inline-block flex-shrink-0"
                          style={{ background: t.dot }}
                        />
                        <span className="text-[12px] text-gray-500">Novapatch {t.product}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Nav */}
        <div className="flex justify-center items-center gap-4 mt-9">
          <button
            onClick={() => go(-1)}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
            style={{ background: "rgba(0,0,0,0.08)", border: "none", color: "#111827", cursor: "pointer" }}
            aria-label="Anterior"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          {/* Dots */}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: i === page ? "20px" : "8px",
                  background: i === page ? "var(--color-teal)" : "rgba(0,0,0,0.2)",
                  border: "none",
                  cursor: "pointer",
                }}
                aria-label={`Página ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={() => go(1)}
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
            style={{ background: "rgba(0,0,0,0.08)", border: "none", color: "#111827", cursor: "pointer" }}
            aria-label="Siguiente"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </section>

      {/* Wave bottom */}
      <svg
        viewBox="0 0 1440 60"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        className="block w-full"
        style={{ height: "60px", background: "var(--color-teal-pale)", marginTop: "-1px" }}
      >
        <path d="M0,20 C480,60 960,0 1440,20 L1440,60 L0,60 Z" fill="white" />
      </svg>
    </div>
  );
}
