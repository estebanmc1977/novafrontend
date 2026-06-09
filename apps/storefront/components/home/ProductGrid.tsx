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
    tags: ["Bienestar femenino", "Ritmos naturales"],
    color: "#8A3EBE",
    bg: "#F3EBF9",
    popular: false,
    imgSrc: "/products/Woman_thumb.webp",
  },
];

function ProductCard({
  product,
  onAdd,
  basePrice,
  currency,
  locale,
}: {
  product: (typeof products)[0];
  onAdd: () => void;
  basePrice: number;
  currency: string;
  locale: string;
}) {
  const subPrice = Math.round(basePrice * (1 - SUB_DISCOUNT));
  const p = product;

  return (
    <Link 
      href={`/${locale}/tienda/${p.slug}`}
      className="block group min-w-[260px] sm:min-w-[300px] snap-start"
    >
      <div className="bg-white rounded-3xl overflow-hidden border border-black/[0.06] shadow-sm hover:shadow-xl h-full flex flex-col transition-all">
        
        {/* Imagen grande */}
        <div className="relative h-64 flex items-center justify-center p-6" style={{ background: p.bg }}>
          {p.popular && (
            <span className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full z-10">
              MÁS POPULAR
            </span>
          )}
          <Image
            src={p.imgSrc}
            alt={p.name}
            width={190}
            height={190}
            className="object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        {/* Contenido */}
        <div className="p-6 flex-1 flex flex-col">
          <p className="text-2xl font-black" style={{ color: p.taglineColor }}>{p.name}</p>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{p.tagline}</p>

          <div className="flex flex-wrap gap-2 mt-4">
            {p.tags.map((tag, i) => (
              <span 
                key={i} 
                className="text-xs px-3 py-1 rounded-full border" 
                style={{ color: p.color, borderColor: p.color }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-auto pt-6">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black" style={{ color: p.taglineColor }}>
                {formatPrice(basePrice, currency)}
              </span>
            </div>
            <p className="text-green-600 text-sm">Desde {formatPrice(subPrice, currency)} con suscripción</p>

            {/* Botón Agregar al carrito */}
            <button
              onClick={(e) => { 
                e.preventDefault(); 
                onAdd(); 
              }}
              className="mt-5 w-full py-3.5 rounded-2xl text-sm font-bold border-2 hover:bg-gray-50 active:scale-[0.97] transition-all"
              style={{ borderColor: p.color, color: p.color }}
            >
              Agregar al carrito
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}

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
    <section id="productos" className="bg-gray-50 px-5 sm:px-8 md:px-12 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-black text-ocean tracking-[-0.02em] text-4xl md:text-5xl mb-4">
            Elige el parche que tu cuerpo necesita
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            Seis fórmulas pensadas para acompañarte
          </p>
        </div>

        {/* Carrusel Horizontal */}
        <div className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide">
          {products.map((p) => (
            <ProductCard
              key={p.slug}
              product={p}
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