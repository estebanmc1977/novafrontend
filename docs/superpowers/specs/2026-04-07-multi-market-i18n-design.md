# Multi-Market i18n — Design Spec

**Date:** 2026-04-07
**Branch:** `feat/multi-market-i18n`
**Markets:** México (mx), Brasil (br), Argentina (ar), Chile (cl), Colombia (co)

---

## Overview

Expand the Novapatch storefront from a single Mexico-only market to five Latin American markets. Each market has its own URL prefix, language/locale, payment provider, currency, legal content, and regional configuration. The visual design is identical across all markets.

---

## 1. Routing Structure

All pages live under `app/[locale]/`. The locale segment is the market identifier: `mx`, `br`, `ar`, `cl`, `co`.

```
app/
  [locale]/
    layout.tsx                      ← configures next-intl + per-market metadata
    page.tsx                        ← main landing page
    tienda/page.tsx
    suscripciones/page.tsx
    nosotros/page.tsx
    faq/page.tsx
    garantia/page.tsx
    reembolso/page.tsx
    contacto/page.tsx
    privacidad/page.tsx
    terminos/page.tsx
    sign-in/[[...sign-in]]/page.tsx
    sign-up/[[...sign-up]]/page.tsx
    cuenta/
      layout.tsx
      page.tsx
      suscripciones/page.tsx
    checkout/
      page.tsx
      cart/page.tsx
  layout.tsx                        ← root layout (ClerkProvider, global scripts)
  not-found.tsx
  error.tsx

middleware.ts                       ← IP detection + redirect / → detected locale

messages/
  es-MX.json
  es-AR.json
  es-CL.json
  es-CO.json
  pt-BR.json

content/
  legal/
    mx/ terminos.mdx, privacidad.mdx, reembolso.mdx, garantia.mdx
    br/ termos.mdx, privacidade.mdx, reembolso.mdx, garantia.mdx
    ar/ terminos.mdx, privacidad.mdx, reembolso.mdx, garantia.mdx
    cl/ terminos.mdx, privacidad.mdx, reembolso.mdx, garantia.mdx
    co/ terminos.mdx, privacidad.mdx, reembolso.mdx, garantia.mdx

i18n/
  routing.ts                        ← defines locales and default locale
  request.ts                        ← configures next-intl for Server Components

lib/
  markets.ts                        ← per-market configuration object
```

API routes (`/api/copomex`, `/api/validate-address`, `/api/contact`) remain at the root — they do not require a locale prefix.

---

## 2. Translation Files

Each locale has a JSON file in `/messages/` with identical key structure. All UI copy, labels, and short strings live here.

