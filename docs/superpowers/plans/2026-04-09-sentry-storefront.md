# Sentry Storefront Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Instrumentar Sentry en el storefront de Novapatch para capturar errores en producción con contexto de usuario Clerk y source maps automáticos en Vercel.

**Architecture:** Tres archivos de config de Sentry (client/server/edge) + `withSentryConfig` compuesto con `withNextIntl` en `next.config.js`. Los error boundaries existentes se actualizan para reportar a Sentry. Un hook `useSentryIdentity` identifica al usuario Clerk en cada error.

**Tech Stack:** `@sentry/nextjs`, Next.js 15.2 App Router, Clerk (`useUser`), Vercel (source maps automáticos).

**Nota sobre tests:** El proyecto no tiene framework de testing configurado. En lugar de unit tests, cada tarea se verifica con `tsc --noEmit` y `pnpm run build`. La verificación final es un smoke test manual en staging.

**Todos los comandos se ejecutan desde `apps/storefront/`.**

---

## Estructura de archivos

| Acción | Archivo |
|---|---|
| Crear | `apps/storefront/sentry.client.config.ts` |
| Crear | `apps/storefront/sentry.server.config.ts` |
| Crear | `apps/storefront/sentry.edge.config.ts` |
| Modificar | `apps/storefront/next.config.js` |
| Crear | `apps/storefront/app/global-error.tsx` |
| Modificar | `apps/storefront/app/error.tsx` |
| Modificar | `apps/storefront/app/[locale]/error.tsx` |
| Crear | `apps/storefront/hooks/use-sentry-identity.ts` |
| Crear | `apps/storefront/components/SentryIdentity.tsx` |
| Modificar | `apps/storefront/app/[locale]/layout.tsx` |

---

## Task 1: Instalar `@sentry/nextjs`

**Files:**
- Modify: `apps/storefront/package.json`

- [ ] **Step 1: Instalar la dependencia**

```bash
pnpm add @sentry/nextjs
```

- [ ] **Step 2: Verificar que aparece en package.json**

```bash
cat package.json | grep sentry
```

Expected output:
```
"@sentry/nextjs": "^9.x.x",
```

- [ ] **Step 3: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: install @sentry/nextjs"
```

---

## Task 2: Crear `sentry.client.config.ts`

**Files:**
- Create: `apps/storefront/sentry.client.config.ts`

- [ ] **Step 1: Crear el archivo**

```ts
// apps/storefront/sentry.client.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,

  // 10% de transacciones en producción, 100% en staging para visibilidad completa
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Session Replay: 10% de sesiones normales, 100% de sesiones con error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      maskAllInputs: true,  // PCI compliance — oculta campos de pago y contraseñas
      blockAllMedia: false,
    }),
  ],

  enabled: process.env.NODE_ENV !== 'development',

  beforeSend(event) {
    // Filtrar errores de extensiones de browser — no son nuestros
    const frames = event.exception?.values?.[0]?.stacktrace?.frames
    if (frames?.some(f =>
      f.filename?.includes('chrome-extension') ||
      f.filename?.includes('moz-extension')
    )) return null
    return event
  },
})
```

- [ ] **Step 2: Verificar tipos**

```bash
pnpm exec tsc --noEmit
```

Expected: sin errores relacionados con Sentry.

- [ ] **Step 3: Commit**

```bash
git add sentry.client.config.ts
git commit -m "feat(sentry): add client config with Session Replay"
```

---

## Task 3: Crear `sentry.server.config.ts`

**Files:**
- Create: `apps/storefront/sentry.server.config.ts`

- [ ] **Step 1: Crear el archivo**

```ts
// apps/storefront/sentry.server.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  enabled: process.env.NODE_ENV !== 'development',
})
```

- [ ] **Step 2: Crear `sentry.edge.config.ts`**

```ts
// apps/storefront/sentry.edge.config.ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT,
  tracesSampleRate: 0,  // Edge: sin tracing por costo
  enabled: process.env.NODE_ENV !== 'development',
})
```

- [ ] **Step 3: Verificar tipos**

```bash
pnpm exec tsc --noEmit
```

Expected: sin errores.

- [ ] **Step 4: Commit**

```bash
git add sentry.server.config.ts sentry.edge.config.ts
git commit -m "feat(sentry): add server and edge configs"
```

---

## Task 4: Actualizar `next.config.js`

**Files:**
- Modify: `apps/storefront/next.config.js`

El archivo actual usa CommonJS y ya compone `withNextIntl`. Hay que encadenar `withSentryConfig` por encima.

- [ ] **Step 1: Reemplazar el contenido del archivo**

```js
// apps/storefront/next.config.js
const createNextIntlPlugin = require('next-intl/plugin')
const { withSentryConfig } = require('@sentry/nextjs')

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

