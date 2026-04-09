# Sentry Storefront — Design Spec

| Campo | Valor |
|---|---|
| Fecha | 2026-04-09 |
| Scope | `apps/storefront/` únicamente (backend Medusa fuera de alcance) |
| Enfoque | Manual completo — sin wizard de Sentry CLI |
| Deploy | Vercel (source maps automáticos vía `withSentryConfig`) |
| Alertas | Fuera de alcance — se configuran manualmente en el dashboard |

---

## 1. Objetivo

Instrumentar Sentry en el storefront de Novapatch para detectar errores en producción antes de que los clientes los reporten. Sin Sentry, un error en el checkout o en la autenticación puede perderse indefinidamente.

---

## 2. Archivos a crear

| Archivo | Responsabilidad |
|---|---|
| `sentry.client.config.ts` | Init de Sentry para el browser. Session Replay + filtro de extensiones. |
| `sentry.server.config.ts` | Init para SSR y Server Components. |
| `sentry.edge.config.ts` | Init para Edge runtime. Sin tracing (costo innecesario). |
| `app/global-error.tsx` | Error boundary del layout raíz. Captura errores por encima del locale layout. |
| `hooks/use-sentry-identity.ts` | Identifica al usuario Clerk en Sentry al hacer login/logout. |

---

## 3. Archivos a modificar

| Archivo | Cambio |
|---|---|
| `next.config.js` | Componer `withSentryConfig(withNextIntl(nextConfig), opts)` |
| `app/error.tsx` | Añadir `Sentry.captureException(error)` al `useEffect` existente |
| `app/[locale]/error.tsx` | Igual que arriba |
| `app/[locale]/layout.tsx` | Llamar `useSentryIdentity()` dentro del layout (dentro del ClerkProvider) |

---

## 4. Diseño detallado

### 4.1 `sentry.client.config.ts`

```ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      maskAllInputs: true,   // PCI compliance — campos de pago y contraseñas
      blockAllMedia: false,
    }),
  ],
  enabled: process.env.NODE_ENV !== 'development',
  beforeSend(event) {
    // Filtrar ruido de extensiones de browser — no son errores nuestros
    const frames = event.exception?.values?.[0]?.stacktrace?.frames
    if (frames?.some(f =>
      f.filename?.includes('chrome-extension') ||
      f.filename?.includes('moz-extension')
    )) return null
    return event
  },
})
```

### 4.2 `sentry.server.config.ts`

```ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT,
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  enabled: process.env.NODE_ENV !== 'development',
})
```

### 4.3 `sentry.edge.config.ts`

```ts
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.SENTRY_ENVIRONMENT,
  tracesSampleRate: 0,  // Edge: sin tracing por costo
  enabled: process.env.NODE_ENV !== 'development',
})
```

### 4.4 `next.config.js` — composición de plugins

```js
const createNextIntlPlugin = require('next-intl/plugin')
const { withSentryConfig } = require('@sentry/nextjs')

const withNextIntl = createNextIntlPlugin('./i18n/request.ts')

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img.clerk.com' },
    ],
  },
}

module.exports = withSentryConfig(
  withNextIntl(nextConfig),
  {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    silent: true,              // sin spam en CI
    widenClientFileUpload: true,
    hideSourceMaps: true,      // no exponer source maps al browser
    disableLogger: true,
  }
)
```

El orden de composición importa: Sentry wrappea el resultado de next-intl, no al revés.

### 4.5 `app/global-error.tsx`

Reemplaza el layout raíz completo cuando hay un error en él — necesita su propia estructura `<html><body>`. No puede usar `useSentryIdentity` porque está fuera del `ClerkProvider`.

```tsx
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
    <html>
      <body>
        {/* Reusar la UI de error existente en app/error.tsx */}
        {/* o una versión mínima si el layout está roto */}
      </body>
    </html>
  )
}
```

La UI visual de `global-error.tsx` debe ser una versión mínima (sin depender de fuentes ni CSS del layout) porque el layout raíz puede estar completamente roto.

### 4.6 `app/error.tsx` y `app/[locale]/error.tsx` — modificación

Ambos ya tienen `console.error(error)` en un `useEffect`. Solo hay que añadir:

```ts
import * as Sentry from '@sentry/nextjs'

// En el useEffect existente:
useEffect(() => {
  console.error(error)
  Sentry.captureException(error)  // ← esta línea
}, [error])
```

### 4.7 `hooks/use-sentry-identity.ts`

```ts
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
      Sentry.setUser(null)
    }
  }, [user, isLoaded])
}
```

Se llama en `app/[locale]/layout.tsx` como un Client Component wrapper, ya que el layout del locale es actualmente un Server Component. Se crea un pequeño componente client `<SentryIdentity />` que llama el hook internamente y se monta dentro del `ClerkProvider`.

### 4.8 Integración en `app/[locale]/layout.tsx`

```tsx
// Nuevo archivo: components/SentryIdentity.tsx
'use client'
import { useSentryIdentity } from '@/hooks/use-sentry-identity'
export function SentryIdentity() {
  useSentryIdentity()
  return null
}

// En app/[locale]/layout.tsx (dentro de <ClerkProvider>):
<ClerkProvider ...>
  <SentryIdentity />  {/* ← nuevo */}
  <CartProvider>
    {children}
    <CartDrawer />
  </CartProvider>
  ...
</ClerkProvider>
```

---

## 5. Variables de entorno

### `.env.local` (desarrollo — nunca commiteado)

```bash
NEXT_PUBLIC_SENTRY_DSN=           # DSN del proyecto en Sentry
NEXT_PUBLIC_SENTRY_ENVIRONMENT=development
```

### Vercel — variables de producción

```bash
NEXT_PUBLIC_SENTRY_DSN=           # mismo DSN
NEXT_PUBLIC_SENTRY_ENVIRONMENT=production
SENTRY_ENVIRONMENT=production
```

### Vercel — variables de build (para source maps)

```bash
SENTRY_AUTH_TOKEN=                # token con permisos project:write
SENTRY_ORG=novapatch
SENTRY_PROJECT=novapatch-storefront
```

`SENTRY_AUTH_TOKEN` solo se necesita en build time (Vercel lo usa al compilar para subir source maps). No va en runtime.

---

## 6. Source maps

`withSentryConfig` sube source maps automáticamente en cada build de Vercel y los elimina del bundle público (`hideSourceMaps: true`). No requiere pasos manuales en CI.

Para que Sentry asocie errores a commits específicos (suspect commits), agregar en el pipeline de Vercel post-build:

```bash
npx sentry-cli releases new $VERCEL_GIT_COMMIT_SHA
npx sentry-cli releases set-commits $VERCEL_GIT_COMMIT_SHA --auto
npx sentry-cli releases finalize $VERCEL_GIT_COMMIT_SHA
```

Esto es opcional para el lanzamiento pero muy útil para debugging.

---

## 7. Fuera de alcance

- Backend Medusa (`@sentry/node`) — repo separado
- Alertas y reglas en el dashboard de Sentry — configuración manual
- Integración con Slack
- Captura manual de errores de negocio (Envia, Openpay) — segunda iteración
- Sentry releases / suspect commits — opcional post-launch

---

## 8. Pasos de setup manual (previos a la implementación)

1. Crear cuenta en sentry.io
2. Crear proyecto tipo **Next.js** — nombre: `novapatch-storefront`
3. Copiar el DSN del proyecto
4. Generar un Auth Token con scope `project:write` (Settings → Auth Tokens)
5. Añadir variables de entorno en Vercel (dashboard → Settings → Environment Variables)
