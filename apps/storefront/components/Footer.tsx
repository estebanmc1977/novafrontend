"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/lib/i18n-navigation'
import CountrySelector from '@/components/CountrySelector'
import type { Locale } from '@/i18n/routing'

export default function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale() as Locale
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const footerLinks = {
    [t('sections.comprar')]: [
      { label: t('links.tienda'), href: "/tienda" },
      { label: t('links.suscripciones'), href: "/suscripciones" },
      { label: t('links.garantia'), href: "/garantia" },
    ],
    [t('sections.ayuda')]: [
      { label: t('links.contacto'), href: "/contacto" },
      { label: t('links.faq'), href: "/faq" },
      { label: t('links.reembolso'), href: "/reembolso" },
    ],
    [t('sections.nosotros')]: [
      { label: t('links.nosotros'), href: "/nosotros" },
      { label: t('links.porQue'), href: "/nosotros#por-que" },
      { label: t('links.suscribeteAhorra'), href: "/suscripciones" },
    ],
    [t('sections.legal')]: [
      { label: t('links.privacidad'), href: "/privacidad" },
      { label: t('links.terminos'), href: "/terminos" },
    ],
  };

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
            <p className="text-sm text-[#0D1B35]/55 mb-4 leading-relaxed">{t('newsletter.label')}</p>
            {sent ? (
              <p className="text-sm text-[#C9D849] font-semibold">{t('newsletter.success')}</p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('newsletter.placeholder')}
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0D1B35]/6 border border-[#0D1B35]/15 text-sm text-[#0D1B35] placeholder-[#0D1B35]/35 focus:outline-none focus:border-[#E8503A]/60 transition-colors duration-200"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2.5 bg-[#E8503A] text-white text-sm font-semibold rounded-xl hover:bg-[#C43B28] active:scale-95 transition-all duration-200"
                >
                  {t('newsletter.button')}
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
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <Image src="/logos/logocolor.webp" alt="Novapatch" width={130} height={36} className="h-7 w-auto object-contain opacity-40" />
          <CountrySelector currentLocale={locale} />
          <p className="text-[11px] text-[#0D1B35]/30 text-center tracking-wide">{t('copyright', { year: new Date().getFullYear() })}</p>
          <PaymentBadges locale={locale} />
        </div>
      </div>
    </footer>
  );
}

const PAYMENT_METHODS: Record<string, Array<'visa' | 'mastercard' | 'oxxo' | 'spei' | 'pix' | 'boleto'>> = {
  mx: ['visa', 'mastercard', 'oxxo', 'spei'],
  br: ['visa', 'mastercard', 'pix', 'boleto'],
  ar: ['visa', 'mastercard'],
  cl: ['visa', 'mastercard'],
  co: ['visa', 'mastercard'],
}

function PaymentBadges({ locale }: { locale: string }) {
  const methods = PAYMENT_METHODS[locale] ?? ['visa', 'mastercard']
  return (
    <div className="flex items-center gap-2">
      {methods.map((m) => {
        if (m === 'visa') return <VisaBadge key={m} />
        if (m === 'mastercard') return <MastercardBadge key={m} />
        return (
          <span
            key={m}
            className="px-2.5 py-1 border border-[#0D1B35]/12 rounded-md text-[9px] font-semibold uppercase tracking-widest text-[#0D1B35]/40"
          >
            {m}
          </span>
        )
      })}
    </div>
  )
}

function VisaBadge() {
  return (
    <div className="px-2.5 py-1 border border-[#0D1B35]/12 rounded-md flex items-center justify-center h-[26px] w-[42px]">
      <svg viewBox="0 0 38 12" fill="none" className="h-3 w-auto">
        <path
          d="M14.5 11.5H11.8L13.5 0.5H16.2L14.5 11.5ZM9.5 0.5L6.9 7.9L6.6 6.4L5.7 1.4C5.5 0.8 5 0.5 4.4 0.5H0.1L0 0.8C1.1 1 2.1 1.5 3 2.1L5.4 11.5H8.3L12.6 0.5H9.5ZM34 11.5H36.6L34.3 0.5H32.1C31.6 0.5 31.1 0.8 30.9 1.3L26.9 11.5H29.8L30.4 9.8H33.9L34 11.5ZM31.2 7.5L32.6 3.6L33.4 7.5H31.2ZM26.8 3.2L27.2 0.8C26.4 0.5 25.5 0.3 24.6 0.3C22.5 0.3 21 1.4 21 3C21 4.2 22 4.9 22.8 5.4C23.6 5.9 23.9 6.2 23.9 6.6C23.9 7.3 23.1 7.6 22.4 7.6C21.4 7.6 20.8 7.4 20 7L19.6 9.5C20.5 9.9 21.5 10.1 22.5 10.1C24.8 10.1 26.2 9 26.2 7.2C26.2 5.2 24 4.8 24 3.9C24 3.3 24.6 2.8 25.7 2.8C26.1 2.8 26.5 2.9 26.8 3.2Z"
          fill="#1A1F71"
        />
      </svg>
    </div>
  )
}

function MastercardBadge() {
  return (
    <div className="px-2 py-1 border border-[#0D1B35]/12 rounded-md flex items-center justify-center h-[26px] w-[42px]">
      <svg viewBox="0 0 28 18" fill="none" className="h-3.5 w-auto">
        <circle cx="10" cy="9" r="9" fill="#EB001B" />
        <circle cx="18" cy="9" r="9" fill="#F79E1B" />
        <path d="M14 3.8A9 9 0 0 1 17.5 9 9 9 0 0 1 14 14.2 9 9 0 0 1 10.5 9 9 9 0 0 1 14 3.8z" fill="#FF5F00" />
      </svg>
    </div>
  )
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
