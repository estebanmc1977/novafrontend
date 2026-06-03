"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/format";
import type { ProductMeta } from "@/lib/product-meta";

const SUB_DISCOUNT = 0.20;

export default function ProductDetail({ 
  product, 
  locale 
}: { 
  product: ProductMeta; 
  locale: string;
}) {
  const { addToCart } = useCart();
  const [mode, setMode] = useState<"once" | "sub">("sub");
  const [selectedImage, setSelectedImage] = useState(0);

  const basePrice = 750; 
  const subPrice = Math.round(basePrice * (1 - SUB_DISCOUNT));

  // Usa el array de imágenes o fallback a la imagen principal
  const images = product.images && product.images.length > 0 
    ? product.images 
    : [product.imgSrc];

  const handleAddToCart = () => {
    addToCart({
      slug: product.slug,
      title: product.name,
      image: images[0],
      price: basePrice,
      color: product.color,
      bg: product.bg,
      mode,
      freq: 30,
    });
  };

  return (
    <main className="bg-[#F8F7F4] min-h-screen pb-20">
      {/* Hero Section con Galería */}
      <section 
        className="pt-24 pb-16 px-6"
        style={{ background: product.bg }}
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          
          {/* === GALERÍA DE IMÁGENES === */}
          <div className="space-y-6">
            <div className="relative aspect-square bg-white rounded-3xl overflow-hidden shadow-xl">
              <Image
                src={images[selectedImage]}
                alt={product.name}
                fill
                className="object-contain p-8"
                priority
              />
            </div>

            {/* Miniaturas */}
            {images.length > 1 && (
              <div className="flex gap-4 justify-center md:justify-start overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${
                      selectedImage === index 
                        ? 'border-transparent scale-105' 
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} vista ${index + 1}`}
                      fill
                      className="object-contain p-2"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* === INFORMACIÓN DEL PRODUCTO === */}
          <div className="pt-4">
            <h1 
              className="text-5xl md:text-6xl font-black tracking-tighter"
              style={{ color: product.taglineColor }}
            >
              {product.name}
            </h1>
            <p className="text-2xl mt-3 text-gray-700 font-medium">
              {product.tagline}
            </p>

            <p className="mt-6 text-lg leading-relaxed text-gray-600">
              {product.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {product.tags.map((tag, i) => (
                <span 
                  key={i}
                  className="px-4 py-1.5 rounded-full text-sm font-medium border"
                  style={{ 
                    borderColor: product.color,
                    color: product.color 
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Selector Compra / Suscripción */}
            <div className="mt-10">
              <div className="flex gap-3 mb-6">
                <button
                  onClick={() => setMode("once")}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${mode === "once" ? "bg-white shadow" : "bg-transparent"}`}
                  style={{ color: mode === "once" ? product.color : "#666" }}
                >
                  Compra única
                </button>
                <button
                  onClick={() => setMode("sub")}
                  className={`px-6 py-3 rounded-xl font-medium transition-all ${mode === "sub" ? "bg-white shadow" : "bg-transparent"}`}
                  style={{ color: mode === "sub" ? product.color : "#666" }}
                >
                  Suscripción <span className="text-sm">(20% OFF)</span>
                </button>
              </div>

              <div className="flex items-baseline gap-4">
                <span className="text-4xl font-black" style={{ color: product.taglineColor }}>
                  {formatPrice(mode === "sub" ? subPrice : basePrice, "MXN")}
                </span>
                {mode === "sub" && (
                  <span className="text-xl line-through text-gray-400">
                    {formatPrice(basePrice, "MXN")}
                  </span>
                )}
              </div>

              <button
                onClick={handleAddToCart}
                className="mt-8 w-full md:w-auto px-12 py-4 rounded-2xl text-white font-bold text-lg active:scale-[0.97] transition-all"
                style={{ background: product.color }}
              >
                {mode === "sub" ? "Suscribirme ahora" : "Agregar al carrito"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Beneficios */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">¿Qué te acompaña?</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {product.benefits.map((benefit, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-3xl border border-black/5"
            >
              <div className="w-12 h-12 rounded-2xl mb-6" style={{ background: product.bg }} />
              <p className="text-xl leading-tight">{benefit}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Cómo funciona */}
      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">Cómo funciona</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">
            Tecnología transdérmica que libera los ingredientes de forma gradual
          </p>
          <div className="prose prose-lg mx-auto text-gray-700">
            {product.howItWorks}
          </div>
        </div>
      </section>

      {/* Ingredientes + Modo de uso */}
      <section className="max-w-5xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-16">
        <div>
          <h3 className="text-2xl font-bold mb-8">Ingredientes clave</h3>
          <ul className="space-y-6">
            {product.ingredients.map((ing, i) => (
              <li key={i} className="flex gap-4">
                <span className="text-2xl mt-1" style={{ color: product.color }}>•</span>
                <span className="text-lg">{ing}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-8">Modo de uso</h3>
          <ol className="space-y-8">
            {product.usage.map((step, i) => (
              <li key={i} className="flex gap-5">
                <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold border-2" 
                     style={{ borderColor: product.color, color: product.color }}>
                  {i + 1}
                </div>
                <p className="text-lg leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      {product.faqs.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 pb-20">
          <h2 className="text-3xl font-bold text-center mb-10">Preguntas frecuentes</h2>
          <div className="space-y-6">
            {product.faqs.map((faq, i) => (
              <div key={i} className="bg-white p-8 rounded-3xl">
                <p className="font-semibold text-lg mb-3">{faq.q}</p>
                <p className="text-gray-600 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Final */}
      <section className="text-center py-16 bg-white border-t">
        <h2 className="text-4xl font-bold mb-6">¿Listo para probar?</h2>
        <button
          onClick={handleAddToCart}
          className="px-12 py-5 rounded-2xl text-xl font-bold text-white"
          style={{ background: product.color }}
        >
          Agregar {product.name} al carrito
        </button>
      </section>
    </main>
  );
}