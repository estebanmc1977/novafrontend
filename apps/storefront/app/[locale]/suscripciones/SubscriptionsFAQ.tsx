"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  { q: "¿Cuándo se hace el primer cobro?", a: "El cobro se realiza al confirmar tu suscripción. A partir de ahí, cada producto se factura automáticamente según la frecuencia que elegiste para ese parche." },
  { q: "¿Todos mis productos llegan en el mismo envío?", a: "No necesariamente. Cada producto tiene su propia frecuencia, por lo que los envíos se generan de forma independiente según el ritmo que elegiste para cada uno. Así recibes lo que necesitas, cuando lo necesitas." },
  { q: "¿Puedo cambiar mis productos o mi frecuencia?", a: "Sí. Desde tu cuenta puedes ajustar qué parches incluye tu próximo envío y con qué frecuencia los recibes, antes de que se procese el siguiente ciclo." },
  { q: "¿Cómo pauso mi suscripción?", a: "Desde tu perfil en Novapatch, con un clic. Puedes pausar un producto individual o toda tu suscripción. La pausa detiene el cobro y el envío hasta que tú decidas reactivarlo." },
  { q: "¿Puedo cancelar en cualquier momento?", a: "Sí, sin penalizaciones ni períodos mínimos de permanencia. Si cancelas antes de la fecha de tu próximo envío, no se genera ningún cargo adicional." },
  { q: "¿Qué pasa si ya tengo parches en casa?", a: "Puedes pausar ese producto hasta que los necesites. El resto de tu plan sigue funcionando con normalidad." },
  { q: "¿Cuál es la diferencia de descuento entre frecuencias?", a: "Mensual (cada 30 días): 20% off. Bimestral (cada 60 días): 15% off. Trimestral (cada 90 días): 10% off. Mientras más seguido recibes, mayor es el descuento — porque la constancia es lo que hace que el bienestar funcione." },
];

function FAQItem({ faq, isOpen, onToggle }: { faq: { q: string; a: string }; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className={`rounded-2xl border transition-all duration-200 overflow-hidden ${isOpen ? "bg-white border-[#3CBFAB]/25 shadow-[0_4px_20px_rgba(0,80,136,0.08)]" : "bg-white/80 border-[#005088]/8 hover:border-[#3CBFAB]/20"}`}>
      <button onClick={onToggle} className="w-full flex items-center justify-between gap-4 p-5 text-left">
        <span className={`text-[15px] font-semibold leading-snug ${isOpen ? "text-[#3CBFAB]" : "text-[#005088]"}`}>{faq.q}</span>
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
          className={`flex-shrink-0 w-6 h-6 rounded-lg flex items-center justify-center ${isOpen ? "bg-[#3CBFAB]" : "bg-[#005088]/8"}`}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M6 2v8M2 6h8" stroke={isOpen ? "white" : "#005088"} strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </motion.div>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] as const }}
          >
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

export default function SubscriptionsFAQ() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-3">
      {faqs.map((faq, i) => (
        <FAQItem
          key={i}
          faq={faq}
          isOpen={openFaq === i}
          onToggle={() => setOpenFaq(openFaq === i ? null : i)}
        />
      ))}
    </div>
  );
}
