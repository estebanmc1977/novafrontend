"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/format";

const SUB_DISCOUNT = 0.2;

const products = [
  {
    name: "Energy",
    slug: "energy",
    tagline: "Energía celular sostenida",
    taglineColor: "#1A5C9A",
    ingredients: ["Vitamina C", "L-Carnitina", "Extracto de Té Verde", "Extracto de Ginseng", "Vitamina B2", "Ácido Fólico", "Vitamina E"],
    tags: ["Energía sostenida", "Sin picos ni caídas"],
    color: "#2B7CC1",
    bg: "#EBF4FB",
    popular: false,
    imgSrc: "/products/Energy_thumb.webp",
  },
  {
    name: "Sleep",
    slug: "sleep",
    tagline: "Sueño profundo y reparador",
    taglineColor: "#0F6B5C",
    ingredients: ["Triptófano", "Magnesio", "Inositol", "Vitamina B6", "Glicina"],
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
    ingredients: ["Vitamina C", "Ácido Hialurónico", "Colágeno Hidrolizado", "Biotina", "Vitamina B3", "Extracto de Centella Asiática", "Vitamina E"],
    tags: ["Bienestar desde adentro", "Constancia"],
    color: "#C94030",
    bg: "#FAF0EE",
    popular: true,
    imgSrc: "/products/Glow_thumb.webp",
  },
  {
    name: "Shield",
    slug: "shield",
    tagline: "Fortaleza inmune natural",
    taglineColor: "#8C6000",
    ingredients: ["Vitamina C", "Zinc", "Vitamina D3", "Vitamina E", "Niacinamida"],
    tags: ["Cuidado preventivo", "Uso diario"],
    color: "#A07000",
    bg: "#FAF6E9",
    popular: false,
    imgSrc: "/products/Shield_thumb.webp",
  },
  {
    name: "Zen",
    slug: "zen",
    tagline: "Calma mental diaria",
    taglineColor: "#2A5490",
    ingredients: ["Triptófano", "Magnesio", "Taurina", "Extracto de Manzanilla", "Vitamina B6"],
    tags: ["Calma funcional", "Días intensos"],
    color: "#3A6FA8",
    bg: "#EBF0F9",
    popular: false,
    imgSrc: "/products/Zen_thumb.webp",
  },
  {
    name: "Woman",
    slug: "woman",
    tagline: "Bienestar hormonal femenino",
    taglineColor: "#6B3080",
    ingredients: ["Extracto de Soya", "Vitamina B6", "Magnesio", "Ácido Fólico", "Hierro"],
    tags: ["Bienestar femenino", "Ritmos naturales"],
    color: "#8A3EBE",
    bg: "#F3EBF9",
    popular: false,
    imgSrc: "/products/Woman_thumb.webp",
  },
];

/* ── Standard product card ────────────────────────────────────────────── */

function ProductCard({
  product,
  index,
  onAdd,
  basePrice,
  currency,
  locale,
}: {
  product: (typeof products)[0];
  index: number;
  onAdd: () => void;
  basePrice: number;
  currency: string;
  locale: string;
}) {
  const subPrice = Math.round(basePrice * (1 - SUB_DISCOUNT));
  const p = product;

  return (
    <motion.div
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        delay: index * 0.08,
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full"
    >
      <Link 
        href={`/${locale}/tienda/${p.slug}`}
        className="block h-full group"
      >
        <div className="group flex flex-col bg-white rounded-[20px] overflow-hidden border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.12)] hover:-translate-y-[5px] transition-all duration-300 h-full">
          <div
            className="relative flex items-center justify-center"
            style={{ background: p.bg, padding: "36px 24px" }}
          >
            <div className="relative w-64 h-64">
              <Image
                src={p.imgSrc}
                alt={`NovaPatch ${p.name}`}
                fill
                sizes="160px"
                loading="lazy"
                className="object-contain group-hover:scale-[1.06] transition-transform duration-300"
              />
            </div>
          </div>

          <div className="p-5 flex flex-col gap-2 flex-1">
            <div>
              <p className="text-[20px] font-black tracking-[-0.01em]" style={{ color: p.taglineColor }}>
                {p.name}
              </p>
              <p className="text-[13px] font-semibold leading-[1.45] mt-0.5 opacity-75" style={{ color: p.taglineColor }}>
                {p.tagline}
              </p>
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-gray-400 mb-1">
                Pack de 30 parches
              </p>
              <p className="text-[12px] text-gray-500 leading-[1.5]">
                {p.ingredients.join(" · ")}
              </p>
            </div>

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

            <div className="mt-auto pt-3 flex items-baseline gap-2">
              <span className="text-[22px] font-black" style={{ color: p.taglineColor }}>
                {formatPrice(basePrice, currency)}
              </span>
            </div>
            <p className="text-[11px] text-green-600 font-semibold -mt-1">
              Desde {formatPrice(subPrice, currency)}/caja con suscripción
            </p>

            <button
              onClick={(e) => {
                e.preventDefault();
                onAdd();
              }}
              className="product-card-btn mt-2 w-full py-3 rounded-xl border-2 text-[14px] font-bold transition-all duration-200 active:scale-[0.97]"
              style={{ "--btn-accent": p.color, borderColor: p.color } as React.CSSProperties}
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

/* ── Main grid ────────────────────────────────────────────────────────── */

export default function ProductGrid({ 
  basePrice = 750, 
  currency = "MXN",
  locale = "mx" 
}: { 
  basePrice?: number; 
  currency?: string;
  locale?: string;
}) {
  const { addToCart } = useCart();

  const handleAdd = (p: (typeof products)[0]) => {
    addToCart({
      slug: p.slug,
      title: p.name,
      image: p.imgSrc,
      price: basePrice,
      color: p.color,
      bg: p.bg,
      mode: "once",
      freq: 30,
    });
  };

  return (
    <section id="productos" className="bg-gray-50 px-5 sm:px-8 md:px-12 pt-20 pb-16">
      <div className="max-w-[1200px] mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2
            className="font-black text-ocean tracking-[-0.02em] mb-3"
            style={{ fontSize: "clamp(26px,3vw,38px)" }}
          >
            Elige el parche que tu cuerpo necesita
          </h2>
          <p className="text-[16px] text-gray-500 max-w-[480px] mx-auto leading-[1.6]">
            Seis fórmulas, seis objetivos. Un solo formato: pega, olvida y deja que trabaje.
          </p>
        </motion.div>

        {/* Grid uniforme de 3 columnas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {products.map((p, i) => (
            <ProductCard
              key={p.slug}
              product={p}
              index={i}
              onAdd={() => handleAdd(p)}
              basePrice={basePrice}
              currency={currency}
              locale={locale}
            />
          ))}
        </div>
      </div>
    </section>
  );
}