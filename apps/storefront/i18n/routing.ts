// apps/storefront/i18n/routing.ts
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['mx', 'br', 'ar', 'cl', 'co'],
  defaultLocale: 'mx',
  localePrefix: 'always',
})

export type Locale = (typeof routing.locales)[number]
