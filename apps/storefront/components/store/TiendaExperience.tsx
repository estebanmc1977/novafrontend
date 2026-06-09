"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/commerce";
import { formatPrice } from "@/lib/format";
import { getOrderedMeta, type ProductMeta } from "@/lib/product-meta";

export default function TiendaExperience({ 
  products, 
  currency = "MXN",
  locale = "mx" 
}: { 
  products: Product[], 
  currency?: string;
  locale?: string;
}) {

  return (
    <main className="min-h-screen" style={{ background: "#F8F3EC" }}>

      {/* Hero */}
      <section className="pt-32 pb-12 px-6 text-center">
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[11px] font-bold uppercase tracking-[0.22em] text-coral mb-3"
        >
          Tienda Novapatch
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-black text-ocean tracking-tight mb-3"
          style={{ fontSize: "clamp(28px, 4vw, 46px)" }}
        >
          Elige el parche que necesita tu cuerpo
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[#5A6475] text-base leading-relaxed mb-8 max-w-md mx-auto"
        >
          Seis fórmulas. Un solo formato: pega, olvida y deja que trabaje.
        </motion.p>
      </section>

      {/* Grid de productos */}
      <section className="px-4 pb-24 max-w-[1200px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {products.map((product, i) => {
            const meta = getOrderedMeta().find(m => m.slug === product.slug);
            if (!meta) return null;

            return (
              <motion.div
                key={product.slug}
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`flex ${i === 0 ? "sm:col-span-2 md:col-span-1" : ""}`}
              >
                <Link href={`/${locale}/tienda/${product.slug}`} className="block h-full w-full group">
                  <div className="bg-white rounded-[22px] overflow-hidden border border-black/[0.05] shadow-[0_4px_24px_rgba(0,0,0,0.06)] hover:shadow-[0_16px_48px_rgba(0,0,0,0.09)] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">

                    {/* Imagen */}
                    <div className="relative flex items-center justify-center py-10 px-6" style={{ background: meta.bg }}>
                      {meta.popular && (
                        <span className="absolute top-3 right-3 bg-coral text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1.5 rounded-full">
                          Más popular
                        </span>
                      )}
                      <div className="relative w-48 h-48">
                        <Image
                          src={product.image}
                          alt={product.title}
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

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-gray-400 mb-1">
                          Pack de 30 parches
                        </p>
                        <p className="text-[12px] text-gray-500 leading-[1.5]">
                          {meta.ingredients.map(ing => ing.name).join(" · ")}
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

                      {/* Precio Full + "desde" suscripción */}
                      <div className="mt-auto pt-3 border-t border-black/[0.05]">
                        <span className="text-[26px] font-black tracking-tight text-navy-light">
                          {formatPrice(product.price, currency)}
                        </span>
                        <div className="mt-1">
                          <p className="text-[14px] text-gray-600">
                            desde <span className="font-semibold text-green-600">
                              {formatPrice(Math.round(product.price * 0.8), currency)}
                            </span> con suscripción
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </main>
  );
}