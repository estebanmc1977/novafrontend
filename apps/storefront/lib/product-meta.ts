// lib/product-meta.ts
export type ProductMeta = {
  slug: string;
  name: string;
  description: string;
  longDescription: string;        // ← Nuevo: texto más largo para hero
  tagline: string;
  quote: string;
  color: string;
  bg: string;
  taglineColor: string;
  imgSrc: string;
  ingredients: string[];
  benefits: Array<{ title: string; description: string }>;
  howItWorks: string;
  usage: string[];
  faqs: Array<{ question: string; answer: string }>;
  tags: string[];
  popular?: boolean;
};

export const PRODUCT_META: Record<string, ProductMeta> = {
  energy: {
    slug: "energy",
    name: "Energy",
    description: "Energía que acompaña tu día sin picos ni caídas.",
    longDescription: "Un parche que te ayuda a mantener el foco y el rendimiento durante más horas, de forma más natural.",
    tagline: "Energía sostenida durante tu día",
    quote: '"Tu día no para. Tu energía tampoco."',
    color: "#2B7CC1",
    bg: "#EBF4FB",
    taglineColor: "#1A5C9A",
    imgSrc: "/products/Energy_thumb.webp",
    ingredients: ["Vitamin C", "L-Carnitine", "Green Tea Extract", "Ginseng Extract", "Vitamin B2", "Folic Acid", "Vitamin E"],
    benefits: [
      { title: "Energía estable", description: "Te acompaña sin sentir esos subidones y bajones típicos del café." },
      { title: "Mejor foco", description: "Ayuda a mantener la concentración por más tiempo." },
      { title: "Sin nerviosismo", description: "Fórmula pensada para darte energía sin ponerte ansioso." },
    ],
    howItWorks: "Los ingredientes se liberan de forma gradual a través de la piel durante varias horas.",
    usage: [
      "Pega un parche en la mañana en el brazo o abdomen.",
      "Déjalo actuar entre 8 y 12 horas.",
      "Retíralo al final del día."
    ],
    faqs: [
      { question: "¿Puedo usarlo todos los días?", answer: "Sí, está pensado para uso diario." },
      { question: "¿Reemplaza al café?", answer: "No lo reemplaza, pero puede ayudarte a necesitar menos." },
    ],
    tags: ["Energía sostenida", "Sin picos ni caídas"],
  },

  // ... (Voy a darte solo Energy completo ahora, luego completamos los demás)

  sleep: {
    slug: "sleep",
    name: "Sleep",
    description: "El descanso empieza antes de acostarse.",
    longDescription: "Te ayuda a bajar el ritmo para que llegues a la cama más relajado y descanses mejor.",
    tagline: "Sueño más profundo y reparador",
    quote: '"Porque descansar también es cuidarse."',
    color: "#138A75",
    bg: "#EBF7F5",
    taglineColor: "#0F6B5C",
    imgSrc: "/products/Sleep_thumb.webp",
    ingredients: ["Tryptophan", "Magnesium", "Inositol", "Vitamin B6", "Glycine"],
    benefits: [
      { title: "Relajación natural", description: "Ayuda a calmar la mente antes de dormir." },
      { title: "Mejor calidad de sueño", description: "Para que despiertes más descansado." },
    ],
    howItWorks: "Los ingredientes actúan de forma suave para acompañar tu ciclo natural de sueño.",
    usage: ["Aplica el parche 1 hora antes de dormir.", "Úsalo en el brazo o abdomen.", "Retíralo por la mañana."],
    faqs: [
      { question: "¿Es adictivo?", answer: "No, no contiene somníferos ni sustancias adictivas." },
    ],
    tags: ["Descanso nocturno", "Sin somníferos"],
  }
  // Agregaremos Glow, Shield, Zen y Woman después si quieres
};

export const PRODUCT_ORDER = ["energy", "sleep", "glow", "shield", "zen", "woman"];

export function getOrderedMeta(): ProductMeta[] {
  return PRODUCT_ORDER.map((slug) => PRODUCT_META[slug]).filter(Boolean);
}

export function getProductBySlug(slug: string): ProductMeta | undefined {
  return PRODUCT_META[slug];
}
