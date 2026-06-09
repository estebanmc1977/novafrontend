"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/format";
import type { ProductMeta } from "@/lib/product-meta";
import AttributeBar from "@/components/home/AttributeBar";

export default function ProductDetail({ 
  product, 
  locale 
}: { 
  product: ProductMeta; 
  locale: string;
}) {
  const { addToCart } = useCart();
  const [mode, setMode] = useState<"once" | "sub">("sub");
  const [freq, setFreq] = useState<30 | 60 | 90>(30);

  const [selectedImage, setSelectedImage] = useState(0);

  const basePrice = 750;

  const getDiscount = (days: 30 | 60 | 90) => {
    if (days === 30) return 0.20;
    if (days === 60) return 0.15;
    return 0.10;
  };

  const currentPrice = mode === "once" 
    ? basePrice 
    : Math.round(basePrice * (1 - getDiscount(freq)));

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
      freq: mode === "once" ? 30 : freq,
    });
  };

  return (
    <main className="bg-[#F8F7F4] min-h-screen">
      {/* Hero Section con Galería */}
      <section 
        className="pt-24 pb-16 px-6"
        style={{ background: product.bg }}
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-start">
          
                    {/* GALERÍA DE IMÁGENES CON FLECHAS */}
          <div className="space-y-6 relative">
            <div className="relative aspect-[4/5] bg-white rounded-3xl overflow-hidden shadow-xl group">
              <Image
                src={images[selectedImage]}   // ← funciona?
                alt={product.name}
                fill
                className="object-cover"
                priority
              />

              {/* Flechas de navegación - Estilo consistente con HeroSection */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage((prev) => (prev - 1 + images.length) % images.length)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-[#111827] shadow-[0_4px_16px_rgba(0,0,0,0.10)] hover:bg-white hover:scale-105 transition-all duration-200 hidden sm:flex"
                    aria-label="Imagen anterior"
                  >
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M15 18l-6-6 6-6" />
                    </svg>
                  </button>

                  <button
                    onClick={() => setSelectedImage((prev) => (prev + 1) % images.length)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/90 flex items-center justify-center text-[#111827] shadow-[0_4px_16px_rgba(0,0,0,0.10)] hover:bg-white hover:scale-105 transition-all duration-200 hidden sm:flex"
                    aria-label="Siguiente imagen"
                  >
                    <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            {/* Miniaturas */}
            {images.length > 1 && (
              <div className="flex gap-4 justify-center md:justify-start overflow-x-auto pb-2">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-24 flex-shrink-0 rounded-2xl overflow-hidden border-2 transition-all duration-200 ${
                      selectedImage === index 
                        ? 'border-transparent scale-105'           
                        : 'border-transparent hover:border-[color:var(--accent-color)]'
                    }`}
                    style={{ '--accent-color': product.color } as React.CSSProperties}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} vista ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* INFORMACIÓN DEL PRODUCTO */}
          <div className="pt-4">
            <h1 className="text-5xl md:text-6xl font-black tracking-tighter" style={{ color: product.taglineColor }}>
              {product.name}
            </h1>
            <p className="text-2xl mt-3 text-gray-700 font-medium">{product.tagline}</p>

            <p className="mt-6 text-lg leading-relaxed text-gray-600">{product.description}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              {product.tags.map((tag, i) => (
                <span key={i} className="px-4 py-1.5 rounded-full text-sm font-medium border" style={{ borderColor: product.color, color: product.color }}>
                  {tag}
                </span>
              ))}
            </div>

            {/* SELECTOR DE FRECUENCIA */}
            <div className="mt-10">
              <p className="text-sm font-medium text-gray-500 mb-3">¿Cómo querés recibirlo?</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <button
                  onClick={() => { setMode("once"); }}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${mode === "once" ? "border-black bg-white" : "border-gray-200"}`}
                >
                  <p className="font-semibold">Compra única</p>
                  <p className="text-xl font-black mt-1" style={{ color: product.taglineColor }}>{formatPrice(basePrice, "MXN")}</p>
                </button>

                <button
                  onClick={() => { setMode("sub"); setFreq(30); }}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${mode === "sub" && freq === 30 ? "border-black bg-white" : "border-gray-200"}`}
                >
                  <p className="font-semibold">Mensual</p>
                  <p className="text-xl font-black mt-1" style={{ color: product.taglineColor }}>{formatPrice(Math.round(basePrice * 0.8), "MXN")}</p>
                  <p className="text-xs text-green-600">20% OFF</p>
                </button>

                <button
                  onClick={() => { setMode("sub"); setFreq(60); }}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${mode === "sub" && freq === 60 ? "border-black bg-white" : "border-gray-200"}`}
                >
                  <p className="font-semibold">Bimestral</p>
                  <p className="text-xl font-black mt-1" style={{ color: product.taglineColor }}>{formatPrice(Math.round(basePrice * 0.85), "MXN")}</p>
                  <p className="text-xs text-green-600">15% OFF</p>
                </button>

                <button
                  onClick={() => { setMode("sub"); setFreq(90); }}
                  className={`p-4 rounded-2xl border-2 text-left transition-all ${mode === "sub" && freq === 90 ? "border-black bg-white" : "border-gray-200"}`}
                >
                  <p className="font-semibold">Trimestral</p>
                  <p className="text-xl font-black mt-1" style={{ color: product.taglineColor }}>{formatPrice(Math.round(basePrice * 0.9), "MXN")}</p>
                  <p className="text-xs text-green-600">10% OFF</p>
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className="mt-8 w-full py-4 rounded-2xl text-white font-bold text-lg active:scale-[0.97] transition-all"
              style={{ background: product.color }}
            >
              {mode === "once" ? "Agregar al carrito" : `Suscribirme (${freq} días)`}
            </button>
          </div>
        </div>
      </section>

      {/* Banner de Beneficios Suscripción */}
      <AnimatePresence mode="wait">
        {mode === "sub" && (
          <motion.section
            key="benefits-banner"
            initial={{ opacity: 0, height: 0, y: 20 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0, y: 20 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
            style={{ background: "#FAF7F2" }}
          >
            <div className="max-w-5xl mx-auto px-6 py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    title: "Sin interrupciones",
                    desc: "Tu parche llega antes de que se te acabe. Sin acordarte. Sin perder el ritmo.",
                    icon: (
                      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ),
                  },
                  {
                    title: "Precio de suscriptor",
                    desc: "Siempre más bajo que la compra individual. El hábito que sostiene, conviene.",
                    icon: (
                      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ),
                  },
                  {
                    title: "Tú controlas",
                    desc: "Pausa, cambia o cancela cuando quieras. Sin llamadas, sin penalizaciones.",
                    icon: (
                      <svg width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
                        <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    ),
                  },
                ].map((b, i) => (
                  <div key={i} className="flex gap-5 items-start">
                    <div className="text-[#3CBFAB] flex-shrink-0 mt-1">
                      {b.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-[#005088] text-[17px] mb-1.5">{b.title}</h4>
                      <p className="text-[14px] leading-[1.55] text-gray-600">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* Sección ¿Cómo te acompaña? con iconos específicos */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">¿Cómo te acompaña?</h2>
        
        <div className="grid md:grid-cols-2 gap-8">
          {product.benefits.map((benefit, i) => {
            // Ruta dinámica del icono según el producto y el índice
            const iconPath = `/features/${product.slug}_icons/${product.slug}${i === 0 ? '' : i + 1}_bk.png`;
            
            return (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                className="flex gap-6 items-start"
              >
                <div className="flex-shrink-0 mt-1">
                  <Image 
                    src={iconPath} 
                    alt={`Beneficio ${i + 1}`}
                    width={40} 
                    height={40} 
                    className="object-contain"
                  />
                </div>
                <p className="text-[17px] leading-relaxed text-gray-700 pt-1">{benefit}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-4">Cómo funciona</h2>
          <p className="text-center text-gray-600 max-w-2xl mx-auto mb-12">Los parches Novapatch liberan sus ingredientes activos de forma gradual directamente a través de la piel hacia el torrente sanguíneo.</p>
          <div className="text-center prose prose-lg mx-auto text-gray-600">{product.howItWorks}</div>
        </div>
      </section>

      {/* === SECCIÓN INGREDIENTES ACTUALIZADA === */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h3 className="text-3xl font-bold text-center mb-12">Ingredientes clave</h3>
        <div className="grid md:grid-cols-2 gap-x-12 gap-y-10">
          {product.ingredients.map((ing, i) => (
            <div key={i} className="flex gap-5">
              <span className="text-3xl mt-1 flex-shrink-0" style={{ color: product.color }}>•</span>
              <div>
                <p className="text-xl font-semibold text-gray-900">{ing.name}</p>
                <p className="text-[15px] text-gray-600 mt-1.5 leading-relaxed">{ing.benefit}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Sección Modo de uso - 3 columnas */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center mb-12">Modo de uso</h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {product.usage.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold mb-5 flex-shrink-0"
                  style={{ 
                    border: `2px solid ${product.color}`,
                    color: product.color 
                  }}
                >
                  {i + 1}
                </div>
                
                <p className="text-[17px] leading-relaxed text-gray-700">
                  {step}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {product.faqs.length > 0 && (
        <section className="max-w-3xl mx-auto px-6 pb-20 py-20">
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

      <section className="text-center py-16 bg-white ">
        <h2 className="text-4xl font-bold mb-6">¿Listo para probar?</h2>
        <button onClick={handleAddToCart} className="px-12 py-5 rounded-2xl text-xl font-bold text-white" style={{ background: product.color }}>
          Agregar {product.name} al carrito
        </button>
      </section>

      {/* Banner de atributos */}
      <AttributeBar accent={product.color} current={selectedImage} />
    </main>
  );
}