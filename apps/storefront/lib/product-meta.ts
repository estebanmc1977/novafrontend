/**
 * product-meta.ts — Fuente única de verdad para toda la metadata de producto.
 * Importado por ProductGrid (home) y TiendaExperience (tienda).
 */

export type ProductMeta = {
  slug: string;
  name: string;
  description: string;
  tagline: string;
  quote: string;
  color: string;
  bg: string;
  taglineColor: string;
  imgSrc: string;
  images?: string[];
  ingredients: string[];
  benefits: string[];
  howItWorks: string;
  usage: string[];
  faqs: Array<{ q: string; a: string }>;
  tags: string[];
  popular?: boolean;
};

export const PRODUCT_META: Record<string, ProductMeta> = {
  energy: {
    slug: "energy",
    name: "Energy",
    description: "Energía que acompaña tu día sin picos ni caídas. Un solo parche en la mañana para sostener el foco y el rendimiento durante horas.",
    tagline: "Energía sostenida sin sobresaltos",
    quote: '"Tu día no para. Tu energía tampoco."',
    color: "#2B7CC1",
    bg: "#EBF4FB",
    taglineColor: "#1A5C9A",
    imgSrc: "/products/Energy_thumb.webp",
    // ←←← NUEVO: Agregamos varias fotos
    images: [
      "/products/Energy_thumb.webp",
      "/products/Energy_1.webp",      // podes agregar más después
      "/products/Energy_2.webp",
      "/products/Energy_3.webp"
    ],
    ingredients: [
      "Vitamin C (Ascorbyl Palmitate)",
      "L-Carnitine",
      "Green Tea Extract (20% Caffeine)",
      "Ginseng Extract",
      "Vitamin B2 (Riboflavin)",
      "Folic Acid (L-Methylfolate)",
      "Vitamin E",
    ],
    benefits: [
      "Apoya la energía constante durante el día",
      "Ayuda a mantener el foco y la concentración",
      "Reduce la sensación de fatiga mental",
      "Acompaña tu rendimiento sin nerviosismo"
    ],
    howItWorks: "Los ingredientes se liberan de forma gradual a través de la piel, manteniendo niveles estables sin los picos y caídas típicos de cafés o bebidas energéticas.",
    usage: [
      "Aplica 1 parche por la mañana en un área limpia (brazo, hombro o espalda alta).",
      "Déjalo actuar entre 8 y 12 horas.",
      "Retíralo antes de dormir."
    ],
    faqs: [
      { q: "¿Puedo usarlo todos los días?", a: "Sí, está diseñado para uso diario." },
      { q: "¿Reemplaza al café?", a: "Acompaña tu rutina. Muchas personas lo combinan." },
      { q: "¿Se siente inmediato el efecto?", a: "Los efectos se sienten de forma progresiva con el uso constante." }
    ],
    tags: ["Energía sostenida", "Sin picos ni caídas"],
  },

  sleep: {
    slug: "sleep",
    name: "Sleep",
    description: "El descanso empieza antes de acostarse. Sleep acompaña la transición al sueño para que despiertes sintiéndote más descansado.",
    tagline: "Descanso nocturno más reparador",
    quote: '"Porque descansar también es cuidarse."',
    color: "#138A75",
    bg: "#EBF7F5",
    taglineColor: "#0F6B5C",
    imgSrc: "/products/Sleep_thumb.webp",
     // ←←← NUEVO: Agregamos varias fotos
    images: [
      "/products/Sleep_thumb.webp",
      "/products/Sleep_1.webp",      // podes agregar más después
      "/products/Sleep_2.webp",
      "/products/Sleep_3.webp"
    ],
    ingredients: [
      "Tryptophan",
      "Magnesium (Bisglycinate)",
      "Inositol",
      "Vitamin B6",
      "Glycine",
    ],
    benefits: [
      "Acompaña la relajación antes de dormir",
      "Apoya un sueño más profundo y reparador",
      "Ayuda a reducir la mente inquieta por la noche"
    ],
    howItWorks: "Los ingredientes actúan de forma natural apoyando los procesos de relajación del cuerpo, sin generar dependencia.",
    usage: [
      "Aplica 1 parche 1 hora antes de dormir en el brazo o abdomen.",
      "Déjalo toda la noche.",
      "Retíralo por la mañana."
    ],
    faqs: [
      { q: "¿Es adictivo?", a: "No contiene sustancias que generen dependencia." },
      { q: "¿Puedo usarlo todas las noches?", a: "Sí, está pensado para uso regular." },
      { q: "¿Funciona desde la primera vez?", a: "Muchos notan mejoría desde las primeras noches, pero es más notorio con constancia." }
    ],
    tags: ["Descanso nocturno", "Sin somníferos"],
  },

  glow: {
    slug: "glow",
    name: "Glow",
    description: "La piel refleja cómo te cuidas desde adentro. Glow acompaña el bienestar de la piel de forma diaria y constante.",
    tagline: "Piel radiante desde adentro",
    quote: '"La piel también refleja cómo te cuidas."',
    color: "#C94030",
    bg: "#FAF0EE",
    taglineColor: "#B83525",
    imgSrc: "/products/Glow_thumb.webp",
    // ←←← NUEVO: Agregamos varias fotos
    images: [
      "/products/Glow_thumb.webp",
      "/products/Glow_1.webp",      // podes agregar más después
      "/products/Glow_2.webp",
      "/products/Glow_3.webp"
    ],
    ingredients: [
      "Vitamin C (Magnesium Ascorbyl Phosphate)",
      "Hyaluronic Acid",
      "Hydrolyzed Collagen",
      "Biotin",
      "Niacinamide (Vitamin B3)",
      "Centella Asiatica Extract",
      "Vitamin E",
    ],
    benefits: [
      "Apoya la hidratación natural de la piel",
      "Contribuye a la elasticidad y luminosidad",
      "Acompaña el bienestar general de la piel"
    ],
    howItWorks: "Los nutrientes se absorben a través de la piel y apoyan los procesos internos que se reflejan hacia afuera con el tiempo.",
    usage: [
      "Aplica 1 parche diario (preferiblemente por la noche).",
      "Rota el lugar de aplicación.",
      "Sé constante para ver resultados."
    ],
    faqs: [
      { q: "¿Cuándo se ven resultados?", a: "Con uso constante, muchos notan cambios a partir de las 3-4 semanas." },
      { q: "¿Es solo para mujeres?", a: "No, está pensado para cualquier persona que quiera cuidar su piel." }
    ],
    tags: ["Bienestar desde adentro", "Constancia"],
    popular: true,
  },

  shield: {
    slug: "shield",
    name: "Shield",
    description: "El cuidado que funciona es el de todos los días. Shield se integra a tu rutina como prevención diaria.",
    tagline: "Cuidado preventivo diario",
    quote: '"Tu rutina de cuidado empieza hoy, no cuando algo pasa."',
    color: "#A07000",
    bg: "#FAF6E9",
    taglineColor: "#8C6000",
    imgSrc: "/products/Shield_thumb.webp",
    // ←←← NUEVO: Agregamos varias fotos
    images: [
      "/products/Shield_thumb.webp",
      "/products/Shield_1.webp",      // podes agregar más después
      "/products/Shield_2.webp",
      "/products/Shield_3.webp"
    ],
    ingredients: [
      "Vitamin C (Ascorbyl Palmitate)",
      "Zinc (Picolinate)",
      "Vitamin D3",
      "Vitamin E",
      "Niacinamide",
    ],
    benefits: [
      "Apoya las defensas naturales del cuerpo",
      "Contribuye al funcionamiento normal del sistema inmune",
      "Acompaña tu bienestar diario"
    ],
    howItWorks: "Proporciona nutrientes clave de forma sostenida que ayudan al organismo a mantenerse fuerte día a día.",
    usage: [
      "Aplica 1 parche diario en cualquier momento.",
      "Ideal para usarlo por la mañana.",
      "Uso continuo recomendado."
    ],
    faqs: [
      { q: "¿Reemplaza las vacunas?", a: "No. Es un complemento, no sustituye medidas médicas." },
      { q: "¿Puedo usarlo todo el año?", a: "Sí, especialmente en épocas de cambio de estación." }
    ],
    tags: ["Cuidado preventivo", "Uso diario"],
  },

  zen: {
    slug: "zen",
    name: "Zen",
    description: "Para los días donde todo pide atención al mismo tiempo. Zen acompaña estados de calma funcional.",
    tagline: "Calma funcional en días intensos",
    quote: '"El equilibrio que no se ve, pero se siente."',
    color: "#3A6FA8",
    bg: "#EBF0F9",
    taglineColor: "#2A5490",
    imgSrc: "/products/Zen_thumb.webp",
    // ←←← NUEVO: Agregamos varias fotos
    images: [
      "/products/Zen_thumb.webp",
      "/products/Zen_1.webp",      // podes agregar más después
      "/products/Zen_2.webp",
      "/products/Zen_3.webp"
    ],
    ingredients: [
      "Tryptophan",
      "Magnesium (Taurate)",
      "Taurine",
      "Chamomile Extract",
      "Vitamin B6",
    ],
    benefits: [
      "Acompaña la calma mental",
      "Ayuda a reducir la tensión acumulada",
      "Favorece un estado de equilibrio"
    ],
    howItWorks: "Apoya la regulación natural del estrés sin adormecer ni desconectar.",
    usage: [
      "Aplica 1 parche cuando sientas que el día está muy cargado.",
      "Puedes usarlo durante el día o por la tarde."
    ],
    faqs: [
      { q: "¿Me va a dar sueño?", a: "No. Está formulado para calma sin sedación." },
      { q: "¿Se puede usar antes de una reunión importante?", a: "Sí, muchos lo usan en momentos de alta demanda." }
    ],
    tags: ["Calma funcional", "Días intensos"],
  },

  woman: {
    slug: "woman",
    name: "Woman",
    description: "Pensado para el cuerpo femenino y sus ritmos. Woman acompaña el equilibrio natural mes a mes.",
    tagline: "Bienestar femenino mes a mes",
    quote: '"Escucharte también es una forma de cuidarte."',
    color: "#8A3EBE",
    bg: "#F3EBF9",
    taglineColor: "#6B3080",
    imgSrc: "/products/Woman_thumb.webp",
    // ←←← NUEVO: Agregamos varias fotos
    images: [
      "/products/Woman_thumb.webp",
      "/products/Woman_1.webp",      // podes agregar más después
      "/products/Woman_2.webp",
      "/products/Woman_3.webp"
    ],
    ingredients: [
      "Soy Extract",
      "Vitamin B6",
      "Magnesium (Bisglycinate)",
      "Folic Acid (L-Methylfolate)",
      "Iron (Bisglycinate)",
    ],
    benefits: [
      "Acompaña el equilibrio hormonal natural",
      "Ayuda con el bienestar durante el ciclo",
      "Apoya los niveles de energía y ánimo"
    ],
    howItWorks: "Proporciona nutrientes clave que apoyan los cambios naturales del cuerpo femenino.",
    usage: [
      "Aplica 1 parche diario.",
      "Puedes usarlo de forma continua o enfocarte en la segunda mitad del ciclo."
    ],
    faqs: [
      { q: "¿Es solo para mujeres?", a: "Sí, está formulado específicamente pensando en el cuerpo femenino." },
      { q: "¿Puedo usarlo con anticonceptivos?", a: "Consulta siempre con tu médico." }
    ],
    tags: ["Bienestar femenino", "Ritmos naturales"],
  },
};

// Orden de aparición
export const PRODUCT_ORDER = ["energy", "sleep", "glow", "shield", "zen", "woman"];

export function getOrderedMeta(): ProductMeta[] {
  return PRODUCT_ORDER.map((slug) => PRODUCT_META[slug]).filter(Boolean);
}
