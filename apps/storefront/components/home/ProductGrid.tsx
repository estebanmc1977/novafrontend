"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/format";
import { getOrderedMeta, type ProductMeta } from "@/lib/product-meta";
import { useState } from "react";

const SUB_DISCOUNT = 0.2;

function ProductCard({
  product,
  onAdd,
  basePrice,
  currency,
  locale,
}: {
  product: ProductMeta;
  onAdd: () => void;
  basePrice: number;
  currency: string;
  locale: string;
}) {
  const subPrice = Math.round(basePrice * (1 - SUB_DISCOUNT));

  return (
    <Link 
      href={`/${locale}/tienda/${product.slug}`}
      className="block group min-w-[260px] sm:min-w-[300px] snap-start"
    >
      <div className="bg-white rounded-3xl overflow-hidden border border-black/[0.06] shadow-sm hover:shadow-xl h-full flex flex-col transition-all">
        
        <div className="relative h-64 flex items-center justify-center p-6" style={{ background: product.bg }}>
          {product.popular && (
            <span className="absolute top-4 right-4 bg-red-500 text-white text-[10px] font-bold px-3 py-1 rounded-full z-10">
              MÁS POPULAR
            </span>
          )}
          <Image
            src={product.imgSrc}
            alt={product.name}
            width={190}
            height={190}
            className="object-contain group-hover:scale-105 transition-transform duration-500"
          />
        </div>

        <div className="p-6 flex-1 flex flex-col">
          <p className="text-2xl font-black" style={{ color: product.taglineColor }}>
            {product.name}
          </p>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{product.tagline}</p>

          <div className="flex flex-wrap gap-2 mt-4">
            {product.tags.map((tag, i) => (
              <span 
                key={i} 
                className="text-xs px-3 py-1 rounded-full border" 
                style={{ color: product.color, borderColor: product.color }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-auto pt-6">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl font-black" style={{ color: product.taglineColor }}>
                {formatPrice(basePrice, currency)}
              </span>
            </div>
            <p className="text-green-600 text-sm">
              Desde {formatPrice(subPrice, currency)} con suscripción
            </p>

            <button
              onClick={(e) => { 
                e.preventDefault(); 
                onAdd(); 
              }}
              className="mt-5 w-full py-3.5 rounded-2xl text-sm font-bold border-2 hover:bg-gray-50 active:scale-[0.97] transition-all"
              style={{ borderColor: product.color, color: product.color }}
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
  const products = getOrderedMeta();
  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainer) return;
    const scrollAmount = 320; // ancho aproximado de una card
    scrollContainer.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth"
    });
  };

  const handleAdd = (p: ProductMeta) => {
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

                <div className="relative">
          {/* Flechas de navegación - Estilo consistente con HeroSection */}
          <button
            onClick={() => scroll("left")}
            className="hidden sm:flex absolute -left-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/90 items-center justify-center text-[#111827] shadow-[0_4px_16px_rgba(0,0,0,0.10)] hover:bg-white hover:scale-105 transition-all duration-200"
            aria-label="Anterior"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <button
            onClick={() => scroll("right")}
            className="hidden sm:flex absolute -right-4 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white/90 items-center justify-center text-[#111827] shadow-[0_4px_16px_rgba(0,0,0,0.10)] hover:bg-white hover:scale-105 transition-all duration-200"
            aria-label="Siguiente"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Carrusel */}
          <div 
            ref={setScrollContainer}
            className="flex gap-6 overflow-x-auto pb-8 snap-x snap-mandatory scrollbar-hide scroll-smooth"
          >
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

      </div>
    </section>
  );
}