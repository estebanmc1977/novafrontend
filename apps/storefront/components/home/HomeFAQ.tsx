"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const faqs = [
  {
    q: "¿Cómo funcionan los parches Novapatch?",
    a: "Los parches Novapatch liberan sus ingredientes activos directamente a través de la piel hacia el torrente sanguíneo. A diferencia de las cápsulas orales, la absorción es gradual y constante durante 10 a 12 horas, evitando los picos y caídas de concentración.",
  },
  {
    q: "¿Cuánto tiempo tarda en hacer efecto?",
    a: "La absorción comienza en los primeros 30–60 minutos tras la aplicación. Para resultados óptimos recomendamos el uso constante durante al menos 2–3 semanas. Algunos usuarios reportan mejoras notables desde el primer día.",
  },
  {
    q: "¿Puedo usar más de un parche a la vez?",
    a: "Sí, puedes usar más de un parche simultáneamente siempre que sean de fórmulas diferentes. Los ingredientes de cada parche son complementarios y han sido formulados para usarse de forma segura en combinación. Consulta con tu médico si tienes condiciones específicas.",
  },
  {
    q: "¿Cómo funciona la suscripción?",
    a: "Elige la frecuencia (30, 60 o 90 días) y recibe tu caja automáticamente con hasta un 20% de descuento. Puedes pausar, cambiar de plan o cancelar en cualquier momento desde tu cuenta, sin penalizaciones ni contratos.",
  },
  {
    q: "¿Qué pasa si no estoy satisfecho con mi compra?",
    a: "Ofrecemos una garantía de satisfacción de 30 días. Si no estás conforme, completá el formulario de reembolso en novapatch.care/reembolso — es rápido y nuestro equipo revisará tu caso en 2 a 5 días hábiles. Te devolvemos el 100% del valor del primer pedido, sin complicaciones.",
  },
];

function FAQItem({
  faq,
  isOpen,
  onToggle,
}: {
  faq: { q: string; a: string };
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-[#E5E7EB]">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center gap-4 text-left transition-colors duration-150 hover:text-[#005088]"
        style={{ padding: "22px 0", fontSize: "16px", fontWeight: 600, color: "#0D1B35" }}
      >
        <span>{faq.q}</span>
        <span
          className="w-[30px] h-[30px] rounded-full flex items-center justify-center flex-shrink-0 text-[18px] font-normal leading-none transition-all duration-[250ms]"
          style={{
            background: isOpen ? "#005088" : "#F3F4F6",
            color: isOpen ? "white" : "#005088",
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
          }}
        >
          +
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <p
              className="leading-[1.75] text-[#6B7280]"
              style={{ fontSize: "15px", paddingBottom: "20px", paddingRight: "48px" }}
            >
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function HomeFAQ() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="bg-white" style={{ padding: "80px 48px" }}>
      <div className="max-w-[600px] mx-auto text-center mb-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="text-[12px] font-bold uppercase tracking-[0.12em] mb-2.5"
            style={{ color: "#3CBFAB" }}
          >
            Resolvemos tus dudas
          </p>
          <h2
            className="font-black text-[#005088] tracking-[-0.02em]"
            style={{ fontSize: "clamp(26px,3vw,40px)" }}
          >
            ¿Tienes dudas?
          </h2>
        </motion.div>
      </div>

      <div className="max-w-[720px] mx-auto">
        {faqs.map((faq, i) => (
          <FAQItem
            key={i}
            faq={faq}
            isOpen={open === i}
            onToggle={() => setOpen(open === i ? null : i)}
          />
        ))}

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-[16px] text-[#6B7280] mb-5">¿No encontraste lo que buscabas?</p>
          <Link
            href="/contacto"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-white font-bold text-[15px] transition-all duration-200 hover:-translate-y-0.5"
            style={{
              background: "#005088",
              boxShadow: "0 4px 16px rgba(0,80,136,0.3)",
            }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = "#003d6b")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = "#005088")}
          >
            Contactar soporte
          </Link>
        </div>
      </div>
    </section>
  );
}
