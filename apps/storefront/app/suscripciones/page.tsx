"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Data ─────────────────────────────────────────────────────────────────────

const benefits = [
  {
    title: "Sin interrupciones",
    desc: "Tu parche llega antes de que se te acabe. Sin acordarte. Sin perder el ritmo.",
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "Precio de suscriptor",
    desc: "Siempre más bajo que la compra individual. El hábito que sostiene, conviene.",
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    title: "Tú controlas",
    desc: "Pausa, cambia o cancela cuando quieras. Sin llamadas, sin penalizaciones.",
    icon: (
      <svg width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24">
        <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
];

const steps = [
  {
    n: "01",
    title: "Elige tus parches",
    desc: "Energy, Sleep, Zen, Shield, Glow, Woman — los que quieras, en la combinación que tenga sentido para ti.",
  },
  {
    n: "02",
    title: "Define la frecuencia de cada uno",
    desc: "Cada parche tiene su propio ritmo. Energy cada 30 días, Glow cada 60, Sleep cada 90 — tú decides cuándo necesitas más de cada uno.",
  },
  {
    n: "03",
    title: "Recibe y usa",
    desc: "Cada producto llega cuando lo necesitas, sin que tengas que calcularlo. La constancia está resuelta.",
  },
];

const frecuencias = [
  { days: "30", label: "Mensual", discount: "20%", price: "$599", tagline: "Más seguido, más ahorro.", best: true },
  { days: "60", label: "Bimestral", discount: "15%", price: "$637", tagline: "Balance entre ritmo y descuento.", best: false },
  { days: "90", label: "Trimestral", discount: "10%", price: "$674", tagline: "Ideal para uso esporádico.", best: false },
];

const comparativo = [
  { feature: "Precio preferencial", sub: true, uni: false },
  { feature: "Llega sin que tengas que acordarte", sub: true, uni: false },
  { feature: "Frecuencia personalizada por producto", sub: true, uni: false },
  { feature: "Pausa o cancela cuando quieras", sub: true, uni: null },
  { feature: "Cambias de producto si cambia tu rutina", sub: true, uni: null },
  { feature: "Stock garantizado en tu frecuencia", sub: true, uni: false },
];

const gestion = [
  {
    title: "Pausa cuando lo necesites",
    desc: "¿Te vas de viaje o ya tienes stock? Pausa cualquier producto desde tu cuenta, sin explicaciones.",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 6H8a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Zm7 0h-1a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h1a1 1 0 0 0 1-1V7a1 1 0 0 0-1-1Z"/>
      </svg>
    ),
  },
  {
    title: "Cambia tus parches o tu frecuencia",
    desc: "¿Cambió tu rutina? Ajusta qué productos recibes y cada cuánto, antes de tu próximo envío.",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3"/>
      </svg>
    ),
  },
  {
    title: "Cancela sin penalizaciones",
    desc: "Si decides salir, sales. Sin llamadas, sin formularios complicados, sin cargos extra.",
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 14v3m-3-6V7a3 3 0 1 1 6 0v4m-8 0h10a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1Z"/>
      </svg>
    ),
  },
];

const faqs = [
  { q: "¿Cuándo se hace el primer cobro?", a: "El cobro se realiza al confirmar tu suscripción. A partir de ahí, cada producto se factura automáticamente según la frecuencia que elegiste para ese parche." },
  { q: "¿Todos mis productos llegan en el mismo envío?", a: "No necesariamente. Cada producto tiene su propia frecuencia, por lo que los envíos se generan de forma independiente según el ritmo que elegiste para cada uno. Así recibes lo que necesitas, cuando lo necesitas." },
  { q: "¿Puedo cambiar mis productos o mi frecuencia?", a: "Sí. Desde tu cuenta puedes ajustar qué parches incluye tu próximo envío y con qué frecuencia los recibes, antes de que se procese el siguiente ciclo." },
  { q: "¿Cómo pauso mi suscripción?", a: "Desde tu perfil en Novapatch, con un clic. Puedes pausar un producto individual o toda tu suscripción. La pausa detiene el cobro y el envío hasta que tú decidas reactivarlo." },
  { q: "¿Puedo cancelar en cualquier momento?", a: "Sí, sin penalizaciones ni períodos mínimos de permanencia. Si cancelas antes de la fecha de tu próximo envío, no se genera ningún cargo adicional." },
  { q: "¿Qué pasa si ya tengo parches en casa?", a: "Puedes pausar ese producto hasta que los necesites. El resto de tu plan sigue funcionando con normalidad." },
  { q: "¿Cuál es la diferencia de descuento entre frecuencias?", a: "Mensual (cada 30 días): 20% off. Bimestral (cada 60 días): 15% off. Trimestral (cada 90 días): 10% off. Mientras más seguido recibes, mayor es el descuento — porque la constancia es lo que hace que el bienestar funcione." },
];

