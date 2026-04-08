// apps/storefront/components/CountrySelector.tsx
'use client'

import { useState, useRef, useEffect } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/lib/i18n-navigation'
import { routing, type Locale } from '@/i18n/routing'

export default function CountrySelector({ currentLocale }: { currentLocale: Locale }) {
  const t = useTranslations('footer')
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  function select(locale: Locale) {
    router.push(pathname, { locale })
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-[11px] text-[#0D1B35]/45 hover:text-[#0D1B35]/75 transition-colors duration-200"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <GlobeIcon />
        <span className="font-medium tracking-wide">{t(`markets.${currentLocale}`)}</span>
        <svg
          width="10" height="10" viewBox="0 0 10 10" fill="none"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 bg-white border border-[#0D1B35]/8 rounded-xl shadow-md shadow-[#0D1B35]/5 py-1.5 min-w-[130px] z-50"
        >
          {routing.locales.map((locale) => (
            <button
              key={locale}
              role="option"
              aria-selected={locale === currentLocale}
              onClick={() => select(locale)}
              className={`w-full px-4 py-2 text-left text-[11px] font-medium transition-colors duration-150 ${
                locale === currentLocale
                  ? 'text-[#E8503A]'
                  : 'text-[#0D1B35]/55 hover:text-[#0D1B35] hover:bg-[#0D1B35]/3'
              }`}
            >
              {t(`markets.${locale}`)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function GlobeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
      <circle cx="6" cy="6" r="5" />
      <path d="M6 1c-1.5 1.5-2 3-2 5s.5 3.5 2 5" />
      <path d="M6 1c1.5 1.5 2 3 2 5s-.5 3.5-2 5" />
      <path d="M1 6h10" />
      <path d="M1.5 3.5h9M1.5 8.5h9" />
    </svg>
  )
}