module.exports = withSentryConfig(
  withNextIntl(nextConfig),
  {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    silent: true,             // sin spam en CI
    widenClientFileUpload: true,
    hideSourceMaps: true,     // no exponer source maps al browser
    disableLogger: true,
  }
)
```

- [ ] **Step 2: Verificar que el build funciona**

```bash
pnpm run build
```

Expected: build exitoso. Si falla con error de Sentry sobre `SENTRY_AUTH_TOKEN` durante el build, es esperado en local (solo se necesita en Vercel). El error de runtime no bloquea.

Si falla con error de módulo no encontrado, verificar que `pnpm add @sentry/nextjs` se ejecutó en Task 1.

- [ ] **Step 3: Commit**

```bash
git add next.config.js
git commit -m "feat(sentry): compose withSentryConfig in next.config.js"
```

---

## Task 5: Crear `app/global-error.tsx`

**Files:**
- Create: `apps/storefront/app/global-error.tsx`

Este boundary captura errores en el layout raíz (`app/layout.tsx`). No puede depender de fuentes de Google ni Tailwind porque el layout puede estar completamente roto. Usa estilos inline.

- [ ] **Step 1: Crear el archivo**

```tsx
// apps/storefront/app/global-error.tsx
'use client'
import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          background: '#FAF7F2',
          fontFamily: 'sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1 style={{ color: '#0D1B35', fontSize: '1.75rem', marginBottom: '0.75rem' }}>
            Algo salió mal
          </h1>
          <p style={{ color: '#4A5568', marginBottom: '1.5rem' }}>
            Ocurrió un error inesperado. Intenta recargar la página.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#E8503A',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            Reintentar
          </button>
          {error.digest && (
            <p style={{ color: '#9CA3AF', fontSize: '0.75rem', marginTop: '1rem', fontFamily: 'monospace' }}>
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Verificar tipos**

```bash
pnpm exec tsc --noEmit
```

Expected: sin errores.

- [ ] **Step 3: Commit**

```bash
git add app/global-error.tsx
git commit -m "feat(sentry): add global-error boundary with Sentry capture"
```

---

## Task 6: Actualizar error boundaries existentes

**Files:**
- Modify: `apps/storefront/app/error.tsx`
- Modify: `apps/storefront/app/[locale]/error.tsx`

- [ ] **Step 1: Actualizar `app/error.tsx`**

Añadir el import de Sentry y la captura en el `useEffect`:

```tsx
// apps/storefront/app/error.tsx
"use client";

import * as Sentry from '@sentry/nextjs'
import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
    Sentry.captureException(error)
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-32" style={{ background: "linear-gradient(160deg, #EAF5FB 0%, #FAF7F2 100%)" }}>
      <div className="max-w-lg text-center flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-[#E8503A]/12 flex items-center justify-center text-4xl">⚠️</div>

        <div>
          <h1 className="text-3xl font-bold text-[#0D1B35] mb-3">Algo salió mal</h1>
          <p className="text-[#0D1B35]/55 text-lg leading-relaxed">
            Ocurrió un error inesperado. Nuestro equipo ya fue notificado. Puedes intentar de nuevo o volver al inicio.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <button onClick={reset}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#E8503A] text-white font-semibold rounded-2xl hover:bg-[#C43B28] active:scale-95 transition-all duration-200 shadow-[0_4px_20px_rgba(232,80,58,0.3)]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13 2v4H9M3 14v-4h4M13 6A6 6 0 1 1 7 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Reintentar
          </button>
          <Link href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-[#0D1B35]/12 text-[#0D1B35] font-semibold rounded-2xl hover:border-[#E8503A]/30 hover:text-[#E8503A] active:scale-95 transition-all duration-200">
            Ir al inicio
          </Link>
        </div>

        {error.digest && (
          <p className="text-xs text-[#0D1B35]/25 font-mono">Error ID: {error.digest}</p>
        )}
      </div>
    </main>
  );
}
```

- [ ] **Step 2: Actualizar `app/[locale]/error.tsx`**

```tsx
// apps/storefront/app/[locale]/error.tsx
"use client";

import * as Sentry from '@sentry/nextjs'
import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
    Sentry.captureException(error)
  }, [error]);

  const params = useParams();
  const locale = (params?.locale as string) ?? "mx";

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-32" style={{ background: "linear-gradient(160deg, #EAF5FB 0%, #FAF7F2 100%)" }}>
      <div className="max-w-lg text-center flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-[#E8503A]/12 flex items-center justify-center text-4xl">⚠️</div>

        <div>
          <h1 className="text-3xl font-bold text-[#0D1B35] mb-3">Algo salió mal</h1>
          <p className="text-[#0D1B35]/55 text-lg leading-relaxed">
            Ocurrió un error inesperado. Nuestro equipo ya fue notificado. Puedes intentar de nuevo o volver al inicio.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#E8503A] text-white font-semibold rounded-2xl hover:bg-[#C43B28] active:scale-95 transition-all duration-200 shadow-[0_4px_20px_rgba(232,80,58,0.3)]"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13 2v4H9M3 14v-4h4M13 6A6 6 0 1 1 7 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Reintentar
          </button>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-[#0D1B35]/12 text-[#0D1B35] font-semibold rounded-2xl hover:border-[#E8503A]/30 hover:text-[#E8503A] active:scale-95 transition-all duration-200"
          >
            Ir al inicio
          </Link>
        </div>

        {error.digest && (
          <p className="text-xs text-[#0D1B35]/25 font-mono">Error ID: {error.digest}</p>
        )}
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Verificar tipos**

```bash
pnpm exec tsc --noEmit
```

Expected: sin errores.

- [ ] **Step 4: Commit**

```bash
git add app/error.tsx "app/[locale]/error.tsx"
git commit -m "feat(sentry): capture exceptions in error boundaries"
```

---

## Task 7: Crear `hooks/use-sentry-identity.ts`

**Files:**
- Create: `apps/storefront/hooks/use-sentry-identity.ts`

- [ ] **Step 1: Crear el hook**

```ts
// apps/storefront/hooks/use-sentry-identity.ts
'use client'
import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

export function useSentryIdentity() {
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (!isLoaded) return

    if (user) {
      Sentry.setUser({
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
      })
    } else {
      // Limpiar contexto de usuario al hacer logout
      Sentry.setUser(null)
    }
  }, [user, isLoaded])
}
```

- [ ] **Step 2: Verificar tipos**

```bash
pnpm exec tsc --noEmit
```

Expected: sin errores.

- [ ] **Step 3: Commit**

```bash
git add hooks/use-sentry-identity.ts
git commit -m "feat(sentry): add useSentryIdentity hook for Clerk integration"
```

---

## Task 8: Crear `components/SentryIdentity.tsx` e integrarlo en el layout

**Files:**
- Create: `apps/storefront/components/SentryIdentity.tsx`
- Modify: `apps/storefront/app/[locale]/layout.tsx`

`app/[locale]/layout.tsx` es un Server Component (async). El hook `useSentryIdentity` necesita ser Client Component. La solución es un wrapper de una línea que se monta dentro del `ClerkProvider`.

- [ ] **Step 1: Crear `components/SentryIdentity.tsx`**

```tsx
// apps/storefront/components/SentryIdentity.tsx
'use client'
import { useSentryIdentity } from '@/hooks/use-sentry-identity'

