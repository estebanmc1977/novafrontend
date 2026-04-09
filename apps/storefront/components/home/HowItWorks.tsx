"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function HowItWorks() {
  const t = useTranslations("home.howItWorks");

  const steps = [
    { n: 1, title: t("step1Title"), desc: t("step1Desc") },
    { n: 2, title: t("step2Title"), desc: t("step2Desc") },
    { n: 3, title: t("step3Title"), desc: t("step3Desc") },
  ];
  return (
    <section id="como-funciona" className="bg-white" style={{ padding: "80px 48px" }}>
      <div className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Image — left */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative rounded-[48px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.14)]"
        >
          <div className="relative w-full" style={{ height: "480px" }}>
            <Image
              src="/productusers/bellypatch.webp"
              alt="Cómo usar Novapatch"
              fill
              loading="lazy"
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
          {/* Badge — 30-day grid */}
          <div
            className="absolute top-6 right-6 rounded-[20px] p-4 flex flex-col items-center gap-2.5"
            style={{ background: "var(--color-gold)", boxShadow: "0 4px 20px rgba(0,0,0,0.15)" }}
          >
            {/* 5 × 6 grid — one square per day, number centered */}
            <div className="relative grid gap-[4px]" style={{ gridTemplateColumns: "repeat(6, 11px)" }}>
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="w-[11px] h-[11px]"
                  style={{ background: "rgba(0,0,0,0.20)", borderRadius: "3px" }}
                />
              ))}
              {/* Number centered over the grid */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-[30px] font-black leading-none text-gray-900 tracking-tight"
                  style={{ textShadow: "0 0 12px var(--color-gold), 0 0 4px var(--color-gold)" }}>
                  30
                </span>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#111827]/60 leading-none">
              un día · un parche
            </span>
          </div>
        </motion.div>

        {/* Content — right */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <p
            className="text-[11px] font-bold uppercase tracking-[0.12em] mb-2.5"
            style={{ color: "var(--color-teal)" }}
          >
            {t("badge")}
          </p>
          <h2
            className="font-extrabold text-ocean leading-[1.15] tracking-[-0.02em]"
            style={{ fontSize: "clamp(26px,3vw,40px)" }}
          >
            {t("title")}
          </h2>

          <div className="mt-10 flex flex-col gap-7">
            {steps.map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="flex gap-5 items-start"
              >
                <div
                  className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-white font-extrabold text-[20px]"
                  style={{
                    background: "var(--color-ocean)",
                    boxShadow: "0 4px 14px rgba(0,80,136,0.3)",
                  }}
                >
                  {step.n}
                </div>
                <div>
                  <h3 className="text-[18px] font-bold text-navy mb-1">{step.title}</h3>
                  <p className="text-[14px] text-gray-500 leading-[1.6]">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