```json
{
  "nav": {
    "tienda": "Tienda",
    "suscripciones": "Suscripciones",
    "nosotros": "Nosotros",
    "cuenta": "Mi Cuenta"
  },
  "home": {
    "hero": {
      "title": "...",
      "subtitle": "...",
      "cta": "..."
    },
    "howItWorks": {},
    "comparison": {},
    "testimonials": {},
    "cta": {},
    "faq": {}
  },
  "tienda": {},
  "suscripciones": {},
  "nosotros": {},
  "contacto": {},
  "cuenta": {},
  "checkout": {
    "paymentMethods": {
      "title": "...",
      "description": "..."
    }
  },
  "footer": {
    "selectCountry": "País",
    "markets": {
      "mx": "México",
      "br": "Brasil",
      "ar": "Argentina",
      "cl": "Chile",
      "co": "Colombia"
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

`es-AR.json`, `es-CL.json`, `es-CO.json` share the same key structure as `es-MX.json` with adjusted copy (regional expressions, country name, currency, support email). `pt-BR.json` is the full Portuguese translation.

Long-form legal content is **not** stored in JSON — see Section 5.

---

## 3. Middleware — IP Detection and Redirects

`middleware.ts` handles two responsibilities:

1. **Locale redirect for `/`:** Reads `x-vercel-ip-country` header (injected by Vercel Edge Network for free). Maps country code to locale:

   | IP Country | Redirect to |
   |---|---|
   | MX | /mx |
   | BR | /br |
   | AR | /ar |
   | CL | /cl |
   | CO | /co |
   | Any other | /mx (default) |

2. **Cookie persistence:** After detection or manual selection, the chosen locale is saved in a `NEXT_LOCALE` cookie. On subsequent requests, the cookie takes precedence over IP detection — this preserves a user's explicit market choice.

**Behavior details:**
- If a user manually navigates to `/br` from Mexico, `/br` is saved to the cookie and respected on future visits.
- `/api/*` routes and static assets (`/_next/*`, `/favicon.ico`, etc.) are excluded from middleware.
- In local development (no Vercel geo headers), middleware falls back to `mx`. Override with `NEXT_PUBLIC_DEFAULT_LOCALE` env var for testing other markets.

---

## 4. Per-Market Configuration (`lib/markets.ts`)

All structural differences between markets are centralized in a single typed config object:

```typescript
export const MARKETS = {
  mx: {
    locale: 'es-MX',
    currency: 'MXN',
    paymentProvider: 'openpay',
    clerkLocale: 'esMX',
    supportEmail: 'soporte@novapatch.mx',
    medusaRegionId: process.env.NEXT_PUBLIC_MEDUSA_REGION_MX,
    addressCountry: 'mx',
    taxLabel: 'IVA 16%',
  },
  br: {
    locale: 'pt-BR',
    currency: 'BRL',
    paymentProvider: 'mercadopago',
    clerkLocale: 'ptBR',
    supportEmail: 'suporte@novapatch.com.br',
    medusaRegionId: process.env.NEXT_PUBLIC_MEDUSA_REGION_BR,
    addressCountry: 'br',
    taxLabel: 'ICMS',
  },
  ar: {
    locale: 'es-AR',
    currency: 'ARS',
    paymentProvider: 'mercadopago',
    clerkLocale: 'esAR',
    supportEmail: 'soporte@novapatch.com.ar',
    medusaRegionId: process.env.NEXT_PUBLIC_MEDUSA_REGION_AR,
    addressCountry: 'ar',
    taxLabel: 'IVA 21%',
  },
  cl: {
    locale: 'es-CL',
    currency: 'CLP',
    paymentProvider: 'mercadopago',
    clerkLocale: 'esES',   // Clerk fallback — no es-CL available
    supportEmail: 'soporte@novapatch.cl',
    medusaRegionId: process.env.NEXT_PUBLIC_MEDUSA_REGION_CL,
    addressCountry: 'cl',
    taxLabel: 'IVA 19%',
  },
  co: {
    locale: 'es-CO',
    currency: 'COP',
    paymentProvider: 'mercadopago',
    clerkLocale: 'esES',   // Clerk fallback — no es-CO available
    supportEmail: 'soporte@novapatch.co',
    medusaRegionId: process.env.NEXT_PUBLIC_MEDUSA_REGION_CO,
    addressCountry: 'co',
    taxLabel: 'IVA 19%',
  },
} as const

export type Market = keyof typeof MARKETS
```

**Component impact:**

| Component | Change |
|---|---|
| `app/[locale]/layout.tsx` | Reads `MARKETS[locale]` to configure Clerk locale, page metadata, payment scripts |
| Checkout | Renders Openpay (mx) or MercadoPago (br/ar/cl/co) based on `paymentProvider` |
| Footer | Renders country selector; support email from `markets.ts` |
| `/api/copomex` | Only invoked for `mx`; other markets use Google Places only |
| Price display | `Intl.NumberFormat(locale, { style: 'currency', currency })` throughout |
| Clerk theme | `clerkLocale` passed to `ClerkProvider` in `[locale]/layout.tsx` |

---

## 5. Legal Pages (MDX per Market)

Legal pages (terms, privacy, refund policy, warranty) are long-form content that changes by country for regulatory reasons. They are stored as MDX files, not in translation JSON.

```
content/legal/
  mx/
    terminos.mdx
    privacidad.mdx
    reembolso.mdx
    garantia.mdx
  br/
    termos.mdx
    privacidade.mdx
    reembolso.mdx
    garantia.mdx
  ar/
    terminos.mdx
    privacidad.mdx
    reembolso.mdx
    garantia.mdx
  cl/
    terminos.mdx
    privacidad.mdx
    reembolso.mdx
    garantia.mdx
  co/
    terminos.mdx
    privacidad.mdx
    reembolso.mdx
    garantia.mdx
```

The page components (`app/[locale]/terminos/page.tsx`, etc.) dynamically import the MDX file for the current locale. The existing page layout/chrome (Navbar, Footer) remains unchanged — only the body content comes from MDX.

**Why MDX over JSON for legal content:**
- Legal texts are long (500–2000 words), hard to edit in JSON
- They change for legal/compliance reasons independently of marketing copy
- MDX files can be reviewed and edited directly by lawyers or legal teams without touching code

---

## 6. Country Selector (Footer)

A `<CountrySelector>` Client Component lives in the Footer. It displays the current market's flag and name, and on selection:

1. Updates the `NEXT_LOCALE` cookie to the new locale
2. Redirects to the same path in the new locale (e.g., `/mx/tienda` → `/br/tienda`)

The selector lists all 5 markets with their local names:
- México, Brasil, Argentina, Chile, Colombia

---

## 7. Locales Reference

| Market | URL prefix | Language | Currency | Payment |
|---|---|---|---|---|
| México | `/mx` | es-MX | MXN | Openpay |
| Brasil | `/br` | pt-BR | BRL | MercadoPago |
| Argentina | `/ar` | es-AR | ARS | MercadoPago |
| Chile | `/cl` | es-CL | CLP | MercadoPago |
| Colombia | `/co` | es-CO | COP | MercadoPago |

Root `/` → middleware detects IP → redirects to matching locale prefix.

---

## Out of Scope

- Medusa backend region configuration (handled separately)
- MercadoPago SDK integration (separate feature)
- Actual legal text content (placeholder MDX files will be created; content to be filled by legal team)
- SEO hreflang tags (can be added as a follow-up once routing is stable)
