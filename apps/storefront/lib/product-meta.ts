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
  ingredients: Array<{ name: string; benefit: string }>;   // ← Cambiado
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
    images: [
      "/products/Energy_thumb.webp",
      "/products/Energy_1.webp",
      "/products/Energy_2.webp",
      "/products/Energy_3.webp"
    ],
    ingredients: [
      { name: "Vitamina C", benefit: "Asociada con el apoyo a la reducción de fatiga y al bienestar energético." },
      { name: "L-Carnitina", benefit: "Asociada con el apoyo al transporte de grasa para convertirla en energía usable." },
      { name: "Extracto de Té Verde", benefit: "Asociado con el apoyo a la energía sostenida de forma progresiva." },
      { name: "Extracto de Ginseng", benefit: "Asociado con el apoyo al rendimiento físico y mental." },
      { name: "Vitamina B2 (Riboflavina)", benefit: "Asociada con el apoyo a la producción de energía a nivel celular." },
      { name: "Ácido Fólico", benefit: "Asociado con el apoyo a la formación de glóbulos rojos y oxigenación." },
      { name: "Vitamina E", benefit: "Asociada con la protección de las células contra el estrés oxidativo." }
    ],
    benefits: [
      "Apoya la energía constante durante el día",
      "Ayuda a mantener el foco y la concentración",
      "Reduce la sensación de fatiga mental",
      "Acompaña tu rendimiento sin nerviosismo ni bajones"
    ],
    
    howItWorks: "Novapatch Energy ayuda manteniendo niveles estables de energía sin los picos y caídas típicos de cafés o bebidas energéticas.",
    
    usage: [
  "Aplica 1 parche por la mañana en un área limpia y seca como el brazo, hombro o parte baja de la espalda. Presiona firmemente durante 10 segundos para asegurar una buena adherencia.",
  "Déjalo actuar entre 8 y 12 horas. Puedes realizar tus actividades normales mientras el parche libera los ingredientes de forma gradual.",
  "Retíralo antes de dormir y desecha el parche. Lava el área con agua y jabón. Usa un parche nuevo cada mañana."
],

    faqs: [
  { q: "¿Puedo usarlo todos los días?", a: "Sí. Energy está formulado para uso diario continuo. Miles de personas lo usan todos los días sin problema." },
  { q: "¿Reemplaza al café o energéticos?", a: "No lo reemplaza, lo acompaña. Muchas personas lo combinan porque les da energía sostenida sin nerviosismo ni bajones posteriores." },
  { q: "¿Se siente el efecto desde el primer día?", a: "Algunos notan más foco y vitalidad desde el primer uso, pero los mejores resultados se obtienen con el uso constante (2-3 semanas)." },
  { q: "¿Es seguro y natural?", a: "Sí. Utiliza ingredientes reconocidos, liberación controlada y está diseñado bajo altos estándares de calidad. No contiene estimulantes sintéticos." }
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
    images: [
      "/products/Sleep_thumb.webp",
      "/products/Sleep_1.webp",
      "/products/Sleep_2.webp",
      "/products/Sleep_3.webp"
    ],
    ingredients: [
      { name: "Triptófano", benefit: "Asociado con el apoyo a la producción natural de melatonina y serotonina." },
      { name: "Magnesio", benefit: "Asociado con la relajación muscular y el apoyo para bajar el ritmo." },
      { name: "Inositol", benefit: "Asociado con el apoyo al equilibrio emocional y la calidad del descanso." },
      { name: "Vitamina B6", benefit: "Asociada con el apoyo al metabolismo de neurotransmisores relacionados con el sueño." },
      { name: "Glicina", benefit: "Asociada con la mejora de la calidad del sueño y la sensación de descanso reparador." }
    ],
    benefits: [
      "Acompaña la relajación antes de dormir",
      "Apoya un sueño más profundo y reparador",
      "Ayuda a reducir la mente inquieta por la noche",
      "Favorece despertar con mayor sensación de descanso"
    ],
    howItWorks: "Los ingredientes actúan de forma natural apoyando los procesos de relajación del cuerpo, sin generar dependencia.",
    
    usage: [
  "Aplica 1 parche 1 hora antes de acostarte en el brazo, abdomen o parte superior de la espalda. Elige una zona cómoda donde no interfiera con tu sueño.",
  "Déjalo actuar durante toda la noche. El parche libera los ingredientes de forma controlada mientras descansas.",
  "Retíralo por la mañana y desecha. Lava suavemente el área. Úsalo todas las noches para obtener mejores resultados."
],
    faqs: [
  { q: "¿Es adictivo o genera dependencia?", a: "No. No contiene melatonina ni sustancias sedantes fuertes. Ayuda a relajar el cuerpo de forma natural sin crear hábito." },
  { q: "¿Puedo usarlo todas las noches?", a: "Sí, está pensado para uso nocturno regular. Muchas personas lo usan todas las noches como parte de su rutina de descanso." },
  { q: "¿Funciona desde la primera noche?", a: "Algunos notan mejor conciliación del sueño desde la primera vez, pero los resultados más profundos y reparadores aparecen con el uso constante." },
  { q: "¿Me va a dar sueño durante el día?", a: "No. Está formulado para actuar principalmente por la noche y no genera somnolencia diurna." }
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
    images: [
      "/products/Glow_thumb.webp",
      "/products/Glow_1.webp",
      "/products/Glow_2.webp",
      "/products/Glow_3.webp"
    ],
    ingredients: [
      { name: "Vitamina C", benefit: "Asociada con el apoyo a la producción de colágeno y luminosidad." },
      { name: "Ácido Hialurónico", benefit: "Asociado con la hidratación profunda desde adentro." },
      { name: "Colágeno Hidrolizado", benefit: "Asociado con el apoyo a la elasticidad y estructura de la piel." },
      { name: "Biotina", benefit: "Asociada con el apoyo al cabello, piel y uñas." },
      { name: "Vitamina B3 (Niacinamida)", benefit: "Asociada con el apoyo al equilibrio y textura de la piel." },
      { name: "Vitamina E", benefit: "Asociada con la protección antioxidante de las células de la piel." }
    ],
    benefits: [
      "Apoya la hidratación natural de la piel",
      "Contribuye a la elasticidad y luminosidad",
      "Acompaña el bienestar general de la piel",
      "Favorece una apariencia más radiante con el uso constante"
    ],
    howItWorks: "Los nutrientes se absorben a través de la piel y apoyan los procesos internos que se reflejan hacia afuera con el tiempo.",
    usage: [
  "Aplica 1 parche preferiblemente por la noche en una zona limpia como el brazo, abdomen o muslo. Presiona bien para asegurar adherencia.",
  "Déjalo actuar durante 8-12 horas (puedes dormir con él). El parche trabaja mientras tu cuerpo se regenera.",
  "Retíralo por la mañana, desecha y rota la zona de aplicación al día siguiente. La constancia es clave para ver resultados."
],
    faqs: [
  { q: "¿Cuándo se ven resultados visibles?", a: "Con uso diario constante, la mayoría nota mejoras en hidratación y luminosidad a partir de las 3-4 semanas. La constancia es clave." },
  { q: "¿Es solo para mujeres?", a: "No. Aunque se llama Glow, está pensado para cualquier persona que quiera cuidar la salud y apariencia de su piel desde adentro." },
  { q: "¿Puedo usarlo junto con cremas o sérums?", a: "Sí. Funciona de forma complementaria. Puedes seguir tu rutina habitual de skincare sin problema." },
  { q: "¿Es apto para piel sensible?", a: "Sí. Está formulado con ingredientes suaves. En caso de piel muy reactiva, te recomendamos consultar con tu dermatólogo." }
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
    images: [
      "/products/Shield_thumb.webp",
      "/products/Shield_1.webp",
      "/products/Shield_2.webp",
      "/products/Shield_3.webp"
    ],
    ingredients: [
      { name: "Vitamina C", benefit: "Asociada con el apoyo al bienestar general y las defensas naturales." },
      { name: "Zinc", benefit: "Asociado con el apoyo al sistema inmune y la recuperación." },
      { name: "Vitamina D3", benefit: "Asociada con el apoyo al funcionamiento normal del sistema inmune." },
      { name: "Vitamina E", benefit: "Asociada con la protección antioxidante de las células." },
      { name: "Niacinamida (Vitamina B3)", benefit: "Asociada con el apoyo al bienestar de la piel y el metabolismo energético." }
    ],
    benefits: [
      "Apoya las defensas naturales del cuerpo",
      "Contribuye al funcionamiento normal del sistema inmune",
      "Acompaña tu bienestar diario",
      "Ayuda en la protección contra el estrés oxidativo"
    ],
    howItWorks: "Proporciona nutrientes clave de forma sostenida que ayudan al organismo a mantenerse fuerte día a día.",
    usage: [
  "Aplica 1 parche cualquier momento del día en un área limpia (brazo, hombro o abdomen). Es ideal usarlo por la mañana.",
  "Déjalo actuar entre 8 y 12 horas. Puedes llevarlo durante tus actividades habituales sin problema.",
  "Retíralo al final del día y desecha. Úsalo diariamente para mantener un apoyo constante a tus defensas."
],
    faqs: [
  { q: "¿Reemplaza las vacunas o medicamentos?", a: "No. Es un complemento alimenticio, no sustituye vacunas ni tratamientos médicos. Es un apoyo preventivo diario." },
  { q: "¿Puedo usarlo todo el año?", a: "Sí. Es ideal para uso continuo, especialmente en épocas de cambio de estación o mayor exposición a virus." },
  { q: "¿Cómo ayuda exactamente al sistema inmune?", a: "Proporciona nutrientes clave (Vitamina C, D3, Zinc) de forma sostenida que apoyan el funcionamiento normal de las defensas naturales." },
  { q: "¿Es seguro para toda la familia?", a: "Sí, adultos y adolescentes pueden usarlo. Para niños pequeños consulta con un pediatra." }
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
    images: [
      "/products/Zen_thumb.webp",
      "/products/Zen_1.webp",
      "/products/Zen_2.webp",
      "/products/Zen_3.webp"
    ],
    ingredients: [
      { name: "Triptófano", benefit: "Asociado con el apoyo a la producción de serotonina y equilibrio emocional." },
      { name: "Magnesio", benefit: "Asociado con la relajación muscular y mental." },
      { name: "Taurina", benefit: "Asociada con el apoyo al equilibrio nervioso y la calma funcional." },
      { name: "Extracto de Manzanilla", benefit: "Asociado con el apoyo a la relajación natural." },
      { name: "Vitamina B6", benefit: "Asociada con el apoyo al equilibrio emocional y el sistema nervioso." }
    ],
    benefits: [
      "Acompaña la calma mental",
      "Ayuda a reducir la tensión acumulada",
      "Favorece un estado de equilibrio",
      "Apoya el manejo de días de alta demanda"
    ],
    howItWorks: "Apoya la regulación natural del estrés sin adormecer ni desconectar.",
    usage: [
  "Aplica 1 parche cuando sientas que el día está muy cargado (mañana o tarde) en el brazo, nuca o hombro.",
  "Déjalo actuar entre 6 y 10 horas. Puedes seguir trabajando o realizando tus actividades normalmente.",
  "Retíralo una vez que sientas que ya no lo necesitas y desecha. Úsalo según lo requiera tu día."
],
    faqs: [
  { q: "¿Me va a dar sueño o me va a adormecer?", a: "No. Zen está diseñado para dar calma funcional sin sedación ni somnolencia. Puedes usarlo durante el día." },
  { q: "¿Se puede usar antes de reuniones o eventos importantes?", a: "Sí. Muchas personas lo usan en días de alta demanda para mantener la calma y claridad mental." },
  { q: "¿Funciona desde la primera vez?", a: "Sí, muchos notan una sensación de mayor calma en las primeras horas. Los efectos se refuerzan con el uso regular." },
  { q: "¿Puedo combinarlo con meditación o terapia?", a: "Absolutamente. Es un excelente complemento para cualquier práctica de manejo de estrés." }
],
    tags: ["Calma funcional", "Días intensos"],
  },

  woman: {
    slug: "woman",
    name: "Woman",
    description: "Pensado para el cuerpo femenino y sus ritmos. Woman acompaña el equilibrio natural mes a mes.",
    tagline: "Bienestar hormonal mes a mes",
    quote: '"Escucharte también es una forma de cuidarte."',
    color: "#8A3EBE",
    bg: "#F3EBF9",
    taglineColor: "#6B3080",
    imgSrc: "/products/Woman_thumb.webp",
    images: [
      "/products/Woman_thumb.webp",
      "/products/Woman_1.webp",
      "/products/Woman_2.webp",
      "/products/Woman_3.webp"
    ],
    ingredients: [
      { name: "Extracto de Soya", benefit: "Asociado con el apoyo al equilibrio hormonal natural." },
      { name: "Vitamina B6", benefit: "Asociada con el apoyo al equilibrio hormonal y emocional." },
      { name: "Magnesio", benefit: "Asociado con la relajación muscular y el bienestar físico." },
      { name: "Ácido Fólico", benefit: "Asociado con el apoyo a la formación de glóbulos rojos y bienestar general." },
      { name: "Hierro", benefit: "Asociado con el apoyo al transporte de oxígeno y reducción de cansancio." }
    ],
    benefits: [
      "Acompaña el equilibrio hormonal natural",
      "Ayuda con el bienestar durante el ciclo",
      "Apoya los niveles de energía y ánimo",
      "Contribuye al confort físico y emocional"
    ],
    howItWorks: "Proporciona nutrientes clave que apoyan los cambios naturales del cuerpo femenino.",
    usage: [
  "Aplica 1 parche diario en un área limpia como el brazo, abdomen o muslo. Puedes usarlo en cualquier momento del día.",
  "Déjalo actuar entre 8 y 12 horas. El parche libera los nutrientes de forma sostenida.",
  "Retíralo al final del día, desecha y rota la zona de aplicación. Úsalo todos los días para mejores resultados."
],
    faqs: [
  { q: "¿Es solo para mujeres?", a: "Sí. Está formulado específicamente pensando en los ritmos y necesidades hormonales del cuerpo femenino." },
  { q: "¿Puedo usarlo con anticonceptivos o medicación hormonal?", a: "Sí en la mayoría de los casos, pero siempre es recomendable consultar con tu médico." },
  { q: "¿Ayuda con los síntomas del ciclo menstrual?", a: "Muchas usuarias reportan mejor confort físico y emocional durante el ciclo, especialmente en la segunda mitad." },
  { q: "¿Es seguro usarlo de forma continua?", a: "Sí. Está diseñado para uso diario continuo y acompaña los cambios naturales mes a mes." }
],
    tags: ["Bienestar femenino", "Ritmos naturales"],
  },
};

// Orden de aparición
export const PRODUCT_ORDER = ["energy", "sleep", "glow", "shield", "zen", "woman"];

export function getOrderedMeta(): ProductMeta[] {
  return PRODUCT_ORDER.map((slug) => PRODUCT_META[slug]).filter(Boolean);
}