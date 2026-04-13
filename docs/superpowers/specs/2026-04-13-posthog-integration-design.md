# PostHog Integration — Design Spec

**Date:** 2026-04-13
**Branch:** `feature/posthog-integration`
**Scope:** Core e-commerce analytics (pageviews, identity, cart events, checkout funnel entry/exit)

---

## 1. Objetivo

Integrar PostHog en el storefront de Novapatch para capturar pageviews, identificar usuarios autenticados, y trazar el funnel de compra: producto visto → carrito → checkout iniciado → orden completada.

### Fuera de alcance (primera iteración)
- Eventos de suscripción (`subscription_*`) — dependen de Medusa integrado al 100%
- Feature flags y A/B testing
- Pasos intermedios del checkout (`checkout_address_completed`, etc.)
- Integración backend (`posthog-node` en Medusa)

---

## 2. Arquitectura

### Patrón base: espejo de Sentry

El proyecto ya tiene Sentry integrado con un patrón claro. PostHog sigue exactamente el mismo patrón:

| Pieza | Sentry (existente) | PostHog (nuevo) |
|---|---|---|
| Init cliente | `instrumentation-client.ts` | mismo archivo |
| Identity hook | `hooks/use-sentry-identity.ts` | `hooks/use-posthog-identity.ts` |
| Client Component | `components/SentryIdentity.tsx` | `components/PostHogProvider.tsx` |
| Montaje | `app/[locale]/layout.tsx` | mismo archivo |

### Acceso al SDK

`posthog-js` expone un singleton global. Se importa directamente donde se necesita:
```ts
import posthog from 'posthog-js'
```
No se crea un Context ni una función wrapper en `lib/` — mismo approach que Sentry usa con `import * as Sentry from '@sentry/nextjs'`.

---

## 3. Archivos

### Nuevos (2)

**`hooks/use-posthog-identity.ts`**
- Hook client-side
- Depende de `useUser()` de Clerk
- Usuario autenticado → `posthog.identify(user.id, { email, name })`
- Logout → `posthog.reset()`

**`components/PostHogProvider.tsx`**
- Client Component (`'use client'`)
- Retorna `null` (no visual)
- Escucha `usePathname()` para disparar `posthog.capture('$pageview')` en cada navegación
- Llama `usePostHogIdentity()` internamente
- **No usa `useSearchParams`** — evita Suspense boundary requerido en Next.js 15

### Modificados (3)

**`instrumentation-client.ts`**
- Agregar init de PostHog junto al init de Sentry existente
- `capture_pageview: false` (manual vía `PostHogProvider`)
- `capture_pageleave: true`
- `ph.debug()` solo en `development`
- Guard: init solo si `NEXT_PUBLIC_POSTHOG_KEY` está definida

**`app/[locale]/layout.tsx`**
- Agregar `<PostHogProvider />` dentro de `<ClerkProvider>`, inmediatamente después de `<SentryIdentity />`

**`contexts/CartContext.tsx`**
- Agregar `posthog.capture()` en las 3 operaciones del carrito
- Guard `typeof window !== 'undefined'` antes de cada llamada

---

## 4. Eventos

### Pageview
| Evento | Disparado por | Propiedades |
|---|---|---|
| `$pageview` | `PostHogProvider` en cambio de `pathname` | PostHog defaults (`$current_url`, `$referrer`, etc.) |

### Identity
| Acción | Llamada PostHog |
|---|---|
| Usuario se autentica | `posthog.identify(userId, { email, name })` |
| Usuario hace logout | `posthog.reset()` |

### Carrito
| Evento | Disparado en | Propiedades |
|---|---|---|
| `add_to_cart` | `CartContext.addToCart()` | `product_id`, `variant_id`, `quantity`, `price` |
| `remove_from_cart` | `CartContext.removeItem()` | `product_id`, `variant_id` |
| `cart_quantity_updated` | `CartContext.updateQty()` | `product_id`, `quantity` |

### Checkout
| Evento | Disparado en | Propiedades |
|---|---|---|
| `checkout_started` | `useEffect` de entrada a `/[locale]/checkout` | `cart_total`, `item_count` |
| `order_completed` | Callback de éxito de Medusa en checkout | `order_id`, `cart_total`, `item_count` |

---

## 5. Variables de entorno

```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_xxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

Agregar a `.env.local` (local) y al panel de Vercel (producción/staging).

---

## 6. Manejo de errores y edge cases

### SSR / build time
`posthog-js` solo corre en el browser. Todas las llamadas directas a `posthog.capture()` fuera de hooks/componentes llevan guard:
```ts
if (typeof window !== 'undefined') posthog.capture(...)
```

### Key no definida
```ts
if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(...)
}
```
Permite que entornos sin la variable (contribuidores, CI sin secrets) funcionen sin errores.

### Init no completado
`posthog-js` encola eventos internamente antes de que `init()` complete. Los eventos no se pierden — no requiere manejo especial.

### Usuario anónimo → autenticado
`posthog.identify()` fusiona automáticamente la sesión anónima previa con la identidad del usuario. Comportamiento por defecto del SDK.

---

## 7. Instalación

```bash
# desde apps/storefront/
pnpm add posthog-js
```

No se instala `posthog-node` en esta iteración (requiere backend Medusa).

---

## 8. Checklist de implementación

- [ ] `pnpm add posthog-js`
- [ ] Agregar variables de entorno en `.env.local` y Vercel
- [ ] Modificar `instrumentation-client.ts`
- [ ] Crear `hooks/use-posthog-identity.ts`
- [ ] Crear `components/PostHogProvider.tsx`
- [ ] Modificar `app/[locale]/layout.tsx`
- [ ] Modificar `contexts/CartContext.tsx`
- [ ] Agregar `checkout_started` y `order_completed` en página de checkout
- [ ] Verificar eventos en PostHog dashboard (modo debug local)
