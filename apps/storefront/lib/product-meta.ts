/**
 * product-meta.ts — Fuente única de verdad para toda la metadata de producto.
 * Importado por ProductGrid (home) y TiendaExperience (tienda).
 */

export type ProductMeta = {
  slug: string;
  name: string;
  description: string;
  ingredients: string[];
  imgSrc: string;
  color: string;
  bg: string;
  taglineColor: string;
  quote: string;
  tags: string[];
  popular?: boolean;
};

export const PRODUCT_META: Record<string, ProductMeta> = {
  energy: {
    slug: "energy",
    name: "Energy",
    description:
      "Energía que acompaña tu día sin picos ni caídas. Un solo parche en la mañana para sostener el foco y el rendimiento durante horas — sin café extra, sin cápsulas, sin complicaciones.",
    ingredients: [
      "Vitamin C (Ascorbyl Palmitate)",
      "L-Carnitine",
      "Green Tea Extract (20% Caffeine)",
      "Ginseng Extract",
      "Vitamin B2 (Riboflavin)",
      "Folic Acid (L-Methylfolate)",
      "Vitamin E",
    ],
    imgSrc: "/products/Energy_thumb.webp",
    color: "#2B7CC1",
    bg: "#EBF4FB",
    taglineColor: "#1A5C9A",
    quote: '"Tu día no para. Tu energía tampoco."',
    tags: ["Energía sostenida", "Sin picos ni caídas"],
  },
  glow: {
    slug: "glow",
    name: "Glow",
    description:
      "La piel refleja cómo te cuidas, no solo lo que te pones encima. Glow trabaja desde adentro, día a día, para acompañar el bienestar que con el tiempo se nota hacia afuera.",
    ingredients: [
      "Vitamin C (Magnesium Ascorbyl Phosphate)",
      "Hyaluronic Acid",
      "Hydrolyzed Collagen",
      "Biotin",
      "Niacinamide (Vitamin B3)",
      "Centella Asiatica Extract",
      "Vitamin E",
    ],
    imgSrc: "/products/Glow_thumb.webp",
    color: "#C94030",
    bg: "#FAF0EE",
    taglineColor: "#B83525",
    quote: '"La piel también refleja cómo te cuidas."',
    tags: ["Bienestar desde adentro", "Constancia"],
    popular: true,
  },
  sleep: {
    slug: "sleep",
    name: "Sleep",
    description:
      "El descanso empieza antes de acostarse. Sleep acompaña la transición al sueño para que llegues a la cama con el ritmo bajado y despiertes sintiéndote descansado de verdad.",
    ingredients: [
      "Tryptophan",
      "Magnesium (Bisglycinate)",
      "Inositol",
      "Vitamin B6",
      "Glycine",
    ],
    imgSrc: "/products/Sleep_thumb.webp",
    color: "#138A75",
    bg: "#EBF7F5",
    taglineColor: "#0F6B5C",
    quote: '"Porque descansar también es cuidarse."',
    tags: ["Descanso nocturno", "Sin somníferos"],
  },
  zen: {
    slug: "zen",
    name: "Zen",
    description:
      "Para los días en que todo pide atención al mismo tiempo. Zen acompaña estados de calma funcional — sin apagarte, sin desconectarte — para que sigas presente sin la tensión encima.",
    ingredients: [
      "Tryptophan",
      "Magnesium (Taurate)",
      "Taurine",
      "Chamomile Extract",
      "Vitamin B6",
    ],
    imgSrc: "/products/Zen_thumb.webp",
    color: "#3A6FA8",
    bg: "#EBF0F9",
    taglineColor: "#2A5490",
    quote: '"El equilibrio que no se ve, pero se siente."',
    tags: ["Calma funcional", "Días intensos"],
  },
  shield: {
    slug: "shield",
    name: "Shield",
    description:
      "El cuidado que funciona es el de todos los días, no el de emergencia. Shield se integra a tu rutina diaria como un gesto simple de prevención — constante, sin fricción, sin excusas.",
    ingredients: [
      "Vitamin C (Ascorbyl Palmitate)",
      "Zinc (Picolinate)",
      "Vitamin D3",
      "Vitamin E",
      "Niacinamide",
    ],
    imgSrc: "/products/Shield_thumb.webp",
    color: "#A07000",
    bg: "#FAF6E9",
    taglineColor: "#8C6000",
    quote: '"Tu rutina de cuidado empieza hoy, no cuando algo pasa."',
    tags: ["Cuidado preventivo", "Uso diario"],
  },
  woman: {
    slug: "woman",
    name: "Woman",
    description:
      "Pensado para el cuerpo femenino real, que no es igual todos los días. Woman acompaña el equilibrio natural sin medicalizar, sin forzar — con un gesto simple que se sostiene en el tiempo.",
    ingredients: [
      "Soy Extract",
      "Vitamin B6",
      "Magnesium (Bisglycinate)",
      "Folic Acid (L-Methylfolate)",
      "Iron (Bisglycinate)",
    ],
    imgSrc: "/products/Woman_thumb.webp",
    color: "#8A3EBE",
    bg: "#F3EBF9",
    taglineColor: "#6B3080",
    quote: '"Escucharte también es una forma de cuidarte."',
    tags: ["Bienestar femenino", "Ritmos naturales"],
  },
};

// Orden de aparición en grillas
export const PRODUCT_ORDER = ["energy", "sleep", "glow", "shield", "zen", "woman"];

export function getOrderedMeta(): ProductMeta[] {
  return PRODUCT_ORDER.map((slug) => PRODUCT_META[slug]).filter(Boolean);
}
