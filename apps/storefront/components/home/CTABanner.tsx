"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "next-intl";

const plans = [
  {
    label: "Frecuencia Mensual",
    days: "Cada 30",
    unit: "días",
    discount: "−20%",
    original: "Antes: MX$750",
    price: "MX$600 / caja",
    features: [
      "Recibe tus parches cada 30 días",
      "Pausa o cancela cuando quieras",
      "Envío automático",
      "Garantía de 30 días",
    ],
    best: true,
    chip: "Más popular",
  },
  {
    label: "Frecuencia Bimestral",
    days: "Cada 60",
    unit: "días",
    discount: "−15%",
    original: "Antes: MX$750",
    price: "MX$638 / caja",
    features: [
      "Recibe tus parches cada 60 días",
      "Pausa o cancela cuando quieras",
      "Envío automático",
    ],
    best: false,
  },
  {
    label: "Frecuencia Trimestral",
    days: "Cada 90",
    unit: "días",
    discount: "−10%",
    original: "Antes: MX$750",
    price: "MX$675 / caja",
    features: [
      "Recibe tus parches cada 90 días",
      "Pausa o cancela cuando quieras",
      "Envío automático",
    ],
    best: false,
  },
];

export default function CTABanner() {
  const t = useTranslations("home.cta");
  return (
    <section
      id="suscripciones"
      className="relative overflow-hidden text-white text-center"
      style={{
        background: "linear-gradient(135deg, var(--color-ocean) 0%, #0068AA 100%)",
        padding: "80px 48px",
      }}
    >
      {/* Dot pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative z-[2]">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="font-black text-white tracking-[-0.02em] mb-3"
            style={{ fontSize: "clamp(28px,3.5vw,44px)" }}
          >
            {t("title")}
          </h2>
          <p
            className="text-[16px] max-w-[500px] mx-auto leading-[1.6]"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            {t("subtitle")}
          </p>
        </motion.div>

        {/* Plans grid */}
        <div className="max-w-[840px] mx-auto mt-14 grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className={`rounded-[32px] text-center transition-all duration-200 ${
                plan.best
                  ? "bg-white text-[#111827] shadow-[0_20px_60px_rgba(0,0,0,0.22)]"
                  : "hover:bg-white/20 hover:-translate-y-1"
              }`}
              style={{
                padding: "36px 24px",
                background: plan.best ? "white" : "rgba(255,255,255,0.12)",
                border: plan.best ? "1px solid white" : "1px solid rgba(255,255,255,0.2)",
              }}
            >
              {/* Chip */}
              {plan.best && (
                <div
                  className="inline-block text-[11px] font-extrabold uppercase tracking-[0.08em] px-3 py-1 rounded-full mb-3.5"
                  style={{ background: "var(--color-gold)", color: "#111827" }}
                >
                  {plan.chip}
                </div>
              )}

              {/* Label */}
              <p
                className="text-[12px] font-semibold uppercase tracking-[0.1em] mb-1.5"
                style={{ color: plan.best ? "#6B7280" : "rgba(255,255,255,0.65)" }}
              >
                {plan.label}
              </p>

              {/* Days */}
              <p
                className="text-[40px] font-black leading-none tracking-[-0.02em] mb-0.5"
                style={{ color: plan.best ? "var(--color-ocean)" : "white" }}
              >
                {plan.days}
              </p>
              <span
                className="block text-[16px] font-medium mb-4"
                style={{ color: plan.best ? "#6B7280" : "rgba(255,255,255,0.8)" }}
              >
                {plan.unit}
              </span>

              {/* Discount */}
              <p
                className="text-[34px] font-black tracking-[-0.02em] mb-0.5"
                style={{ color: plan.best ? "var(--color-ocean)" : "var(--color-gold)" }}
              >
                {plan.discount}
              </p>
              <p
                className="text-[13px] mb-1"
                style={{ color: plan.best ? "#6B7280" : "rgba(255,255,255,0.6)" }}
              >
                {plan.original}
              </p>
              <p
                className="text-[18px] font-bold mb-5"
                style={{ color: plan.best ? "var(--color-ocean)" : "white" }}
              >
                {plan.price}
              </p>

              {/* Features */}
              <ul className="text-left mb-6 space-y-1.5">
                {plan.features.map((f) => (
                  <li
                    key={f}
                    className="text-[13px] flex items-center gap-2"
                    style={{ color: plan.best ? "#111827" : "rgba(255,255,255,0.85)" }}
                  >
                    <span className="font-bold flex-shrink-0" style={{ color: plan.best ? "var(--color-ocean)" : "var(--color-teal)" }}>
                      ✓
                    </span>
                    {f}
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href="/suscripciones"
                className={`block w-full py-3 rounded-full text-[15px] font-bold text-center transition-all duration-200 ${
                  plan.best
                    ? "bg-ocean text-white border-2 border-ocean shadow-[0_4px_16px_rgba(0,80,136,0.3)] hover:bg-ocean-dark"
                    : "bg-transparent text-white border-2 border-white/55 hover:bg-white/15"
                }`}
              >
                {t("button")}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
