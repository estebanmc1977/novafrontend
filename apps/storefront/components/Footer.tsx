"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  Comprar: [
    { label: "Tienda", href: "/tienda" },
    { label: "Suscripciones", href: "/suscripciones" },
    { label: "Garantía", href: "/garantia" },
  ],
  Ayuda: [
    { label: "Contáctanos", href: "/contacto" },
    { label: "Preguntas frecuentes", href: "/faq" },
    { label: "Solicitar reembolso", href: "/reembolso" },
  ],
  Nosotros: [
    { label: "Nosotros", href: "/nosotros" },
    { label: "¿Por qué parches?", href: "/nosotros#por-que" },
    { label: "Suscríbete y ahorra", href: "/suscripciones" },
  ],
  Legal: [
    { label: "Aviso de Privacidad", href: "/privacidad" },
    { label: "Términos y Condiciones", href: "/terminos" },
  ],
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) { setSent(true); setEmail(""); }
  };

  return (
    <footer className="bg-[#F8EDEB] text-[#0D1B35]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {Object.entries(footerLinks).map(([cat, items]) => (
            <div key={cat}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-[#0D1B35]/40 mb-4">{cat}</h4>
              <ul className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm text-[#0D1B35]/60 hover:text-[#0D1B35] transition-colors duration-200">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#0D1B35]/40 mb-4">Newsletter</h4>
            <p className="text-sm text-[#0D1B35]/55 mb-4 leading-relaxed">Tips de bienestar y descuentos exclusivos.</p>
            {sent ? (
              <p className="text-sm text-[#C9D849] font-semibold">¡Gracias por suscribirte! 🎉</p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D1B35]/6 border border-[#0D1B35]/15 text-sm text-[#0D1B35] placeholder-[#0D1B35]/35 focus:outline-none focus:border-[#E8503A]/60 transition-colors duration-200"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2.5 bg-[#E8503A] text-white text-sm font-semibold rounded-xl hover:bg-[#C43B28] active:scale-95 transition-all duration-200"
                >
                  Suscribirme
                </button>
              </form>
            )}
            <div className="flex gap-3">
              <a href="https://www.instagram.com/novapatch.mx?igsh=dGZ4cGNoNjluc3Vl" aria-label="Instagram" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-[#0D1B35]/8 hover:bg-[#0D1B35]/15 flex items-center justify-center transition-colors duration-200">
                <InstagramIcon />
              </a>
              <a href="https://www.tiktok.com/@novapatch.mx?_r=1&_t=ZS-95C7N0OkUke" aria-label="TikTok" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-[#0D1B35]/8 hover:bg-[#0D1B35]/15 flex items-center justify-center transition-colors duration-200">
                <TikTokIcon />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[#0D1B35]/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <Image src="/logos/logocolor.webp" alt="NovaPatch" width={130} height={36} className="h-7 w-auto object-contain opacity-50" />
          <p className="text-xs text-[#0D1B35]/35 text-center">© 2025 NovaPatch®. Todos los derechos reservados.</p>
          <div className="flex items-center gap-1.5">
            {["Visa", "Mastercard", "OXXO", "SPEI"].map((m) => (
              <span key={m} className="px-2 py-1 bg-[#0D1B35]/8 rounded text-[10px] text-[#0D1B35]/50 font-medium">{m}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0D1B35" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.7">
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="#0D1B35" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="14" height="16" viewBox="0 0 24 24" fill="#0D1B35" opacity="0.7">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.49a8.16 8.16 0 0 0 4.77 1.52V7.56a4.85 4.85 0 0 1-1-.87z" />
    </svg>
  );
}