// ─── FAQ component ─────────────────────────────────────────────────────────────

function FAQItem({ faq, isOpen, onToggle }: { faq: { q: string; a: string }; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${isOpen ? "bg-white border-[#3CBFAB]/25 shadow-[0_4px_20px_rgba(0,80,136,0.08)]" : "bg-white/80 border-[#005088]/8 hover:border-[#3CBFAB]/20"}`}>
      <button onClick={onToggle} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className={`text-[15px] font-semibold leading-snug ${isOpen ? "text-[#3CBFAB]" : "text-[#005088]"}`}>{faq.q}</span>
        <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }}
          className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center ${isOpen ? "bg-[#3CBFAB]" : "bg-[#005088]/8"}`}>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 2v8M2 6h8" stroke={isOpen ? "white" : "#005088"} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}>
            <div className="px-5 pb-5">
              <div className="h-px bg-[#3CBFAB]/10 mb-4" />
              <p className="text-[14px] text-[#6B7280] leading-relaxed">{faq.a}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Check / X icons ───────────────────────────────────────────────────────────

function Check() {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full" style={{ background: "#E6F7F6" }}>
      <svg width="12" height="10" fill="none"><path d="M1 5l3.5 3.5L11 1" stroke="#3CBFAB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </span>
  );
}
function Cross() {
  return (
    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full" style={{ background: "#F3F4F6" }}>
      <svg width="10" height="10" fill="none"><path d="M2 2l6 6M8 2l-6 6" stroke="#9CA3AF" strokeWidth="1.8" strokeLinecap="round"/></svg>
    </span>
  );
}
function Dash() {
  return <span className="inline-flex items-center justify-center w-6 h-6 text-[#9CA3AF] font-bold text-lg leading-none">—</span>;
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function SuscripcionesPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Navbar lightBg />
      <main>

        {/* ── 1. HERO ── */}
        <section
          className="relative overflow-hidden pt-24 pb-0"
          style={{ background: "#FEF7ED" }}
        >
          {/* Dot texture */}
          <div className="absolute inset-0 pointer-events-none opacity-60"
            style={{ backgroundImage: "radial-gradient(circle, rgba(0,80,136,0.05) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

          <div className="relative max-w-[1200px] mx-auto px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-0 items-end">
            {/* Copy */}
            <motion.div
              initial={{ opacity: 0, x: -32 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
              className="py-20 lg:py-28"
            >
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.14em] mb-5 px-3 py-1.5 rounded-full"
                style={{ background: "rgba(0,80,136,0.1)", color: "#005088" }}>
                Suscripciones
              </span>
              <h1
                className="font-black leading-[1.06] tracking-[-0.025em] mb-5 text-[#005088]"
                style={{ fontSize: "clamp(36px,4.5vw,62px)" }}
              >
                El hábito que no<br />tienes que recordar.
              </h1>
              <p className="text-[17px] leading-[1.7] mb-9" style={{ color: "#6B7280", maxWidth: "440px" }}>
                Elige tus parches, define cada cuánto los quieres y olvídate del resto. Tu bienestar llega solo — con descuento, sin compromiso.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link
                  href="#planes"
                  className="inline-flex items-center gap-2 font-bold text-[15px] px-7 py-3.5 rounded-full text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(60,191,171,0.35)] shadow-[0_4px_20px_rgba(60,191,171,0.25)]"
                  style={{ background: "#3CBFAB" }}
                >
                  Arma tu plan
                  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
                <Link
                  href="#como-funciona"
                  className="inline-flex items-center gap-2 font-semibold text-[15px] px-6 py-3.5 rounded-full transition-all duration-200 hover:bg-[#005088]/8"
                  style={{ color: "#005088", border: "2px solid rgba(0,80,136,0.3)" }}
                >
                  Ver cómo funciona ↓
                </Link>
              </div>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as const, delay: 0.1 }}
              className="flex items-end justify-center lg:justify-end"
            >
              <div className="relative w-full max-w-[420px]" style={{ height: "520px" }}>
                <Image
                  src="/productusers/threepack.webp"
                  alt="Novapatch Sleep, Woman y Shield"
                  fill
                  className="object-cover object-top rounded-t-[32px]"
                  sizes="420px"
                  priority
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── 2. BENEFITS BAND ── */}
        <section style={{ background: "#F8EDEB", padding: "0" }}>
          <div className="max-w-[1200px] mx-auto px-8 lg:px-12 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-[#005088]"
                  style={{ background: "rgba(0,80,136,0.1)" }}>
                  {b.icon}
                </div>
                <div>
                  <p className="font-bold text-[#005088] text-[15px] mb-1">{b.title}</p>
                  <p className="text-[13px] leading-[1.6]" style={{ color: "#6B7280" }}>{b.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ── 3. CÓMO FUNCIONA ── */}
        <section id="como-funciona" className="py-24 px-8 bg-white">
          <div className="max-w-[1100px] mx-auto">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-16">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: "#3CBFAB" }}>El proceso</p>
              <h2 className="font-black text-[#005088] tracking-[-0.02em]" style={{ fontSize: "clamp(28px,3.5vw,44px)" }}>
                Así de simple.
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((s, i) => (
                <motion.div
                  key={s.n}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
                  className="relative"
                >
                  <div className="text-[56px] font-black leading-none mb-4 tracking-[-0.03em]"
                    style={{ color: "rgba(0,80,136,0.1)" }}>
                    {s.n}
                  </div>
                  <h3 className="text-[18px] font-bold text-[#005088] mb-2">{s.title}</h3>
                  <p className="text-[14px] text-[#6B7280] leading-[1.7]">{s.desc}</p>
                  {i < steps.length - 1 && (
                    <div className="hidden md:block absolute top-7 right-0 w-8 text-[#E5E7EB] text-[24px]">→</div>
                  )}
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-14 text-[16px] italic text-[#6B7280] border-l-4 pl-5"
              style={{ borderColor: "#3CBFAB" }}
            >
              &ldquo;El mejor hábito es el que no depende de tu fuerza de voluntad.&rdquo;
            </motion.p>
          </div>
        </section>

        {/* ── 4. PLANES ── */}
        <section id="planes" className="py-24 px-8" style={{ background: "#FAF7F2" }}>
          <div className="max-w-[1100px] mx-auto">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-4">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: "#3CBFAB" }}>Frecuencias</p>
              <h2 className="font-black text-[#005088] tracking-[-0.02em] mb-3" style={{ fontSize: "clamp(28px,3.5vw,44px)" }}>
                Cada producto, a tu ritmo.
              </h2>
              <p className="text-[16px] text-[#6B7280] max-w-[560px] leading-[1.7]">
                No todos los hábitos son iguales. Por eso cada parche tiene su propia frecuencia — y su propio descuento.
              </p>
            </motion.div>

            {/* Más seguido hint */}
            <div className="flex items-center gap-3 mb-10 mt-2">
              <div className="h-1 flex-1 rounded-full" style={{ background: "linear-gradient(90deg, #3CBFAB, #005088)" }} />
              <span className="text-[12px] font-bold text-[#3CBFAB] whitespace-nowrap">Más seguido, más ahorro.</span>
              <div className="h-1 w-8 rounded-full" style={{ background: "#E5E7EB" }} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {frecuencias.map((f, i) => (
                <motion.div
                  key={f.days}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
                  className="rounded-3xl p-7 flex flex-col gap-4 relative"
                  style={{
                    background: f.best ? "#3CBFAB" : "white",
                    border: f.best ? "none" : "1px solid #E5E7EB",
                    boxShadow: f.best ? "0 12px 48px rgba(13,27,53,0.25)" : "0 4px 16px rgba(0,0,0,0.05)",
                  }}
                >
                  {f.best && (
                    <div className="absolute -top-3 left-6 text-[11px] font-extrabold uppercase tracking-[0.08em] px-3 py-1 rounded-full"
                      style={{ background: "#3CBFAB", color: "white" }}>
                      Más popular
                    </div>
                  )}

                  <div className="flex items-end gap-2">
                    <span className="text-[52px] font-black leading-none tracking-[-0.03em]"
                      style={{ color: f.best ? "white" : "#3CBFAB" }}>
                      {f.days}
                    </span>
                    <span className="text-[16px] font-medium mb-2" style={{ color: f.best ? "rgba(255,255,255,0.7)" : "#9CA3AF" }}>
                      días
                    </span>
                  </div>

                  <div>
                    <p className="text-[13px] font-semibold uppercase tracking-[0.06em] mb-1"
                      style={{ color: f.best ? "rgba(255,255,255,0.6)" : "#9CA3AF" }}>
                      {f.label}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-[28px] font-black" style={{ color: f.best ? "white" : "#005088" }}>
                        {f.price}
                      </span>
                      <span className="text-[13px]" style={{ color: f.best ? "rgba(255,255,255,0.6)" : "#9CA3AF" }}>
                        / caja
                      </span>
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full self-start"
                    style={{
                      background: f.best ? "rgba(255,255,255,0.15)" : "rgba(30,177,188,0.1)",
                      color: f.best ? "white" : "#3CBFAB",
                    }}>
                    <span className="text-[13px] font-black">{f.discount}</span>
                    <span className="text-[11px] font-medium">descuento</span>
                  </div>

                  <div className="h-px" style={{ background: f.best ? "rgba(255,255,255,0.15)" : "#F3F4F6" }} />

                  <p className="text-[13px] leading-[1.6]" style={{ color: f.best ? "rgba(255,255,255,0.65)" : "#9CA3AF" }}>
                    {f.tagline}
                  </p>
                </motion.div>
              ))}
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-8 text-[14px] text-[#6B7280] leading-[1.7] max-w-[640px]"
            >
              Elige la frecuencia que corresponde a cómo usas cada producto. Si usas Energy todos los días y Glow con más calma, tu plan lo refleja — cada uno llega cuando lo necesitas, sin acumular lo que no usas.
            </motion.p>
          </div>
        </section>

        {/* ── 5. ARMA TU COMBINACIÓN ── */}
        <section className="py-24 px-8 bg-white">
          <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: "#3CBFAB" }}>Tu plan</p>
              <h2 className="font-black text-[#005088] tracking-[-0.02em] mb-5" style={{ fontSize: "clamp(26px,3vw,40px)" }}>
                Tu bienestar no es estándar.<br />Tu plan tampoco.
              </h2>
              <p className="text-[16px] text-[#6B7280] leading-[1.7] mb-5">
                Puedes suscribirte a varios parches en un mismo plan, cada uno con su propia frecuencia. Energy cada 30 días porque lo usas a diario. Glow cada 60 porque tu ritmo es otro. Sleep cada 90 porque lo reservas para semanas exigentes.
              </p>
              <p className="text-[15px] font-semibold text-[#005088] mb-8">
                Un solo plan. Cada producto llega cuando tiene que llegar.
              </p>
              <Link
                href="/productos"
                className="inline-flex items-center gap-2 font-bold text-[15px] px-7 py-3.5 rounded-full text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(13,27,53,0.3)]"
                style={{ background: "#3CBFAB" }}
              >
                Armar mi combinación
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </motion.div>

            {/* Visual example cards */}
            <motion.div initial={{ opacity: 0, x: 32 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const, delay: 0.1 }}>
              <div className="flex flex-col gap-3">
                {[
                  { name: "Energy", freq: "cada 30 días", color: "#83B5F4", bg: "#C8E4F5" },
                  { name: "Glow", freq: "cada 60 días", color: "#F25C54", bg: "#F5C5BC" },
                  { name: "Sleep", freq: "cada 90 días", color: "#3CBFAB", bg: "#B8EDE4" },
                ].map((p, i) => (
                  <motion.div
                    key={p.name}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 + i * 0.1, duration: 0.5 }}
                    className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 border border-[#F3F4F6] shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
                  >
                    <div className="w-10 h-10 rounded-xl flex-shrink-0" style={{ background: p.bg }} />
                    <div className="flex-1">
                      <p className="font-bold text-[#005088] text-[15px]">Novapatch {p.name}</p>
                      <p className="text-[12px]" style={{ color: "#9CA3AF" }}>Llega {p.freq}</p>
                    </div>
                    <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: p.bg, color: p.color }}>
                      Activo
                    </span>
                  </motion.div>
                ))}
                <div className="mt-2 flex items-center justify-between px-2">
                  <span className="text-[13px] text-[#9CA3AF]">3 parches · 1 plan</span>
                  <span className="text-[13px] font-bold" style={{ color: "#3CBFAB" }}>Ahorro combinado ↑</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── 6. COMPARATIVO ── */}
        <section className="py-24 px-8" style={{ background: "#FAF7F2" }}>
          <div className="max-w-[860px] mx-auto">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-10">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: "#3CBFAB" }}>Comparativo</p>
              <h2 className="font-black text-[#005088] tracking-[-0.02em]" style={{ fontSize: "clamp(26px,3vw,40px)" }}>
                ¿Por qué suscribirse?
              </h2>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
              <div className="rounded-3xl overflow-hidden border border-[#E5E7EB] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.06)]">
                {/* Table header */}
                <div className="grid border-b border-[#F3F4F6]" style={{ gridTemplateColumns: "1fr 140px 130px" }}>
                  <div className="p-5 text-[13px] font-bold text-[#9CA3AF] uppercase tracking-[0.06em] flex items-center">Característica</div>
                  <div className="p-5 text-center flex flex-col items-center justify-center" style={{ background: "#3CBFAB" }}>
                    <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/70 mb-1">Suscripción</p>
                    <p className="text-[13px] font-black text-white">Novapatch</p>
                  </div>
                  <div className="p-5 text-center flex flex-col items-center justify-center">
                    <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#9CA3AF] mb-1">Sin suscripción</p>
                    <p className="text-[13px] font-semibold text-[#6B7280]">Compra individual</p>
                  </div>
                </div>
                {comparativo.map((row, i) => (
                  <div
                    key={row.feature}
                    className="grid border-b border-[#F9FAFB] last:border-b-0"
                    style={{ gridTemplateColumns: "1fr 140px 130px", background: i % 2 === 1 ? "#FAFAFA" : "white" }}
                  >
                    <div className="px-5 py-4 text-[14px] font-medium text-[#374151] flex items-center">{row.feature}</div>
                    <div className="px-5 py-4 flex items-center justify-center"
                      style={{ background: i % 2 === 1 ? "#EEF5FB" : "#F0F7FF" }}>
                      <Check />
                    </div>
                    <div className="px-5 py-4 flex items-center justify-center">
                      {row.uni === true ? <Check /> : row.uni === null ? <Dash /> : <Cross />}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3, duration: 0.5 }}
              className="mt-8 rounded-2xl p-6" style={{ background: "rgba(0,80,136,0.05)", border: "1px solid rgba(0,80,136,0.1)" }}>
              <p className="text-[15px] font-semibold text-[#3CBFAB] leading-[1.6]">
                La suscripción no es un compromiso.<br />
                <span className="font-normal text-[#6B7280]">Es dejar de interrumpir tu bienestar cada vez que se te acaba.</span>
              </p>
            </motion.div>
          </div>
        </section>

        {/* ── 7. GESTIÓN ── */}
        <section className="py-24 px-8" style={{ background: "#F8EDEB" }}>
          <div className="max-w-[1100px] mx-auto">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-14">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: "#3CBFAB" }}>Control total</p>
              <h2 className="font-black text-[#005088] tracking-[-0.02em]" style={{ fontSize: "clamp(26px,3vw,40px)" }}>
                Tú tienes el control, siempre.
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {gestion.map((g, i) => (
                <motion.div
                  key={g.title}
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.6 }}
                  className="rounded-3xl p-7 flex flex-col gap-4 bg-white"
                  style={{ border: "1px solid rgba(0,80,136,0.08)", boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}
                >
                  <div className="text-[#005088]">{g.icon}</div>
                  <h3 className="text-[17px] font-bold text-[#005088]">{g.title}</h3>
                  <p className="text-[14px] leading-[1.7]" style={{ color: "#6B7280" }}>{g.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 8. FAQ ── */}
        <section className="py-24 px-8 bg-white">
          <div className="max-w-[760px] mx-auto">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="mb-10">
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] mb-3" style={{ color: "#3CBFAB" }}>FAQ</p>
              <h2 className="font-black text-[#005088] tracking-[-0.02em]" style={{ fontSize: "clamp(26px,3vw,40px)" }}>
                Preguntas frecuentes.
              </h2>
            </motion.div>
            <div className="flex flex-col gap-3">
              {faqs.map((faq, i) => (
                <FAQItem key={i} faq={faq} isOpen={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? null : i)} />
              ))}
            </div>
          </div>
        </section>

        {/* ── 9. CTA CIERRE ── */}
        <section className="py-24 px-8 text-center" style={{ background: "#FAF7F2" }}>
          <div className="max-w-[600px] mx-auto">
            <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <h2 className="font-black text-[#005088] tracking-[-0.02em] mb-4" style={{ fontSize: "clamp(28px,3.5vw,44px)" }}>
                El hábito más fácil<br />que vas a empezar hoy.
              </h2>
              <p className="text-[16px] text-[#6B7280] leading-[1.7] mb-9">
                Elige tus parches, define la frecuencia de cada uno y deja que el bienestar llegue solo.
              </p>
              <Link
                href="/productos"
                className="inline-flex items-center gap-2 font-bold text-[16px] px-9 py-4 rounded-full text-white transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_36px_rgba(13,27,53,0.3)] shadow-[0_4px_20px_rgba(13,27,53,0.2)]"
                style={{ background: "#3CBFAB" }}
              >
                Armar mi plan
                <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
              <p className="mt-4 text-[13px]" style={{ color: "#9CA3AF" }}>
                Sin permanencia mínima. Pausa o cancela cuando quieras.
              </p>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
