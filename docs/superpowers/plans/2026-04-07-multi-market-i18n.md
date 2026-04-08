# Multi-Market i18n Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the Novapatch storefront from Mexico-only to 5 Latin American markets (mx, br, ar, cl, co) using URL-prefix routing (`/mx`, `/br`, etc.) with `next-intl`, per-market config, and MDX legal pages.

**Architecture:** All routes move under `app/[locale]/`. A middleware combines IP-based geo-detection (Vercel `x-vercel-ip-country` header) with `next-intl` locale routing. All UI copy lives in `/messages/*.json`. Long-form legal content lives in `/content/legal/[locale]/*.mdx`. Per-market structural config (currency, payment provider, Clerk locale, Medusa region) lives in `lib/markets.ts`.

**Tech Stack:** Next.js 15.2 App Router, next-intl v3, next-mdx-remote v5, TypeScript strict mode, Tailwind CSS v4, Clerk v6.

> **No test framework configured.** Verification steps use `pnpm run build` (TypeScript check) and manual dev-server verification.

---

## File Map

### New files
| Path | Purpose |
|---|---|
| `i18n/routing.ts` | Defines locales, default locale, prefix strategy |
| `i18n/request.ts` | Configures next-intl for Server Components |
| `lib/markets.ts` | Per-market config (currency, payment, Clerk locale, etc.) |
| `lib/i18n-navigation.ts` | Locale-aware `Link`, `useRouter`, `redirect` |
| `middleware.ts` | IP detection + next-intl locale routing |
| `app/[locale]/layout.tsx` | Locale-aware layout (ClerkProvider + NextIntlClientProvider) |
| `components/CountrySelector.tsx` | Footer country switcher |
| `messages/es-MX.json` | Spanish Mexico translations |
| `messages/es-AR.json` | Spanish Argentina translations |
| `messages/es-CL.json` | Spanish Chile translations |
| `messages/es-CO.json` | Spanish Colombia translations |
| `messages/pt-BR.json` | Portuguese Brazil translations |
| `content/legal/mx/terminos.mdx` | MX Terms |
| `content/legal/mx/privacidad.mdx` | MX Privacy |
| `content/legal/mx/reembolso.mdx` | MX Refund |
| `content/legal/mx/garantia.mdx` | MX Warranty |
| `content/legal/br/termos.mdx` | BR Terms |
| `content/legal/br/privacidade.mdx` | BR Privacy |
| `content/legal/br/reembolso.mdx` | BR Refund |
| `content/legal/br/garantia.mdx` | BR Warranty |
| `content/legal/ar/terminos.mdx` | AR Terms |
| `content/legal/ar/privacidad.mdx` | AR Privacy |
| `content/legal/ar/reembolso.mdx` | AR Refund |
| `content/legal/ar/garantia.mdx` | AR Warranty |
| `content/legal/cl/terminos.mdx` | CL Terms |
| `content/legal/cl/privacidad.mdx` | CL Privacy |
| `content/legal/cl/reembolso.mdx` | CL Refund |
| `content/legal/cl/garantia.mdx` | CL Warranty |
| `content/legal/co/terminos.mdx` | CO Terms |
| `content/legal/co/privacidad.mdx` | CO Privacy |
| `content/legal/co/reembolso.mdx` | CO Refund |
| `content/legal/co/garantia.mdx` | CO Warranty |

### Moved files (pages under `[locale]/`)
| From | To |
|---|---|
| `app/page.tsx` | `app/[locale]/page.tsx` |
| `app/tienda/page.tsx` | `app/[locale]/tienda/page.tsx` |
| `app/suscripciones/page.tsx` | `app/[locale]/suscripciones/page.tsx` |
| `app/nosotros/page.tsx` | `app/[locale]/nosotros/page.tsx` |
| `app/faq/page.tsx` | `app/[locale]/faq/page.tsx` |
| `app/garantia/page.tsx` | `app/[locale]/garantia/page.tsx` |
| `app/reembolso/page.tsx` | `app/[locale]/reembolso/page.tsx` |
| `app/contacto/page.tsx` | `app/[locale]/contacto/page.tsx` |
| `app/privacidad/page.tsx` | `app/[locale]/privacidad/page.tsx` |
| `app/terminos/page.tsx` | `app/[locale]/terminos/page.tsx` |
| `app/sign-in/[[...sign-in]]/page.tsx` | `app/[locale]/sign-in/[[...sign-in]]/page.tsx` |
| `app/sign-up/[[...sign-up]]/page.tsx` | `app/[locale]/sign-up/[[...sign-up]]/page.tsx` |
| `app/cuenta/layout.tsx` | `app/[locale]/cuenta/layout.tsx` |
| `app/cuenta/page.tsx` | `app/[locale]/cuenta/page.tsx` |
| `app/cuenta/suscripciones/page.tsx` | `app/[locale]/cuenta/suscripciones/page.tsx` |
| `app/checkout/page.tsx` | `app/[locale]/checkout/page.tsx` |
| `app/checkout/cart/page.tsx` | `app/[locale]/checkout/cart/page.tsx` |

### Modified files
| Path | Change |
|---|---|
| `next.config.js` | Wrap with `createNextIntlPlugin` |
| `app/layout.tsx` | Strip to minimal html/body shell (remove Clerk, Cart, Openpay) |
| `lib/clerk-theme.ts` | Export `getClerkLocalization(locale)` function |
| `components/Navbar.tsx` | Use `Link` from `@/lib/i18n-navigation`, `useTranslations` |
| `components/Footer.tsx` | Use `Link` from `@/lib/i18n-navigation`, add `CountrySelector`, `useTranslations` |
| `components/home/HeroWithBar.tsx` | `useTranslations('home.hero')` |
| `components/home/HowItWorks.tsx` | `useTranslations('home.howItWorks')` |
| `components/home/AbsorptionSection.tsx` | `useTranslations('home.absorption')` |
| `components/home/ComparisonTable.tsx` | `useTranslations('home.comparison')` |
| `components/home/ProductGrid.tsx` | `useTranslations('home.productGrid')` |
| `components/home/Testimonials.tsx` | `useTranslations('home.testimonials')` |
| `components/home/CTABanner.tsx` | `useTranslations('home.cta')` |
| `components/home/HomeFAQ.tsx` | `useTranslations('home.faq')` |

---

## Task 1: Install dependencies

**Files:**
- Modify: `apps/storefront/package.json`

All commands run from `apps/storefront/`.

- [ ] **Step 1: Install next-intl and next-mdx-remote**

```bash
pnpm add next-intl next-mdx-remote
```

Expected output: Both packages added to `dependencies` in `package.json`.

- [ ] **Step 2: Verify installation**

```bash
pnpm run build 2>&1 | head -20
```

Expected: build proceeds (may fail on missing config — that's fine, we just confirm packages resolved).

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: add next-intl and next-mdx-remote dependencies"
```

---

## Task 2: Configure next-intl routing and request

**Files:**
- Create: `i18n/routing.ts`
- Create: `i18n/request.ts`
- Modify: `next.config.js`

- [ ] **Step 1: Create `i18n/routing.ts`**

```typescript
// apps/storefront/i18n/routing.ts
import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['mx', 'br', 'ar', 'cl', 'co'],
  defaultLocale: 'mx',
  localePrefix: 'always',
})

