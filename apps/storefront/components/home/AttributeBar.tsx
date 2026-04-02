"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const attrs = [
  { icon: "/features/not_sugar-cropped.svg", label: "Sin azúcar" },
  { icon: "/features/vegan-cropped.svg", label: "100% Vegano" },
  { icon: "/features/gluten_free-cropped.svg", label: "Libre de gluten" },
  { icon: "/features/water_proo-cropped.svg", label: "Resistente al agua" },
  { icon: "/features/not_latex-cropped.svg", label: "Sin látex" },
];

interface AttributeBarProps {
  current: number;
  accent: string;
}

export default function AttributeBar({ accent }: AttributeBarProps) {
  return (
    <motion.section
      animate={{ backgroundColor: accent }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="w-full"
    >
      <div className="max-w-[1280px] mx-auto px-8 lg:px-12 py-8 flex items-center gap-6 lg:gap-8">
        {/* Brand icon — far left */}
        <div className="flex-shrink-0 hidden lg:block">
          <Image
            src="/logos/iconwht.webp"
            alt="Novapatch"
            width={56}
            height={56}
            className="h-14 w-auto object-contain opacity-90"
          />
        </div>

        {/* Divider */}
        <div className="hidden lg:block h-12 w-px bg-white/30 flex-shrink-0" />

        {/* Attributes */}
        <div className="flex-1 flex items-start justify-around gap-4 flex-wrap sm:flex-nowrap">
          {attrs.map((a, i) => (
            <motion.div
              key={a.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.45 }}
              className="flex flex-col items-center gap-2.5 min-w-[64px] flex-1"
            >
              {/* Circular outline */}
              <div
                className="w-[60px] h-[60px] rounded-full flex items-center justify-center flex-shrink-0"
                style={{ border: "2px solid rgba(255,255,255,0.6)" }}
              >
                <Image
                  src={a.icon}
                  alt={a.label}
                  width={32}
                  height={32}
                  className="object-contain brightness-0 invert"
                />
              </div>
              <span className="text-white text-[11px] font-semibold text-center leading-tight max-w-[72px]">
                {a.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}