export function SentryIdentity() {
  useSentryIdentity()
  return null
}
```

- [ ] **Step 2: Actualizar `app/[locale]/layout.tsx`**

Añadir el import y montar `<SentryIdentity />` dentro del `ClerkProvider`, antes del `CartProvider`:

```tsx
// apps/storefront/app/[locale]/layout.tsx
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import Script from 'next/script'
import { ClerkProvider } from '@clerk/nextjs'
import { CartProvider } from '@/contexts/CartContext'
import CartDrawer from '@/components/CartDrawer'
import { SentryIdentity } from '@/components/SentryIdentity'
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
        <SentryIdentity />
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

- [ ] **Step 3: Verificar tipos**

```bash
pnpm exec tsc --noEmit
```

Expected: sin errores.

- [ ] **Step 4: Commit**

```bash
git add components/SentryIdentity.tsx "app/[locale]/layout.tsx"
git commit -m "feat(sentry): mount SentryIdentity in locale layout for Clerk user context"
```

---

## Task 9: Variables de entorno y verificación manual

**Files:**
- Create (local): `apps/storefront/.env.local` — añadir las variables nuevas

Este task requiere haber creado el proyecto en Sentry primero (sentry.io → New Project → Next.js → `novapatch-storefront`).

- [ ] **Step 1: Añadir variables a `.env.local`**