export type Locale = (typeof routing.locales)[number]
```

- [ ] **Step 2: Create `i18n/request.ts`**

```typescript
// apps/storefront/i18n/request.ts
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !routing.locales.includes(locale as (typeof routing.locales)[number])) {
    locale = routing.defaultLocale
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
```

- [ ] **Step 3: Update `next.config.js` to wrap with createNextIntlPlugin**

Replace the entire contents of `apps/storefront/next.config.js` with:

```javascript
// apps/storefront/next.config.js
const createNextIntlPlugin = require('next-intl/plugin')

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.clerk.com',
      },
    ],
  },
}

module.exports = withNextIntl(nextConfig)
```

- [ ] **Step 4: Create `lib/i18n-navigation.ts`**

```typescript
// apps/storefront/lib/i18n-navigation.ts
import { createNavigation } from 'next-intl/navigation'
import { routing } from '@/i18n/routing'

export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing)
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
pnpm run build 2>&1 | grep -E "error|Error" | head -20
```

Expected: Errors only about missing `messages/*.json` files or missing `[locale]` layout — not about next-intl config itself.

- [ ] **Step 6: Commit**

```bash
git add i18n/routing.ts i18n/request.ts next.config.js lib/i18n-navigation.ts
git commit -m "feat(i18n): configure next-intl routing and request"
```

---

## Task 3: Create `lib/markets.ts`

**Files:**
- Create: `lib/markets.ts`

- [ ] **Step 1: Create `lib/markets.ts`**

```typescript
// apps/storefront/lib/markets.ts
import type { Locale } from '@/i18n/routing'

export const MARKETS = {
  mx: {
    locale: 'es-MX',
    currency: 'MXN',
    paymentProvider: 'openpay' as const,
    clerkLocaleKey: 'esMX' as const,
    supportEmail: 'soporte@novapatch.mx',
    medusaRegionId: process.env.NEXT_PUBLIC_MEDUSA_REGION_MX ?? '',
    addressCountry: 'mx',
    taxLabel: 'IVA 16%',
    country: 'México',
  },
  br: {
    locale: 'pt-BR',
    currency: 'BRL',
    paymentProvider: 'mercadopago' as const,
    clerkLocaleKey: 'ptBR' as const,
    supportEmail: 'suporte@novapatch.com.br',
    medusaRegionId: process.env.NEXT_PUBLIC_MEDUSA_REGION_BR ?? '',
    addressCountry: 'br',
    taxLabel: 'ICMS',
    country: 'Brasil',
  },
  ar: {
    locale: 'es-AR',
    currency: 'ARS',
    paymentProvider: 'mercadopago' as const,
    clerkLocaleKey: 'esES' as const,
    supportEmail: 'soporte@novapatch.com.ar',
    medusaRegionId: process.env.NEXT_PUBLIC_MEDUSA_REGION_AR ?? '',
    addressCountry: 'ar',
    taxLabel: 'IVA 21%',
    country: 'Argentina',
  },
  cl: {
    locale: 'es-CL',
    currency: 'CLP',
    paymentProvider: 'mercadopago' as const,
    clerkLocaleKey: 'esES' as const,
    supportEmail: 'soporte@novapatch.cl',
    medusaRegionId: process.env.NEXT_PUBLIC_MEDUSA_REGION_CL ?? '',
    addressCountry: 'cl',
    taxLabel: 'IVA 19%',
    country: 'Chile',
  },
  co: {
    locale: 'es-CO',
    currency: 'COP',
    paymentProvider: 'mercadopago' as const,
    clerkLocaleKey: 'esES' as const,
    supportEmail: 'soporte@novapatch.co',
    medusaRegionId: process.env.NEXT_PUBLIC_MEDUSA_REGION_CO ?? '',
    addressCountry: 'co',
    taxLabel: 'IVA 19%',
    country: 'Colombia',
  },
} as const satisfies Record<Locale, {
  locale: string
  currency: string
  paymentProvider: 'openpay' | 'mercadopago'
  clerkLocaleKey: string
  supportEmail: string
  medusaRegionId: string
  addressCountry: string
  taxLabel: string
  country: string
}>

export type Market = keyof typeof MARKETS
```

- [ ] **Step 2: Verify TypeScript types compile**

```bash
npx tsc --noEmit 2>&1 | grep "markets" | head -10
```

Expected: No errors related to `markets.ts`.

- [ ] **Step 3: Commit**

```bash
git add lib/markets.ts
git commit -m "feat(i18n): add per-market configuration"
```

---

## Task 4: Create `middleware.ts`

**Files:**
- Create: `middleware.ts`

- [ ] **Step 1: Create `middleware.ts`**

```typescript
// apps/storefront/middleware.ts
import createMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { routing, type Locale } from './i18n/routing'

const countryToLocale: Record<string, Locale> = {
  MX: 'mx',
  BR: 'br',
  AR: 'ar',
  CL: 'cl',
  CO: 'co',
}

const intlMiddleware = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Root redirect: detect locale from cookie → IP → default
  if (pathname === '/') {
    const savedLocale = request.cookies.get('NEXT_LOCALE')?.value as Locale | undefined
    const country = request.headers.get('x-vercel-ip-country') ?? ''
    const detectedLocale = countryToLocale[country.toUpperCase()] ?? routing.defaultLocale
    const locale =
      savedLocale && (routing.locales as readonly string[]).includes(savedLocale)
        ? savedLocale
        : detectedLocale

    return NextResponse.redirect(new URL(`/${locale}`, request.url))
  }

  // Let next-intl handle locale validation and routing for all other paths
  const response = intlMiddleware(request)

  // Persist locale in cookie whenever user navigates to a locale-prefixed path
  const localeSegment = pathname.split('/')[1] as Locale
  if ((routing.locales as readonly string[]).includes(localeSegment)) {
    response.cookies.set('NEXT_LOCALE', localeSegment, {
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      path: '/',
    })
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
```

- [ ] **Step 2: Commit**

```bash
git add middleware.ts
git commit -m "feat(i18n): add middleware for IP-based locale detection and routing"
```

---

## Task 5: Update `lib/clerk-theme.ts` to be locale-aware

**Files:**
- Modify: `lib/clerk-theme.ts`

- [ ] **Step 1: Read current `lib/clerk-theme.ts`**

Read the file to understand its current export structure before modifying it.

- [ ] **Step 2: Add locale-aware `getClerkLocalization` export**

At the top of `lib/clerk-theme.ts`, add these imports:

```typescript
import { esMX, ptBR, esES } from '@clerk/localizations'
import type { Market } from '@/lib/markets'
```

Then replace the existing `export const esLocalization = ...` with:

```typescript
const baseLocalizations = {
  mx: esMX,
  br: ptBR,
  ar: esES,
  cl: esES,
  co: esES,
}

// Keep the existing esLocalization export for backwards compatibility
// during migration (remove once app/layout.tsx is updated)
export const esLocalization = {
  ...esMX,
  signIn: {
    ...esMX.signIn,
    start: {
      ...esMX.signIn?.start,
      subtitle: 'Ingresa a tu cuenta de Novapatch',
    },
  },
  signUp: {
    ...esMX.signUp,
    start: {
      ...esMX.signUp?.start,
      subtitle: 'Regístrate para gestionar tus pedidos y suscripciones',
    },
  },
}

export function getClerkLocalization(locale: Market) {
  const base = baseLocalizations[locale]
  const isPortuguese = locale === 'br'
  return {
    ...base,
    signIn: {
      ...base?.signIn,
      start: {
        ...base?.signIn?.start,
        subtitle: isPortuguese
          ? 'Entre na sua conta Novapatch'
          : 'Ingresa a tu cuenta de Novapatch',
      },
    },
    signUp: {
      ...base?.signUp,
      start: {
        ...base?.signUp?.start,
        subtitle: isPortuguese
          ? 'Cadastre-se para gerenciar seus pedidos e assinaturas'
          : 'Regístrate para gestionar tus pedidos y suscripciones',
      },
    },
  }
}
```

- [ ] **Step 3: Commit**

```bash
git add lib/clerk-theme.ts
git commit -m "feat(i18n): make Clerk localization locale-aware"
```

---

## Task 6: Restructure layouts — root and `[locale]`

**Files:**
- Modify: `app/layout.tsx`
- Create: `app/[locale]/layout.tsx`

- [ ] **Step 1: Strip `app/layout.tsx` to minimal shell**

Replace the full contents of `apps/storefront/app/layout.tsx` with:

```typescript
// apps/storefront/app/layout.tsx
import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: 'Novapatch — Bienestar que no interrumpe tu día',
  description:
    'La forma más limpia y práctica de tomar vitaminas. Parches inteligentes de alta absorción transdérmica, sin pastillas ni rellenos.',
  icons: {
    icon: [
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon.ico' },
    ],
    apple: { url: '/favicon/apple-touch-icon.png' },
    other: [{ rel: 'manifest', url: '/favicon/site.webmanifest' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body className={`${montserrat.variable} min-h-screen`}>{children}</body>
    </html>
  )
}
```

- [ ] **Step 2: Create `app/[locale]/layout.tsx`**

```typescript
// apps/storefront/app/[locale]/layout.tsx
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import Script from 'next/script'
import { ClerkProvider } from '@clerk/nextjs'
import { CartProvider } from '@/contexts/CartContext'
import CartDrawer from '@/components/CartDrawer'
import { getClerkLocalization } from '@/lib/clerk-theme'
import { MARKETS } from '@/lib/markets'
import { routing, type Locale } from '@/i18n/routing'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound()
  }

  const typedLocale = locale as Locale
  const market = MARKETS[typedLocale]
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <ClerkProvider
        localization={getClerkLocalization(typedLocale)}
        signInUrl={`/${locale}/sign-in`}
        signUpUrl={`/${locale}/sign-up`}
        signInFallbackRedirectUrl={`/${locale}`}
        signUpFallbackRedirectUrl={`/${locale}`}
      >
        <CartProvider>
          {children}
          <CartDrawer />
        </CartProvider>

        {market.paymentProvider === 'openpay' && (
          <>
            <Script
              src="https://js.openpay.mx/openpay.v1.min.js"
              strategy="afterInteractive"
            />
            <Script
              src="https://openpay.s3.amazonaws.com/openpay-data.v1.min.js"
              strategy="afterInteractive"
            />
          </>
        )}
      </ClerkProvider>
    </NextIntlClientProvider>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add app/layout.tsx app/[locale]/layout.tsx
git commit -m "feat(i18n): restructure layouts — root shell + locale layout"
```

---

## Task 7: Create `messages/es-MX.json` (source of truth)

**Files:**
- Create: `messages/es-MX.json`

This is the master translation file. All other locales mirror this exact key structure.

- [ ] **Step 1: Create `messages/es-MX.json`**

```json
{
  "nav": {
    "tienda": "Tienda",
    "suscripciones": "Suscripciones",
    "nosotros": "Nosotros",
    "cuenta": "Mi Cuenta",
    "signIn": "Iniciar sesión",
    "signUp": "Registrarse"
  },
  "footer": {
    "sections": {
      "comprar": "Comprar",
      "ayuda": "Ayuda",
      "nosotros": "Nosotros",
      "legal": "Legal"
    },
    "links": {
      "tienda": "Tienda",
      "suscripciones": "Suscripciones",
      "garantia": "Garantía",
      "contacto": "Contáctanos",
      "faq": "Preguntas frecuentes",
      "reembolso": "Solicitar reembolso",
      "nosotros": "Nosotros",
      "porQue": "¿Por qué parches?",
      "suscribeteAhorra": "Suscríbete y ahorra",
      "privacidad": "Aviso de Privacidad",
      "terminos": "Términos y Condiciones"
    },
    "newsletter": {
      "label": "Novedades y ofertas",
      "placeholder": "tu@correo.com",
      "button": "Suscribirse",
      "success": "¡Gracias por suscribirte!"
    },
    "social": {
      "followUs": "Síguenos"
    },
    "selectCountry": "País",
    "markets": {
      "mx": "México",
      "br": "Brasil",
      "ar": "Argentina",
      "cl": "Chile",
      "co": "Colombia"
    },
    "copyright": "© {year} Novapatch. Todos los derechos reservados.",
    "tagline": "Bienestar que no interrumpe tu día"
  },
  "home": {
    "hero": {
      "badge": "Tecnología transdérmica",
      "title": "Vitaminas que se absorben de verdad",
      "subtitle": "Parches inteligentes de alta absorción transdérmica, sin pastillas ni rellenos.",
      "cta": "Ver productos",
      "ctaSecondary": "¿Cómo funciona?"
    },
    "howItWorks": {
      "badge": "Así de fácil",
      "title": "Cómo funciona",
      "step1Title": "Elige tu parche",
      "step1Desc": "Selecciona la combinación que tu cuerpo necesita.",
      "step2Title": "Aplícalo",
      "step2Desc": "Pega el parche en cualquier zona limpia y seca.",
      "step3Title": "Listo",
      "step3Desc": "Absorción constante durante 8 horas. Sin interrupciones."
    },
    "absorption": {
      "badge": "La ciencia detrás",
      "title": "Absorción directa al torrente sanguíneo",
      "subtitle": "Las pastillas pierden hasta el 85% de sus nutrientes en el proceso digestivo. Los parches transdérmicos los entregan directo donde se necesitan.",
      "stat1Value": "85%",
      "stat1Label": "Mayor biodisponibilidad",
      "stat2Value": "8h",
      "stat2Label": "Liberación sostenida",
      "stat3Value": "0",
      "stat3Label": "Efectos digestivos"
    },
    "comparison": {
      "badge": "Comparativa",
      "title": "Novapatch vs. suplementos tradicionales",
      "colNovapatch": "Novapatch",
      "colTraditional": "Pastillas / Cápsulas"
    },
    "testimonials": {
      "badge": "Lo que dicen",
      "title": "Miles ya lo sienten"
    },
    "cta": {
      "title": "Suscríbete y ahorra hasta 20%",
      "subtitle": "Elige la frecuencia que mejor se adapte a tu ritmo.",
      "button": "Ver planes"
    },
    "faq": {
      "badge": "Preguntas frecuentes",
      "title": "Todo lo que necesitas saber"
    }
  },
  "checkout": {
    "paymentMethods": {
      "title": "Método de pago",
      "description": "Paga con OXXO, SPEI o tarjeta de crédito/débito"
    }
  },
  "legal": {
    "badge": "Legal",
    "lastUpdated": "Última actualización: enero de 2025 · Ley aplicable: México",
    "contactTitle": "¿Tienes alguna duda legal?",
    "contactSubtitle": "Contáctanos en cualquier momento.",
    "terms": {
      "title": "Términos y Condiciones"
    },
    "privacy": {
      "title": "Aviso de Privacidad"
    },
    "refund": {
      "title": "Política de Reembolso"
    },
    "warranty": {
      "title": "Garantía"
    }
  },
  "meta": {
    "currency": "MXN",
    "currencySymbol": "$",
    "locale": "es-MX",
    "country": "México",
    "taxLabel": "IVA 16%",
    "paymentProvider": "openpay",
    "supportEmail": "soporte@novapatch.mx"
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add messages/es-MX.json
git commit -m "feat(i18n): add es-MX messages (source of truth)"
```

---

## Task 8: Create messages for remaining locales

**Files:**
- Create: `messages/es-AR.json`
- Create: `messages/es-CL.json`
- Create: `messages/es-CO.json`
- Create: `messages/pt-BR.json`

- [ ] **Step 1: Create `messages/es-AR.json`**

Copy `es-MX.json` and apply Argentine Spanish adjustments:

```json
{
  "nav": {
    "tienda": "Tienda",
    "suscripciones": "Suscripciones",
    "nosotros": "Nosotros",
    "cuenta": "Mi Cuenta",
    "signIn": "Iniciar sesión",
    "signUp": "Registrarse"
  },
  "footer": {
    "sections": {
      "comprar": "Comprar",
      "ayuda": "Ayuda",
      "nosotros": "Nosotros",
      "legal": "Legal"
    },
    "links": {
      "tienda": "Tienda",
      "suscripciones": "Suscripciones",
      "garantia": "Garantía",
      "contacto": "Contacto",
      "faq": "Preguntas frecuentes",
      "reembolso": "Solicitar reembolso",
      "nosotros": "Nosotros",
      "porQue": "¿Por qué parches?",
      "suscribeteAhorra": "Suscribite y ahorrá",
      "privacidad": "Política de Privacidad",
      "terminos": "Términos y Condiciones"
    },
    "newsletter": {
      "label": "Novedades y ofertas",
      "placeholder": "tu@correo.com",
      "button": "Suscribirse",
      "success": "¡Gracias por suscribirte!"
    },
    "social": {
      "followUs": "Seguinos"
    },
    "selectCountry": "País",
    "markets": {
      "mx": "México",
      "br": "Brasil",
      "ar": "Argentina",
      "cl": "Chile",
      "co": "Colombia"
    },
    "copyright": "© {year} Novapatch. Todos los derechos reservados.",
    "tagline": "Bienestar que no interrumpe tu día"
  },
  "home": {
    "hero": {
      "badge": "Tecnología transdérmica",
      "title": "Vitaminas que se absorben de verdad",
      "subtitle": "Parches inteligentes de alta absorción transdérmica, sin pastillas ni rellenos.",
      "cta": "Ver productos",
      "ctaSecondary": "¿Cómo funciona?"
    },
    "howItWorks": {
      "badge": "Así de fácil",
      "title": "Cómo funciona",
      "step1Title": "Elegí tu parche",
      "step1Desc": "Seleccioná la combinación que tu cuerpo necesita.",
      "step2Title": "Aplicalo",
      "step2Desc": "Pegá el parche en cualquier zona limpia y seca.",
      "step3Title": "Listo",
      "step3Desc": "Absorción constante durante 8 horas. Sin interrupciones."
    },
    "absorption": {
      "badge": "La ciencia detrás",
      "title": "Absorción directa al torrente sanguíneo",
      "subtitle": "Las pastillas pierden hasta el 85% de sus nutrientes en el proceso digestivo. Los parches transdérmicos los entregan directo donde se necesitan.",
      "stat1Value": "85%",
      "stat1Label": "Mayor biodisponibilidad",
      "stat2Value": "8h",
      "stat2Label": "Liberación sostenida",
      "stat3Value": "0",
      "stat3Label": "Efectos digestivos"
    },
    "comparison": {
      "badge": "Comparativa",
      "title": "Novapatch vs. suplementos tradicionales",
      "colNovapatch": "Novapatch",
      "colTraditional": "Pastillas / Cápsulas"
    },
    "testimonials": {
      "badge": "Lo que dicen",
      "title": "Miles ya lo sienten"
    },
    "cta": {
      "title": "Suscribite y ahorrá hasta 20%",
      "subtitle": "Elegí la frecuencia que mejor se adapte a tu ritmo.",
      "button": "Ver planes"
    },
    "faq": {
      "badge": "Preguntas frecuentes",
      "title": "Todo lo que necesitás saber"
    }
  },
  "checkout": {
    "paymentMethods": {
      "title": "Método de pago",
      "description": "Pagá con tarjeta de crédito/débito o transferencia"
    }
  },
  "legal": {
    "badge": "Legal",
    "lastUpdated": "Última actualización: enero de 2025 · Ley aplicable: Argentina",
    "contactTitle": "¿Tenés alguna duda legal?",
    "contactSubtitle": "Contactanos en cualquier momento.",
    "terms": { "title": "Términos y Condiciones" },
    "privacy": { "title": "Política de Privacidad" },
    "refund": { "title": "Política de Reembolso" },
    "warranty": { "title": "Garantía" }
  },
  "meta": {
    "currency": "ARS",
    "currencySymbol": "$",
    "locale": "es-AR",
    "country": "Argentina",
    "taxLabel": "IVA 21%",
    "paymentProvider": "mercadopago",
    "supportEmail": "soporte@novapatch.com.ar"
  }
}
```

- [ ] **Step 2: Create `messages/es-CL.json`**

```json
{
  "nav": {
    "tienda": "Tienda",
    "suscripciones": "Suscripciones",
    "nosotros": "Nosotros",
    "cuenta": "Mi Cuenta",
    "signIn": "Iniciar sesión",
    "signUp": "Registrarse"
  },
  "footer": {
    "sections": {
      "comprar": "Comprar",
      "ayuda": "Ayuda",
      "nosotros": "Nosotros",
      "legal": "Legal"
    },
    "links": {
      "tienda": "Tienda",
      "suscripciones": "Suscripciones",
      "garantia": "Garantía",
      "contacto": "Contáctanos",
      "faq": "Preguntas frecuentes",
      "reembolso": "Solicitar reembolso",
      "nosotros": "Nosotros",
      "porQue": "¿Por qué parches?",
      "suscribeteAhorra": "Suscríbete y ahorra",
      "privacidad": "Política de Privacidad",
      "terminos": "Términos y Condiciones"
    },
    "newsletter": {
      "label": "Novedades y ofertas",
      "placeholder": "tu@correo.com",
      "button": "Suscribirse",
      "success": "¡Gracias por suscribirte!"
    },
    "social": { "followUs": "Síguenos" },
    "selectCountry": "País",
    "markets": {
      "mx": "México", "br": "Brasil", "ar": "Argentina", "cl": "Chile", "co": "Colombia"
    },
    "copyright": "© {year} Novapatch. Todos los derechos reservados.",
    "tagline": "Bienestar que no interrumpe tu día"
  },
  "home": {
    "hero": {
      "badge": "Tecnología transdérmica",
      "title": "Vitaminas que se absorben de verdad",
      "subtitle": "Parches inteligentes de alta absorción transdérmica, sin pastillas ni rellenos.",
      "cta": "Ver productos",
      "ctaSecondary": "¿Cómo funciona?"
    },
    "howItWorks": {
      "badge": "Así de fácil",
      "title": "Cómo funciona",
      "step1Title": "Elige tu parche",
      "step1Desc": "Selecciona la combinación que tu cuerpo necesita.",
      "step2Title": "Aplícalo",
      "step2Desc": "Pega el parche en cualquier zona limpia y seca.",
      "step3Title": "Listo",
      "step3Desc": "Absorción constante durante 8 horas. Sin interrupciones."
    },
    "absorption": {
      "badge": "La ciencia detrás",
      "title": "Absorción directa al torrente sanguíneo",
      "subtitle": "Las pastillas pierden hasta el 85% de sus nutrientes en el proceso digestivo. Los parches transdérmicos los entregan directo donde se necesitan.",
      "stat1Value": "85%",
      "stat1Label": "Mayor biodisponibilidad",
      "stat2Value": "8h",
      "stat2Label": "Liberación sostenida",
      "stat3Value": "0",
      "stat3Label": "Efectos digestivos"
    },
    "comparison": {
      "badge": "Comparativa",
      "title": "Novapatch vs. suplementos tradicionales",
      "colNovapatch": "Novapatch",
      "colTraditional": "Pastillas / Cápsulas"
    },
    "testimonials": { "badge": "Lo que dicen", "title": "Miles ya lo sienten" },
    "cta": {
      "title": "Suscríbete y ahorra hasta 20%",
      "subtitle": "Elige la frecuencia que mejor se adapte a tu ritmo.",
      "button": "Ver planes"
    },
    "faq": { "badge": "Preguntas frecuentes", "title": "Todo lo que necesitas saber" }
  },
  "checkout": {
    "paymentMethods": {
      "title": "Método de pago",
      "description": "Paga con tarjeta de crédito/débito o transferencia"
    }
  },
  "legal": {
    "badge": "Legal",
    "lastUpdated": "Última actualización: enero de 2025 · Ley aplicable: Chile",
    "contactTitle": "¿Tienes alguna duda legal?",
    "contactSubtitle": "Contáctanos en cualquier momento.",
    "terms": { "title": "Términos y Condiciones" },
    "privacy": { "title": "Política de Privacidad" },
    "refund": { "title": "Política de Reembolso" },
    "warranty": { "title": "Garantía" }
  },
  "meta": {
    "currency": "CLP",
    "currencySymbol": "$",
    "locale": "es-CL",
    "country": "Chile",
    "taxLabel": "IVA 19%",
    "paymentProvider": "mercadopago",
    "supportEmail": "soporte@novapatch.cl"
  }
}
```

- [ ] **Step 3: Create `messages/es-CO.json`**

Same structure as `es-CL.json`. Change `meta` to:
```json
"meta": {
  "currency": "COP",
  "currencySymbol": "$",
  "locale": "es-CO",
  "country": "Colombia",
  "taxLabel": "IVA 19%",
  "paymentProvider": "mercadopago",
  "supportEmail": "soporte@novapatch.co"
}
```
Change `legal.lastUpdated` to `"Última actualización: enero de 2025 · Ley aplicable: Colombia"`.

- [ ] **Step 4: Create `messages/pt-BR.json`**

```json
{
  "nav": {
    "tienda": "Loja",
    "suscripciones": "Assinaturas",
    "nosotros": "Sobre nós",
    "cuenta": "Minha Conta",
    "signIn": "Entrar",
    "signUp": "Cadastrar"
  },
  "footer": {
    "sections": {
      "comprar": "Comprar",
      "ayuda": "Ajuda",
      "nosotros": "Sobre nós",
      "legal": "Legal"
    },
    "links": {
      "tienda": "Loja",
      "suscripciones": "Assinaturas",
      "garantia": "Garantia",
      "contacto": "Fale conosco",
      "faq": "Perguntas frequentes",
      "reembolso": "Solicitar reembolso",
      "nosotros": "Sobre nós",
      "porQue": "Por que adesivos?",
      "suscribeteAhorra": "Assine e economize",
      "privacidad": "Política de Privacidade",
      "terminos": "Termos e Condições"
    },
    "newsletter": {
      "label": "Novidades e ofertas",
      "placeholder": "seu@email.com",
      "button": "Assinar",
      "success": "Obrigado por se inscrever!"
    },
    "social": { "followUs": "Siga-nos" },
    "selectCountry": "País",
    "markets": {
      "mx": "México", "br": "Brasil", "ar": "Argentina", "cl": "Chile", "co": "Colômbia"
    },
    "copyright": "© {year} Novapatch. Todos os direitos reservados.",
    "tagline": "Bem-estar que não interrompe o seu dia"
  },
  "home": {
    "hero": {
      "badge": "Tecnologia transdérmica",
      "title": "Vitaminas que realmente se absorvem",
      "subtitle": "Adesivos inteligentes de alta absorção transdérmica, sem comprimidos nem rellenos.",
      "cta": "Ver produtos",
      "ctaSecondary": "Como funciona?"
    },
    "howItWorks": {
      "badge": "Simples assim",
      "title": "Como funciona",
      "step1Title": "Escolha seu adesivo",
      "step1Desc": "Selecione a combinação que seu corpo precisa.",
      "step2Title": "Aplique",
      "step2Desc": "Cole o adesivo em qualquer área limpa e seca.",
      "step3Title": "Pronto",
      "step3Desc": "Absorção constante por 8 horas. Sem interrupções."
    },
    "absorption": {
      "badge": "A ciência por trás",
      "title": "Absorção direta na corrente sanguínea",
      "subtitle": "Os comprimidos perdem até 85% dos nutrientes no processo digestivo. Os adesivos transdérmicos os entregam diretamente onde são necessários.",
      "stat1Value": "85%",
      "stat1Label": "Maior biodisponibilidade",
      "stat2Value": "8h",
      "stat2Label": "Liberação sustentada",
      "stat3Value": "0",
      "stat3Label": "Efeitos digestivos"
    },
    "comparison": {
      "badge": "Comparativo",
      "title": "Novapatch vs. suplementos tradicionais",
      "colNovapatch": "Novapatch",
      "colTraditional": "Comprimidos / Cápsulas"
    },
    "testimonials": { "badge": "O que dizem", "title": "Milhares já sentem" },
    "cta": {
      "title": "Assine e economize até 20%",
      "subtitle": "Escolha a frequência que melhor se adapta ao seu ritmo.",
      "button": "Ver planos"
    },
    "faq": { "badge": "Perguntas frequentes", "title": "Tudo que você precisa saber" }
  },
  "checkout": {
    "paymentMethods": {
      "title": "Forma de pagamento",
      "description": "Pague com PIX, boleto ou cartão de crédito/débito"
    }
  },
  "legal": {
    "badge": "Legal",
    "lastUpdated": "Última atualização: janeiro de 2025 · Lei aplicável: Brasil",
    "contactTitle": "Tem alguma dúvida legal?",
    "contactSubtitle": "Entre em contato a qualquer momento.",
    "terms": { "title": "Termos e Condições" },
    "privacy": { "title": "Política de Privacidade" },
    "refund": { "title": "Política de Reembolso" },
    "warranty": { "title": "Garantia" }
  },
  "meta": {
    "currency": "BRL",
    "currencySymbol": "R$",
    "locale": "pt-BR",
    "country": "Brasil",
    "taxLabel": "ICMS",
    "paymentProvider": "mercadopago",
    "supportEmail": "suporte@novapatch.com.br"
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add messages/
git commit -m "feat(i18n): add translation files for all 5 locales"
```

---

## Task 9: Move pages under `[locale]/`

**Files:** All pages listed in the "Moved files" section of the file map above.

- [ ] **Step 1: Create the `[locale]` subdirectory structure and move pages**

```bash
# Run from apps/storefront/
mkdir -p app/\[locale\]/sign-in/\[\[...sign-in\]\]
mkdir -p app/\[locale\]/sign-up/\[\[...sign-up\]\]
mkdir -p app/\[locale\]/cuenta
mkdir -p app/\[locale\]/checkout/cart
mkdir -p app/\[locale\]/tienda
mkdir -p app/\[locale\]/suscripciones
mkdir -p app/\[locale\]/nosotros
mkdir -p app/\[locale\]/faq
mkdir -p app/\[locale\]/garantia
mkdir -p app/\[locale\]/reembolso
mkdir -p app/\[locale\]/contacto
mkdir -p app/\[locale\]/privacidad
mkdir -p app/\[locale\]/terminos

# Move all pages
cp app/page.tsx app/\[locale\]/page.tsx
cp app/tienda/page.tsx app/\[locale\]/tienda/page.tsx
cp app/suscripciones/page.tsx app/\[locale\]/suscripciones/page.tsx
cp app/nosotros/page.tsx app/\[locale\]/nosotros/page.tsx
cp app/faq/page.tsx app/\[locale\]/faq/page.tsx
cp app/garantia/page.tsx app/\[locale\]/garantia/page.tsx
cp app/reembolso/page.tsx app/\[locale\]/reembolso/page.tsx
cp app/contacto/page.tsx app/\[locale\]/contacto/page.tsx
cp app/privacidad/page.tsx app/\[locale\]/privacidad/page.tsx
cp app/terminos/page.tsx app/\[locale\]/terminos/page.tsx
cp app/sign-in/\[\[...sign-in\]\]/page.tsx app/\[locale\]/sign-in/\[\[...sign-in\]\]/page.tsx
cp app/sign-up/\[\[...sign-up\]\]/page.tsx app/\[locale\]/sign-up/\[\[...sign-up\]\]/page.tsx
cp app/cuenta/layout.tsx app/\[locale\]/cuenta/layout.tsx
cp app/cuenta/page.tsx app/\[locale\]/cuenta/page.tsx
cp app/cuenta/suscripciones/page.tsx app/\[locale\]/cuenta/suscripciones/page.tsx
cp app/checkout/page.tsx app/\[locale\]/checkout/page.tsx
cp app/checkout/cart/page.tsx app/\[locale\]/checkout/cart/page.tsx
```

- [ ] **Step 2: Delete old root pages**

```bash
rm -rf app/page.tsx app/tienda app/suscripciones app/nosotros app/faq \
       app/garantia app/reembolso app/contacto app/privacidad app/terminos \
       app/sign-in app/sign-up app/cuenta app/checkout
```

- [ ] **Step 3: Verify dev server starts**

```bash
pnpm run dev 2>&1 | head -30
```

Expected: Server starts on port 3000. Navigation to `http://localhost:3000` should redirect to `http://localhost:3000/mx`.

- [ ] **Step 4: Commit**

```bash
git add app/
git commit -m "feat(i18n): move all pages under [locale]/ segment"
```

---

## Task 10: Update Navbar with locale-aware links and translations

**Files:**
- Modify: `components/Navbar.tsx`

- [ ] **Step 1: Read the current `components/Navbar.tsx`**

Read the full file before modifying.

- [ ] **Step 2: Replace `next/link` imports with locale-aware Link**

Find every occurrence of:
```typescript
import Link from 'next/link'
```
Replace with:
```typescript
import { Link } from '@/lib/i18n-navigation'
```

- [ ] **Step 3: Add `useTranslations` and replace hardcoded nav strings**

In the Navbar component (it must be a Client Component — add `"use client"` if not already present), add:

```typescript
import { useTranslations } from 'next-intl'
```

Inside the component function, add:
```typescript
const t = useTranslations('nav')
```

Then replace each hardcoded nav label with its translation key, for example:
- `"Tienda"` → `{t('tienda')}`
- `"Suscripciones"` → `{t('suscripciones')}`
- `"Nosotros"` → `{t('nosotros')}`
- `"Mi Cuenta"` → `{t('cuenta')}`
- `"Iniciar sesión"` → `{t('signIn')}`
- `"Registrarse"` → `{t('signUp')}`

All `href` values stay as-is (e.g., `href="/tienda"`) — the locale-aware `Link` component automatically prepends the current locale.

- [ ] **Step 4: Verify Navbar renders correctly**

Start dev server if not running: `pnpm run dev`

Navigate to `http://localhost:3000/mx` — verify Navbar links appear and navigate to `/mx/tienda`, `/mx/suscripciones`, etc.

Navigate to `http://localhost:3000/br` — verify Navbar shows "Loja", "Assinaturas", "Sobre nós".

- [ ] **Step 5: Commit**

```bash
git add components/Navbar.tsx
git commit -m "feat(i18n): update Navbar with locale-aware links and translations"
```

---

## Task 11: Create `CountrySelector` and update Footer

**Files:**
- Create: `components/CountrySelector.tsx`
- Modify: `components/Footer.tsx`

- [ ] **Step 1: Create `components/CountrySelector.tsx`**

```typescript
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
```

- [ ] **Step 2: Read current `components/Footer.tsx`**

Read the full file before modifying.

- [ ] **Step 3: Update Footer**

Add these imports at the top of `components/Footer.tsx`:

```typescript
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import { Link } from '@/lib/i18n-navigation'
import CountrySelector from '@/components/CountrySelector'
import type { Locale } from '@/i18n/routing'
```

Inside the Footer component function, add:
```typescript
const t = useTranslations('footer')
const locale = useLocale() as Locale
```

Replace all hardcoded `next/link` `<Link>` with the locale-aware `<Link>` from `@/lib/i18n-navigation`.

Replace each hardcoded link label with translation calls, for example:
- `"Tienda"` → `{t('links.tienda')}`
- `"Suscripciones"` → `{t('links.suscripciones')}`
- (etc. for all footer links)

Replace the hardcoded section headings:
- `"Comprar"` → `{t('sections.comprar')}`
- `"Ayuda"` → `{t('sections.ayuda')}`
- `"Nosotros"` → `{t('sections.nosotros')}`
- `"Legal"` → `{t('sections.legal')}`

Replace newsletter strings:
- Placeholder `"tu@correo.com"` → `{t('newsletter.placeholder')}`
- Button `"Suscribirse"` → `{t('newsletter.button')}`
- Success `"¡Gracias por suscribirte! 🎉"` → `{t('newsletter.success')}`

Add `CountrySelector` at the bottom of the footer, just above the copyright line:
```tsx
<CountrySelector currentLocale={locale} />
```

Replace copyright with:
```tsx
{t('copyright', { year: new Date().getFullYear() })}
```

- [ ] **Step 4: Verify Footer renders correctly**

Navigate to `http://localhost:3000/br` — verify Footer shows Portuguese labels and the country selector shows Brasil as selected. Switch to Argentina and verify redirect to `/ar/`.

- [ ] **Step 5: Commit**

```bash
git add components/CountrySelector.tsx components/Footer.tsx
git commit -m "feat(i18n): add CountrySelector and update Footer with translations"
```

---

## Task 12: Update home page section components

**Files:**
- Modify: `components/home/HeroWithBar.tsx`
- Modify: `components/home/HowItWorks.tsx`
- Modify: `components/home/AbsorptionSection.tsx`
- Modify: `components/home/ComparisonTable.tsx`
- Modify: `components/home/CTABanner.tsx`
- Modify: `components/home/HomeFAQ.tsx`

For each component, the pattern is identical:

1. Read the file
2. Add `import { useTranslations } from 'next-intl'` (for Client Components) or `import { getTranslations } from 'next-intl/server'` (for Server Components)
3. Call `const t = useTranslations('home.<section>')` or `const t = await getTranslations('home.<section>')`
4. Replace every hardcoded string with the corresponding translation key from `messages/es-MX.json`

- [ ] **Step 1: Update `HeroWithBar.tsx`**

Read the file. Add `useTranslations('home.hero')`. Replace:
- Badge text → `{t('badge')}`
- Title → `{t('title')}`
- Subtitle → `{t('subtitle')}`
- Primary CTA button → `{t('cta')}`
- Secondary CTA → `{t('ctaSecondary')}`

- [ ] **Step 2: Update `HowItWorks.tsx`**

Read the file. Add `useTranslations('home.howItWorks')`. Replace:
- Badge → `{t('badge')}`
- Title → `{t('title')}`
- Step 1 title/desc → `{t('step1Title')}`, `{t('step1Desc')}`
- Step 2 title/desc → `{t('step2Title')}`, `{t('step2Desc')}`
- Step 3 title/desc → `{t('step3Title')}`, `{t('step3Desc')}`

- [ ] **Step 3: Update `AbsorptionSection.tsx`**

Read the file. Add `useTranslations('home.absorption')`. Replace all strings with corresponding keys from `home.absorption` in `es-MX.json`.

- [ ] **Step 4: Update `ComparisonTable.tsx`**

Read the file. Add `useTranslations('home.comparison')`. Replace badge, title, column headers with translation keys.

- [ ] **Step 5: Update `CTABanner.tsx`**

Read the file. Add `useTranslations('home.cta')`. Replace title, subtitle, button text.

- [ ] **Step 6: Update `HomeFAQ.tsx`**

Read the file. Add `useTranslations('home.faq')`. Replace badge and title. Note: FAQ question/answer content should also be added to the messages file under `home.faq.items` as an array, or kept as static data per locale if the content differs significantly between markets.

- [ ] **Step 7: Verify home page at `/br`**

Navigate to `http://localhost:3000/br` — verify all home page sections render in Portuguese.

- [ ] **Step 8: Commit**

```bash
git add components/home/
git commit -m "feat(i18n): update home page sections with translations"
```

---

## Task 13: Create MDX legal pages

**Files:**
- Create: all 20 MDX files under `content/legal/`

Legal page MDX content uses a shared structure. Content is in the applicable country's language.

- [ ] **Step 1: Create `content/legal/mx/terminos.mdx`**

Migrate the existing content from the `sections` array in `app/terminos/page.tsx` into MDX format:

```mdx
## 1. Aceptación de los Términos

Al acceder y utilizar novapatch.care, usted acepta estos Términos y Condiciones en su totalidad. Si no está de acuerdo con alguna parte, le pedimos no utilizar nuestros servicios.

## 2. Productos y Precios

Todos los productos están sujetos a disponibilidad. Los precios están expresados en Pesos Mexicanos (MXN) e incluyen IVA (16%). NovaPatch se reserva el derecho de modificar precios sin previo aviso. El precio aplicable es el vigente al momento de confirmar la compra.

## 3. Suscripciones

Al adquirir una suscripción usted autoriza a NovaPatch a realizar cobros automáticos recurrentes según la frecuencia elegida (mensual, bimestral o trimestral) al método de pago registrado.

- Puede cancelar su suscripción en cualquier momento desde su cuenta, sin penalidades
- Los cambios de frecuencia aplican a partir del siguiente ciclo de facturación
- NovaPatch no se hace responsable por rechazos bancarios que interrumpan el servicio

## 4. Pagos

Los pagos son procesados de forma segura por Openpay. Métodos aceptados: tarjeta de crédito y débito (Visa, Mastercard, American Express), SPEI y efectivo en tiendas OXXO (solo compras únicas).

## 5. Envíos y Entregas

Los pedidos se procesan en días hábiles. Los tiempos de entrega son estimados y pueden variar por circunstancias externas.

## 6. Garantía de Satisfacción

Ofrecemos 30 días de garantía de satisfacción aplicable al primer pedido por cliente. Solo aplica al primer pedido; la solicitud debe realizarse dentro de los 30 días naturales de recibido.

## 7. Propiedad Intelectual

Todo el contenido de novapatch.care es propiedad exclusiva de NovaPatch o sus licenciantes. Queda prohibida su reproducción sin autorización escrita.

## 8. Limitación de Responsabilidad

Los parches vitamínicos de NovaPatch son suplementos de bienestar general y no son medicamentos. No están destinados a diagnosticar, tratar, curar ni prevenir enfermedades.

## 9. Ley Aplicable

Estos Términos se rigen por las leyes de los Estados Unidos Mexicanos. Cualquier controversia será sometida a los tribunales de la Ciudad de México.
```

- [ ] **Step 2: Create `content/legal/mx/privacidad.mdx`**

Migrate existing content from `app/privacidad/page.tsx` into MDX format following the same pattern.

- [ ] **Step 3: Create `content/legal/mx/reembolso.mdx`**

Migrate existing content from `app/reembolso/page.tsx`.

- [ ] **Step 4: Create `content/legal/mx/garantia.mdx`**

Migrate existing content from `app/garantia/page.tsx`.

- [ ] **Step 5: Create placeholder MDX files for other markets**

For each of `br`, `ar`, `cl`, `co` — create placeholder files for all 4 legal pages. These will be filled in by the legal team. Use this template (in the appropriate language):

All locales use the **same Spanish filenames** (`terminos.mdx`, `privacidad.mdx`, `reembolso.mdx`, `garantia.mdx`) regardless of language — the content inside is in the correct language. This avoids per-locale filename maps in the page components.

For `content/legal/br/terminos.mdx`:
```mdx
## Termos e Condições

_Conteúdo em elaboração pela equipe jurídica. Sujeito a atualização._

Para dúvidas, entre em contato: suporte@novapatch.com.br
```

For `content/legal/ar/terminos.mdx`:
```mdx
## Términos y Condiciones

_Contenido en elaboración por el equipo legal. Sujeto a actualización._

Para consultas: soporte@novapatch.com.ar
```

Create equivalent placeholders for `cl` and `co` with their respective support emails.

- [ ] **Step 6: Commit**

```bash
git add content/
git commit -m "feat(i18n): add MDX legal content for all markets"
```

---

## Task 14: Update legal page components to load MDX

**Files:**
- Modify: `app/[locale]/terminos/page.tsx`
- Modify: `app/[locale]/privacidad/page.tsx`
- Modify: `app/[locale]/reembolso/page.tsx`
- Modify: `app/[locale]/garantia/page.tsx`

The pattern is identical for all 4 legal pages. Shown here for `terminos/page.tsx`; repeat for the others.

- [ ] **Step 1: Update `app/[locale]/terminos/page.tsx`**

Replace the entire contents of the file:

```typescript
// apps/storefront/app/[locale]/terminos/page.tsx
import { readFile } from 'fs/promises'
import path from 'path'
import { notFound } from 'next/navigation'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { getTranslations } from 'next-intl/server'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { MARKETS } from '@/lib/markets'
import type { Locale } from '@/i18n/routing'

export default async function TerminosPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const t = await getTranslations('legal')
  const market = MARKETS[locale as Locale]

  let source: string
  try {
    const filePath = path.join(process.cwd(), 'content/legal', locale, 'terminos.mdx')
    source = await readFile(filePath, 'utf-8')
  } catch {
    notFound()
  }

  return (
    <>
      <Navbar lightBg />
      <main>
        <section className="pt-32 pb-16 px-6 text-center" style={{ background: '#FEF7ED' }}>
          <div className="max-w-2xl mx-auto">
            <p className="text-[#3CBFAB] font-semibold text-sm uppercase tracking-widest mb-4">
              {t('badge')}
            </p>
            <h1 className="text-5xl lg:text-6xl font-bold text-[#005088] mb-4">
              {t('terms.title')}
            </h1>
            <p className="text-[#6B7280] text-sm">{t('lastUpdated')}</p>
          </div>
        </section>

        <section className="py-16 px-6 bg-[#FAF7F2]">
          <div className="max-w-3xl mx-auto">
            <div className="prose prose-lg prose-headings:text-[#005088] prose-p:text-[#6B7280] prose-li:text-[#6B7280] max-w-none">
              <MDXRemote source={source} />
            </div>

            <div className="mt-12 bg-[#F8EDEB] rounded-3xl p-8 border border-[#005088]/15">
              <h3 className="text-lg font-bold text-[#005088] mb-2">{t('contactTitle')}</h3>
              <p className="text-[#6B7280] mb-4">{t('contactSubtitle')}</p>
              <a
                href={`mailto:${market.supportEmail}`}
                className="text-[#3CBFAB] font-semibold hover:underline"
              >
                {market.supportEmail}
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Repeat for `privacidad/page.tsx`**

Same pattern. Change:
- `terminos.mdx` → `privacidad.mdx`
- `t('terms.title')` → `t('privacy.title')`

All locales use `privacidad.mdx` (same filename, content in the market's language).

- [ ] **Step 3: Repeat for `reembolso/page.tsx`**

Same pattern. `t('refund.title')`.

- [ ] **Step 4: Repeat for `garantia/page.tsx`**

Same pattern. `t('warranty.title')`.

- [ ] **Step 5: Verify legal pages load**

Navigate to `http://localhost:3000/mx/terminos` — verify MDX content renders.
Navigate to `http://localhost:3000/br/termos` — note: this URL won't work yet since the route is still `/terminos`. The Brazilian page URL is still `/br/terminos` — the MDX file for Brazil is `termos.mdx` but the route slug is `terminos` (same across all locales). This is by design.

Navigate to `http://localhost:3000/br/terminos` — verify Brazilian placeholder content renders in Portuguese.

- [ ] **Step 6: Commit**

```bash
git add app/\[locale\]/terminos app/\[locale\]/privacidad app/\[locale\]/reembolso app/\[locale\]/garantia
git commit -m "feat(i18n): update legal pages to load MDX content dynamically"
```

---

## Task 15: Final verification and cleanup

- [ ] **Step 1: Run TypeScript check**

```bash
pnpm run build 2>&1 | grep -E "error TS" | head -30
```

Fix any TypeScript errors. Common issues:
- Import paths referencing old `app/*/page` that no longer exist
- Missing locale param in page components that need to call `getTranslations`

- [ ] **Step 2: Verify all market routes**

With dev server running, verify:
- `http://localhost:3000` → redirects to `/mx` ✓
- `http://localhost:3000/mx` → loads in Spanish ✓
- `http://localhost:3000/br` → loads in Portuguese ✓
- `http://localhost:3000/ar` → loads in Argentine Spanish ✓
- `http://localhost:3000/mx/tienda` → works ✓
- `http://localhost:3000/br/tienda` → works (shows "Loja" in nav) ✓
- `http://localhost:3000/mx/terminos` → MDX renders ✓
- `http://localhost:3000/br/terminos` → Portuguese placeholder renders ✓
- Country selector in footer switches market ✓

- [ ] **Step 3: Production build check**

```bash
pnpm run build
```

Expected: Build completes without errors. All 5 locale routes generate static params.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "feat(i18n): multi-market i18n complete — mx, br, ar, cl, co"
```
