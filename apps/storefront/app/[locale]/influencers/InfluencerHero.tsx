"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const VALUE_PROPS = [
  { label: "Productos para ti", sub: "te los mandamos para que los pruebes" },
  { label: "Colaboraciones pagas", sub: "para perfiles seleccionados" },
  { label: "Comunidad real", sub: "de creadores de bienestar en LATAM" },
];

export default function InfluencerHero() {
  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{ background: "#0D1B35" }}
    >
      {/* Full-bleed background image */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <Image
          src="/girls.webp"
          alt=""
          fill
          priority
          className="object-cover"
          style={{ objectPosition: "65% center" }}
          sizes="100vw"
        />
        {/* Base dark overlay — even darkening across the whole image */}
        <div className="absolute inset-0" style={{ background: "rgba(13,27,53,0.72)" }} />
        {/* Extra left darkening for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(105deg, rgba(13,27,53,0.55) 0%, rgba(13,27,53,0.2) 55%, transparent 100%)",
          }}
        />
        {/* Bottom fade to form section */}
        <div
          className="absolute bottom-0 left-0 right-0 h-48"
          style={{ background: "linear-gradient(to bottom, transparent, #FAF7F2)" }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-28 pb-20">
        <div style={{ maxWidth: 560 }}>

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <span
              className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full text-xs font-semibold tracking-widest uppercase"
              style={{
                border: "1px solid rgba(255,255,255,0.15)",
                color: "rgba(255,255,255,0.55)",
                background: "rgba(255,255,255,0.04)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "#E8503A", boxShadow: "0 0 8px #E8503A" }}
              />
              Creadores Novapatch · México
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="font-bold text-white mb-8"
            style={{
              fontSize: "clamp(2.8rem, 7vw, 5rem)",
              lineHeight: 0.95,
              letterSpacing: "-0.02em",
            }}
          >
            Crea contenido
            <br />
            que{" "}
            <em
              className="not-italic"
              style={{ color: "#E8503A" }}
            >
              transforma
            </em>
            <br />
            vidas.
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26, duration: 0.8 }}
            className="text-lg leading-relaxed mb-12"
            style={{ color: "rgba(255,255,255,0.5)", maxWidth: 480 }}
          >
            Estamos armando una red chica de creadores con quienes queremos construir Novapatch en México. Si lo que haces conecta con el bienestar real, nos encantaría conocerte.
          </motion.p>

          {/* Value props */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.38, duration: 0.7 }}
            className="flex flex-col gap-5 mb-14"
          >
            {VALUE_PROPS.map((v) => (
              <div key={v.label} className="flex items-start gap-4">
                <div
                  className="w-0.5 rounded-full flex-shrink-0 mt-0.5"
                  style={{ height: 36, background: "#E8503A" }}
                />
                <div>
                  <div className="font-semibold text-white text-sm">{v.label}</div>
                  <div className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
                    {v.sub}
                  </div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* CTA */}
          <motion.a
            href="#aplicar"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full font-semibold text-white text-base transition-shadow"
            style={{
              background: "#E8503A",
              boxShadow: "0 4px 24px rgba(232,80,58,0.35)",
            }}
          >
            Hablemos
            <svg
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              aria-hidden
            >
              <path
                d="M3.5 9H14.5M14.5 9L9 3.5M14.5 9L9 14.5"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.a>
        </div>
      </div>

    </section>
  );
}
