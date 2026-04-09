"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslations } from "next-intl";

const rows = [
  { feature: "Alta tasa de absorción", nova: true, caps: false, gummies: false },
  { feature: "Sin pastillas difíciles de tragar", nova: true, caps: false, gummies: true },
  { feature: "Sin azúcar ni calorías", nova: true, caps: true, gummies: false },
  { feature: "Sin colorantes ni rellenos artificiales", nova: true, caps: false, gummies: false },
  { feature: "No afecta tu sistema digestivo", nova: true, caps: false, gummies: false },
];

function Check({ ok }: { ok: boolean }) {
  return ok ? (
    <span className="text-[#10B981] text-[20px] font-bold">✓</span>
  ) : (
    <span className="text-[#EF4444] text-[20px]">✕</span>
  );
}

export default function ComparisonTable() {
  const t = useTranslations("home.comparison");
  return (
    <section className="bg-gray-50 py-[72px] px-5 md:px-12">
      <div className="max-w-[1100px] mx-auto">
        {/* Header text */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2
            className="font-extrabold text-ocean leading-[1.15] tracking-[-0.02em]"
            style={{ fontSize: "clamp(26px,3vw,40px)" }}
          >
            {t("title")}
          </h2>
        </motion.div>

        {/* Two-column layout: table left, image right */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mt-14 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-14 items-start"
        >
          {/* Table */}
          <div style={{ overflowX: "auto" }}>
          <div style={{ minWidth: "480px" }} className="rounded-[20px] overflow-hidden shadow-[0_4px_16px_rgba(0,0,0,0.10)] bg-white">
            {/* Header */}
            <div className="grid border-b-2 border-gray-200" style={{ gridTemplateColumns: "1.6fr 1fr 1fr 1fr", minHeight: "100px" }}>
              <div className="p-4 text-[14px] font-bold text-gray-500 flex items-center">Características</div>
              {/* NovaPatch */}
              <div
                className="p-4 flex flex-col items-center justify-center gap-2 text-white"
                style={{ background: "var(--color-ocean)" }}
              >
                <Image
                  src="/logos/logowht.webp"
                  alt="Novapatch"
                  width={120}
                  height={30}
                  className="h-7 w-auto object-contain brightness-0 invert"
                />
                <span className="text-[11px] opacity-85">{t("colNovapatch")}</span>
              </div>
              {/* Capsules */}
              <div className="p-4 flex flex-col items-center justify-center gap-2">
                <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    fill="#9CA3AF"
                    d="M44.59 3.38c4.29 4.39 4.36 11.36 0.2 15.86L20 44.05C8.85 53.7-5.92 38.94 3.73 27.78L28.52 2.98C33.15-1.27 40.2-1.11 44.59 3.38zm-1.34 14.14c7.24-8.62-3.65-20.09-12.64-13.32L18.58 16.15l13.03 13.03zm-25.79 25.63c.33-.23.62-.52.94-.75L29.92 31l-13.03-13.03-11.52 11.52c-7.38 8.05 3.06 20.17 12.09 13.79z"
                  />
                </svg>
                <span className="text-[12px] text-gray-500 font-bold text-center">{t("colTraditional")}</span>
              </div>
              {/* Gummies */}
              <div className="p-4 flex flex-col items-center justify-center gap-2">
                <Image
                  src="/comparison/bear.svg"
                  alt="Gomitas"
                  width={32}
                  height={32}
                  className="h-8 w-auto opacity-60"
                />
                <span className="text-[12px] text-gray-500 font-bold text-center">Gomitas comunes</span>
              </div>
            </div>

            {/* Rows */}
            {rows.map((row, i) => (
              <div
                key={row.feature}
                className="grid border-b border-gray-100 last:border-b-0"
                style={{
                  gridTemplateColumns: "1.6fr 1fr 1fr 1fr",
                  background: i % 2 === 1 ? "#F9FAFB" : "white",
                }}
              >
                <div
                  className="px-4 py-3.5 text-[14px] font-medium text-gray-900 flex items-center"
                >
                  {row.feature}
                </div>
                <div
                  className="px-4 py-3.5 flex items-center justify-center"
                  style={{ background: i % 2 === 1 ? "#E8F3FA" : "#EEF5FB" }}
                >
                  <Check ok={row.nova} />
                </div>
                <div className="px-4 py-3.5 flex items-center justify-center">
                  <Check ok={row.caps} />
                </div>
                <div className="px-4 py-3.5 flex items-center justify-center">
                  <Check ok={row.gummies} />
                </div>
              </div>
            ))}
          </div>
          </div>

          {/* Image + bubble */}
          <div className="relative">
            <div className="rounded-[32px] overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.14)]">
              <div className="relative w-full" style={{ height: "380px" }}>
                <Image
                  src="/productusers/armpatch.webp"
                  alt="Novapatch en uso"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
              </div>
            </div>
            {/* Bubble */}
            <div
              className="absolute -bottom-5 -left-5 bg-white rounded-[20px] px-5 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.14)]"
            >
              <strong className="block text-[16px] font-extrabold text-ocean">
                Un parche, todo el día.
              </strong>
              <span className="text-[12px] text-gray-500">Sin agua. Sin horarios. Sin pastillas.</span>
            </div>
          </div>
        </motion.div>

        {/* Closing text */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-center mt-12 text-[15px] text-gray-500 leading-[1.7]"
        >
          <em>Lo simple se repite. Lo complejo se abandona.</em>
          <br />
          <strong className="text-gray-900">
            Novapatch está diseñado para ser el hábito que sí se sostiene.
          </strong>
        </motion.p>
      </div>
    </section>
  );
}
