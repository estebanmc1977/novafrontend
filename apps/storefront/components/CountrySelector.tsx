// apps/storefront/components/CountrySelector.tsx
'use client'

import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/lib/i18n-navigation'
import { routing, type Locale } from '@/i18n/routing'

const flags: Record<Locale, string> = {
  mx: '🇲🇽',
  br: '🇧🇷',
  ar: '🇦🇷',
  cl: '🇨🇱',
  co: '🇨🇴',
}

export default function CountrySelector({ currentLocale }: { currentLocale: Locale }) {
  const t = useTranslations('footer')
  const router = useRouter()
  const pathname = usePathname()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newLocale = e.target.value as Locale
    router.push(pathname, { locale: newLocale })
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-[#6B7280]">{t('selectCountry')}:</span>
      <select
        value={currentLocale}
        onChange={handleChange}
        className="text-sm bg-transparent border border-[#0D1B35]/20 rounded-lg px-2 py-1 text-[#0D1B35] cursor-pointer hover:border-[#0D1B35]/40 transition-colors"
      >
        {routing.locales.map((locale) => (
          <option key={locale} value={locale}>
            {flags[locale]} {t(`markets.${locale}`)}
          </option>
        ))}
      </select>
    </div>
  )
}