```bash
# Añadir al final de .env.local (no commitearlo)
NEXT_PUBLIC_SENTRY_DSN=https://<tu-dsn>@o<org>.ingest.sentry.io/<project-id>
NEXT_PUBLIC_SENTRY_ENVIRONMENT=development
```

El DSN lo encuentras en Sentry → Project Settings → Client Keys (DSN).

- [ ] **Step 2: Añadir variables al `.env.local` de ejemplo si existe, o documentarlo**

Verificar si existe un `.env.example` o `.env.local.example` en el repo:

```bash
ls .env* 2>/dev/null || echo "no env example file"
```

Si existe, añadir las variables (sin valores) para que otros desarrolladores sepan que existen.

- [ ] **Step 3: Verificar que el servidor arranca sin errores de Sentry**

```bash
pnpm run dev
```

Expected: servidor corriendo en `http://localhost:3000` sin errores de Sentry en consola. Es normal ver un warning de `NEXT_PUBLIC_SENTRY_DSN` si aún no tienes el DSN.

- [ ] **Step 4: Smoke test — verificar que Sentry recibe errores**

Con el servidor corriendo, abrir `http://localhost:3000` en el browser. Abrir la consola del browser y ejecutar:

```js
// En la consola del browser
throw new Error("Test Sentry - puede ignorarse")
```

Verificar en sentry.io → Issues que aparece el error con el stack trace.

**Nota:** Si `NODE_ENV=development` y `enabled: false`, el error NO llegará a Sentry. Para probar localmente, cambiar temporalmente `enabled: process.env.NODE_ENV !== 'development'` a `enabled: true` en `sentry.client.config.ts`, probar, y revertir.

- [ ] **Step 5: Configurar variables en Vercel**

En el dashboard de Vercel → Settings → Environment Variables, añadir:

| Variable | Entorno | Valor |
|---|---|---|
| `NEXT_PUBLIC_SENTRY_DSN` | Production, Preview | DSN del proyecto |
| `NEXT_PUBLIC_SENTRY_ENVIRONMENT` | Production | `production` |
| `NEXT_PUBLIC_SENTRY_ENVIRONMENT` | Preview | `staging` |
| `SENTRY_ENVIRONMENT` | Production | `production` |
| `SENTRY_AUTH_TOKEN` | Production, Preview | Token de Sentry (scope `project:write`) |
| `SENTRY_ORG` | Production, Preview | `novapatch` (o el slug de tu org) |
| `SENTRY_PROJECT` | Production, Preview | `novapatch-storefront` |

El `SENTRY_AUTH_TOKEN` se genera en Sentry → Settings → Auth Tokens → Create New Token → scope `project:write`.

- [ ] **Step 6: Commit final**

```bash
git add .
git commit -m "feat(sentry): complete storefront instrumentation"
```

---

## Verificación final en producción

Después de hacer deploy en Vercel:

1. Ir a la URL de producción
2. En la consola del browser, ejecutar: `Sentry.captureMessage('Test producción')`
3. Verificar en sentry.io que aparece el evento con `environment: production`
4. Verificar que el stack trace apunta a código fuente (no al bundle minificado) — esto confirma que los source maps subieron correctamente
