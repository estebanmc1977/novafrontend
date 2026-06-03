"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/commerce";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/format";

// ─── UI metadata por producto ───────────────────────────────────────────────

const META: Record<string, {
  color: string;
  bg: string;
  taglineColor: string;
  quote: string;
  tags: string[];
  ingredients: string[];     // ← Nuevo
  popular?: boolean;
}> = {
  energy: {
    color: "#2B7CC1",
    bg: "#EBF4FB",
    taglineColor: "#2B7CC1",
    quote: '"Tu día no para. Tu energía tampoco."',
    tags: ["Energía sostenida", "Sin picos ni caídas"],
    ingredients: ["Vitamina C", "L-Carnitina", "Extracto de Té Verde", "Extracto de Ginseng", "Vitamina B2", "Ácido Fólico", "Vitamina E"],
  },
  sleep: {
    color: "#138A75",
    bg: "#EBF7F5",
    taglineColor: "#138A75",
    quote: '"Porque descansar también es cuidarse."',
    tags: ["Descanso nocturno", "Sin somníferos"],
    ingredients: ["Triptófano", "Magnesio", "Inositol", "Vitamina B6", "Glicina"],
  },
  glow: {
    color: "#C94030",
    bg: "#FAF0EE",
    taglineColor: "#C94030",
    quote: '"La piel también refleja cómo te cuidas."',
    tags: ["Bienestar desde adentro", "Constancia"],
    ingredients: ["Vitamina C", "Ácido Hialurónico", "Colágeno Hidrolizado", "Biotina", "Vitamina B3", "Extracto de Centella Asiática", "Vitamina E"],
    popular: true,
  },
  shield: {
    color: "#A07000",
    bg: "#FAF6E9",
    taglineColor: "#A07000",
    quote: '"Tu rutina de cuidado empieza hoy, no cuando algo pasa."',
    tags: ["Cuidado preventivo", "Uso diario"],
    ingredients: ["Vitamina C", "Zinc", "Vitamina D3", "Vitamina E", "Niacinamida"],
  },
  zen: {
    color: "#3A6FA8",
    bg: "#EBF0F9",
    taglineColor: "#3A6FA8",
    quote: '"El equilibrio que no se ve, pero se siente."',
    tags: ["Calma funcional", "Días intensos"],
    ingredients: ["Triptófano", "Magnesio", "Taurina", "Extracto de Manzanilla", "Vitamina B6"],
  },
  woman: {
    color: "#8A3EBE",
    bg: "#F3EBF9",
    taglineColor: "#8A3EBE",
    quote: '"Escucharte también es una forma de cuidarte."',
    tags: ["Bienestar femenino", "Ritmos naturales"],
    ingredients: ["Extracto de Soya", "Vitamina B6", "Magnesio", "Ácido Fólico", "Hierro"],
  },
};

// ─── Frecuencias de suscripción ─────────────────────────────────────────────

const FRECUENCIAS = [
  { days: 30 as const, label: "Mensual",    discount: 0.20, badge: "20% OFF" },
  { days: 60 as const, label: "Bimestral",  discount: 0.15, badge: "15% OFF" },
  { days: 90 as const, label: "Trimestral", discount: 0.10, badge: "10% OFF" },
];

type Freq = 30 | 60 | 90;
type Mode = "once" | "sub";

function discountedPrice(base: number, freq: Freq): number {
  const { discount } = FRECUENCIAS.find((f) => f.days === freq)!;
  return Math.round(base * (1 - discount));
}

// ─── Componentes internos ────────────────────────────────────────────────────

function ModeToggle({ mode, onChange }: { mode: Mode; onChange: (m: Mode) => void }) {
  return (
    <div className="inline-flex items-center bg-white rounded-full p-1 shadow-sm border border-black/[0.07]">
      <button
        onClick={() => onChange("once")}
        className={`px-6 py-2.5 rounded-full text-[13px] font-bold transition-all duration-200 ${
          mode === "once" ? "bg-ocean text-white" : "text-gray-500"
        }`}
      >
        Compra única
      </button>
      <button
        onClick={() => onChange("sub")}
        className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-[13px] font-bold transition-all duration-200 ${
          mode === "sub" ? "bg-coral text-white" : "text-gray-500"
        }`}
      >
        Suscripción
        {mode === "once" && (
          <span className="text-[10px] font-black bg-coral text-white px-2 py-0.5 rounded-full">
            hasta 20% OFF
          </span>
        )}
      </button>
    </div>
  );
}

function FrequencyPicker({
  selected,
  color,
  bg,
  taglineColor,
  onChange,
}: {
  selected: Freq;
  color: string;
  bg: string;
  taglineColor: string;
  onChange: (f: Freq) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {FRECUENCIAS.map((f) => {
        const active = selected === f.days;
        return (
          <button
            key={f.days}
            onClick={() => onChange(f.days)}
            className="py-2 px-1 rounded-xl text-center transition-all duration-150 border-2"
            style={{
              borderColor: active ? color : "transparent",
              background: active ? bg : "#F3F4F6",
              color: active ? taglineColor : "#6B7280",
            }}
          >
            <span className="block text-[10px] font-black">{f.badge}</span>
            <span className="block text-[11px] font-semibold">{f.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ─── Seccion Product Card ────────────────────────────────────────────────────

function ProductCard({
  product,
  mode,
  freq,
  onFreqChange,
  currency = "MXN",
  locale,
}: {
  product: Product;
  mode: Mode;
  freq: Freq;
  onFreqChange: (f: Freq) => void;
  currency?: string;
  locale: string;
}) {
  const meta = META[product.slug];
  const { addToCart } = useCart();
  if (!meta) return null;

  const displayPrice = mode === "sub" ? discountedPrice(product.price, freq) : product.price;
  const freqBadge = FRECUENCIAS.find((f) => f.days === freq)!.badge;

  function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    addToCart({
      slug: product.slug,
      title: product.title,
      image: product.image,
      price: product.price,
      color: meta.color,
      bg: meta.bg,
      mode,
      freq,
    });
  }

  return (
    <div className="block h-full group">
      <Link href={`/${locale}/tienda/${product.slug}`} className="block h-full">
        <div className="bg-white rounded-[22px] overflow-hidden border border-black/[0.05] shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.09)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">

          {/* Imagen - clickeable hacia PDP */}
          <div className="relative flex items-center justify-center py-10 px-6" style={{ background: meta.bg }}>
            {meta.popular && (
              <span className="absolute top-3 right-3 bg-coral text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full">
                Más popular
              </span>
            )}
            <AnimatePresence>
              {mode === "sub" && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute top-3 left-3 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full"
                  style={{ background: meta.color }}
                >
                  {freqBadge}
                </motion.span>
              )}
            </AnimatePresence>
            <div className="relative w-48 h-48">   {/* ← Más grande como pediste */}
              <Image
                src={product.image}
                alt={`Novapatch ${product.title}`}
                fill
                sizes="192px"
                loading="lazy"
                className="object-contain drop-shadow-md"
              />
            </div>
          </div>

          {/* Contenido */}
          <div className="p-5 flex flex-col gap-3 flex-1">
            <div>
              <h3 className="text-[22px] font-black tracking-tight leading-none text-navy-light">
                {product.title}
              </h3>
              <p className="text-[13px] font-semibold leading-snug mt-1" style={{ color: meta.taglineColor }}>
                {product.description}
              </p>
            </div>

            {/* Pack + Ingredientes */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-gray-400 mb-1">
                Pack de 30 parches
              </p>
              <p className="text-[12px] text-gray-500 leading-[1.5]">
                {meta.ingredients.join(" · ")}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {meta.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] font-bold px-2.5 py-1 rounded-full border-[1.5px]"
                  style={{ borderColor: meta.color, color: meta.color }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Selector de frecuencia - NO clickeable hacia PDP */}
            <AnimatePresence>
              {mode === "sub" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                  onClick={(e) => e.stopPropagation()}   {/* ← Importante: evita ir a PDP */}
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#9CA3AF] mb-2 mt-1">
                    Frecuencia de entrega
                  </p>
                  <FrequencyPicker
                    selected={freq}
                    color={meta.color}
                    bg={meta.bg}
                    taglineColor={meta.taglineColor}
                    onChange={onFreqChange}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Precio + Botón */}
            <div className="mt-auto pt-3 border-t border-black/[0.05]">
              <div className="flex items-baseline gap-2 mb-3">
                <span className="text-[26px] font-black tracking-tight text-navy-light">
                  {formatPrice(displayPrice, currency)}
                </span>
                {mode === "sub" && (
                  <span className="text-[14px] text-[#C0C0C0] line-through">
                    {formatPrice(product.price, currency)}
                  </span>
                )}
              </div>

              <button
                onClick={handleAddToCart}
                className="product-card-btn w-full py-3 rounded-xl border-2 text-[14px] font-bold transition-all duration-200 active:scale-[0.97]"
                style={{ "--btn-accent": meta.color, borderColor: meta.color } as React.CSSProperties}
              >
                {mode === "sub" ? "Suscribirse" : "Agregar al carrito"}
              </button>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────

export default function TiendaExperience({ 
  products, 
  currency = "MXN",
  locale = "mx" 
}: { 
  products: Product[], 
  currency?: string;
  locale?: string;
}) {
  const [mode, setMode] = useState<Mode>("once");
  const [freqs, setFreqs] = useState<Record<string, Freq>>({});

  function getFreq(slug: string): Freq {
    return freqs[slug] ?? 30;
  }

  function setFreq(slug: string, f: Freq) {
    setFreqs((prev) => ({ ...prev, [slug]: f }));
  }

  return (
    <main className="min-h-screen" style={{ background: "#F8F3EC" }}>

      {/* Hero */}
      <section className="pt-32 pb-12 px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="text-[11px] font-bold uppercase tracking-[0.22em] text-coral mb-3"
        >
          Tienda Novapatch
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.07 }}
          className="font-black text-ocean tracking-tight mb-3"
          style={{ fontSize: "clamp(28px, 4vw, 46px)" }}
        >
          Elige el parche que necesita tu cuerpo
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.13 }}
          className="text-[#5A6475] text-base leading-relaxed mb-8 max-w-md mx-auto"
        >
          Seis fórmulas. Un solo formato: pega, olvida y deja que trabaje.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.19 }}>
          <ModeToggle mode={mode} onChange={setMode} />
        </motion.div>

        <AnimatePresence>
          {mode === "sub" && (
            <motion.p
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2 }}
              className="text-[12px] text-[#9CA3AF] mt-3"
            >
              Elige la frecuencia por producto. Pausa o cancela cuando quieras.
            </motion.p>
          )}
        </AnimatePresence>
      </section>

      {/* Grid de productos */}
      <section className="px-4 pb-24 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {products.map((product, i) => (
            <motion.div
              key={product.slug}
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className={`flex ${i === 0 ? "sm:col-span-2 md:col-span-1" : ""}`}
            >
              <ProductCard
                product={product}
                mode={mode}
                freq={getFreq(product.slug)}
                onFreqChange={(f) => setFreq(product.slug, f)}
                currency={currency}
                locale={locale}
              />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Banda de beneficios suscripción */}
      <AnimatePresence>
        {mode === "sub" && (
          <motion.section
            key="benefits-band"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.35 }}
            className="border-t border-black/[0.06] py-10 px-6"
            style={{ background: "#fff" }}
          >
            <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              {[
                {
                  icon: "🔄",
                  title: "Sin interrupciones",
                  desc: "Tu parche llega antes de que se te acabe.",
                },
                {
                  icon: "💰",
                  title: "Precio de suscriptor",
                  desc: "Siempre más bajo que la compra individual.",
                },
                {
                  icon: "🎛️",
                  title: "Tú controlas",
                  desc: "Pausa, cambia o cancela sin llamadas ni penalizaciones.",
                },
              ].map((b, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <div className="text-4xl mb-2">{b.icon}</div>
                  <p className="text-[14px] font-bold text-ocean">{b.title}</p>
                  <p className="text-[13px] text-[#6B7280] leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </motion.section>
        )}
      </AnimatePresence>
    </main>
  );
}