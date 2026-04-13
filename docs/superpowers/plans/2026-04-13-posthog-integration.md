# PostHog Integration Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Integrate PostHog analytics into the Novapatch storefront to track pageviews, identify authenticated users, and capture the core e-commerce funnel (add to cart, remove from cart, checkout started, order completed).

**Architecture:** Mirrors the existing Sentry integration pattern exactly — init in `instrumentation-client.ts`, a `PostHogProvider` Client Component mounted in `[locale]/layout.tsx` alongside `<SentryIdentity />`, and event calls in `CartContext` where all cart operations are already centralized.

**Tech Stack:** `posthog-js`, Next.js 15.2 App Router, Clerk (`useUser`), `usePathname` from `next/navigation`

---

## File Map

| File | Action | Responsibility |
|---|---|---|
| `instrumentation-client.ts` | Modify | Add `posthog.init()` alongside existing Sentry init |
| `hooks/use-posthog-identity.ts` | Create | Sync Clerk user → PostHog identify/reset |
| `components/PostHogProvider.tsx` | Create | Client Component: pageview tracking + identity |
| `app/[locale]/layout.tsx` | Modify | Mount `<PostHogProvider />` inside `<ClerkProvider>` |
| `contexts/CartContext.tsx` | Modify | Add cart events: `add_to_cart`, `remove_from_cart`, `cart_quantity_updated` |
| `app/[locale]/checkout/page.tsx` | Modify | Add `checkout_started` on mount, `order_completed` on success |

---

## Task 1: Install PostHog and configure env variables

**Files:**
- Modify: `apps/storefront/package.json` (via pnpm)
- Modify: `apps/storefront/.env.local`

- [ ] **Step 1: Install posthog-js**

From `apps/storefront/`:
```bash
pnpm add posthog-js
```

Expected output: `dependencies: + posthog-js X.X.X`

- [ ] **Step 2: Add env variables to .env.local**

Open `apps/storefront/.env.local` and add at the end:
```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_REPLACE_WITH_YOUR_KEY
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

Get the actual key from PostHog dashboard → Project Settings → Project API Key.

- [ ] **Step 3: Verify the dev server still starts**

```bash
pnpm run dev
```

Expected: server starts at `http://localhost:3000` with no errors.

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: install posthog-js"
```

(Do NOT commit `.env.local` — it's gitignored.)

---

## Task 2: Initialize PostHog in instrumentation-client.ts

**Files:**
- Modify: `apps/storefront/instrumentation-client.ts`

The current file only contains the Sentry init. PostHog init is appended after it, following the same conditional pattern Sentry uses (`enabled: process.env.NODE_ENV !== 'development'`).

- [ ] **Step 1: Replace the full contents of `instrumentation-client.ts`**

```ts
import * as Sentry from '@sentry/nextjs'
import posthog from 'posthog-js'

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

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart

// ── PostHog ──────────────────────────────────────────────────────────────────
if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? 'https://us.i.posthog.com',
    capture_pageview: false,   // pageviews manuales via PostHogProvider (respeta i18n routing)
    capture_pageleave: true,
    loaded: (ph) => {
      if (process.env.NODE_ENV === 'development') ph.debug()
    },
  })
}
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
pnpm run build 2>&1 | grep -E "error|Error" | head -20
```

Expected: no TypeScript errors related to `posthog-js`.

- [ ] **Step 3: Commit**

```bash
git add apps/storefront/instrumentation-client.ts
git commit -m "feat: initialize PostHog in instrumentation-client"
```

---

## Task 3: Create use-posthog-identity hook

**Files:**
- Create: `apps/storefront/hooks/use-posthog-identity.ts`

This is a direct mirror of `hooks/use-sentry-identity.ts` — same structure, same Clerk dependency, same effect pattern. Replaces `Sentry.setUser` with `posthog.identify` / `posthog.reset`.

- [ ] **Step 1: Create `hooks/use-posthog-identity.ts`**

```ts
// apps/storefront/hooks/use-posthog-identity.ts
'use client'
import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'
import posthog from 'posthog-js'

export function usePostHogIdentity() {
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (!isLoaded) return

    if (user) {
      posthog.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName ?? undefined,
      })
    } else {
      // Limpiar sesión al hacer logout — fusiona la sesión anónima automáticamente
      posthog.reset()
    }
  }, [user, isLoaded])
}
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
pnpm run build 2>&1 | grep -E "error TS" | head -10
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/storefront/hooks/use-posthog-identity.ts
git commit -m "feat: add use-posthog-identity hook"
```

---

## Task 4: Create PostHogProvider component

**Files:**
- Create: `apps/storefront/components/PostHogProvider.tsx`

This mirrors `SentryIdentity.tsx` but also adds pageview tracking via `usePathname`. Returns `null` — non-visual. No `useSearchParams` to avoid Next.js 15 Suspense requirements.

- [ ] **Step 1: Create `components/PostHogProvider.tsx`**

```tsx
// apps/storefront/components/PostHogProvider.tsx
'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import posthog from 'posthog-js'
import { usePostHogIdentity } from '@/hooks/use-posthog-identity'

export function PostHogProvider() {
  const pathname = usePathname()

  // Sync Clerk identity → PostHog on every auth state change
  usePostHogIdentity()

  // Manual pageview on every route change (capture_pageview: false in init)
  useEffect(() => {
    posthog.capture('$pageview', { $current_url: window.location.href })
  }, [pathname])

  return null
}
```

- [ ] **Step 2: Verify no TypeScript errors**

```bash
pnpm run build 2>&1 | grep -E "error TS" | head -10
```

Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add apps/storefront/components/PostHogProvider.tsx
git commit -m "feat: add PostHogProvider component with pageview tracking"
```

---

## Task 5: Mount PostHogProvider in locale layout

**Files:**
- Modify: `apps/storefront/app/[locale]/layout.tsx`

Add `<PostHogProvider />` immediately after `<SentryIdentity />` — same placement pattern.

- [ ] **Step 1: Add the import to `app/[locale]/layout.tsx`**

Find the existing import line:
```ts
import { SentryIdentity } from '@/components/SentryIdentity'
```

Replace it with:
```ts
import { SentryIdentity } from '@/components/SentryIdentity'
import { PostHogProvider } from '@/components/PostHogProvider'
```

- [ ] **Step 2: Add `<PostHogProvider />` in the JSX**

Find:
```tsx
        <SentryIdentity />
        <CartProvider>
```

Replace with:
```tsx
        <SentryIdentity />
        <PostHogProvider />
        <CartProvider>
```

- [ ] **Step 3: Verify the dev server renders correctly**

Start the dev server and open `http://localhost:3000`. Open the browser console. You should see PostHog debug logs like:
```
[PostHog.js] PostHog.capture - $pageview
```

(Debug mode is enabled in development via the `loaded` callback in Task 2.)

- [ ] **Step 4: Commit**

```bash
git add apps/storefront/app/\[locale\]/layout.tsx
git commit -m "feat: mount PostHogProvider in locale layout"
```

---

## Task 6: Add cart events in CartContext

**Files:**
- Modify: `apps/storefront/contexts/CartContext.tsx`

Add `posthog.capture()` calls in the three cart operations: `addToCart`, `updateQty`, `removeItem`. All calls are wrapped in `typeof window !== 'undefined'` since CartContext runs in both server and client contexts.

- [ ] **Step 1: Add the posthog import to `CartContext.tsx`**

Find the existing import block at the top of the file (after `"use client"`):
```ts
import { createContext, useContext, useState, useEffect, useCallback } from "react";
```

Add after it:
```ts
import posthog from "posthog-js";
```

- [ ] **Step 2: Replace the `addToCart` handler in the CartContext.Provider value**

Find:
```ts
        addToCart: (item) => {
          cartAdd(item);
          setIsOpen(true);
        },
```

Replace with:
```ts
        addToCart: (item) => {
          cartAdd(item);
          setIsOpen(true);
          if (typeof window !== "undefined") {
            posthog.capture("add_to_cart", {
              product_id: item.slug,
              variant_id: item.variantId ?? item.slug,
              quantity: item.quantity ?? 1,
              price: item.price,
              mode: item.mode,
              freq: item.freq,
            });
          }
        },
```

- [ ] **Step 3: Replace the `updateQty` handler**

Find:
```ts
        updateQty: (slug, mode, freq, delta) => {
          cartUpdateQty(slug, mode, freq, delta);
        },
```

Replace with:
```ts
        updateQty: (slug, mode, freq, delta) => {
          cartUpdateQty(slug, mode, freq, delta);
          if (typeof window !== "undefined") {
            posthog.capture("cart_quantity_updated", {
              product_id: slug,
              mode,
              freq,
              delta,
            });
          }
        },
```

- [ ] **Step 4: Replace the `removeItem` handler**

Find:
```ts
        removeItem: (slug, mode, freq) => {
          cartRemove(slug, mode, freq);
        },
```

Replace with:
```ts
        removeItem: (slug, mode, freq) => {
          cartRemove(slug, mode, freq);
          if (typeof window !== "undefined") {
            posthog.capture("remove_from_cart", {
              product_id: slug,
              mode,
              freq,
            });
          }
        },
```

- [ ] **Step 5: Manually test in the browser**

1. Start the dev server (`pnpm run dev`)
2. Add a product to the cart
3. Open the browser console — you should see:
   ```
   [PostHog.js] PostHog.capture - add_to_cart {"product_id": "...", ...}
   ```
4. Remove the item — expect `remove_from_cart` in the console

- [ ] **Step 6: Commit**

```bash
git add apps/storefront/contexts/CartContext.tsx
git commit -m "feat: add cart events to CartContext (add, remove, update)"
```

---

## Task 7: Add checkout_started and order_completed events

**Files:**
- Modify: `apps/storefront/app/[locale]/checkout/page.tsx`

Two targeted changes in the checkout page:
1. A `useEffect` that fires `checkout_started` once when the page mounts with items
2. Two `posthog.capture` calls at the success point (lines ~633–634 in the original)

- [ ] **Step 1: Add posthog import to checkout page**

The checkout page already imports from many libraries. Find the imports section at the top (around lines 1–15) and add:
```ts
import posthog from "posthog-js";
```

Place it after the existing library imports, before the local `@/` imports.

- [ ] **Step 2: Add `checkout_started` useEffect**

The checkout page already has several `useEffect` hooks. Add this one after the "Redirect if cart is empty" effect (which ends around line 412):

Find:
```ts
  // ── Pre-carga: ejecutar en paralelo al montar la página ──────
  useEffect(() => {
    if (!isLoaded || items.length === 0 || preloadStarted.current) return;
```

Add BEFORE that block:
```ts
  // ── Analytics: checkout_started ──────────────────────────────
  const checkoutTracked = useRef(false);
  useEffect(() => {
    if (!isLoaded || items.length === 0 || checkoutTracked.current) return;
    checkoutTracked.current = true;
    posthog.capture("checkout_started", {
      cart_total: finalTotal,
      item_count: items.reduce((sum, i) => sum + i.quantity, 0),
    });
  }, [isLoaded, items, finalTotal]);

```

Note: `finalTotal` and `items` are already defined above this point in the component.

- [ ] **Step 3: Add `order_completed` at the success point**

Find the success block (around lines 632–634):
```ts
      // ── Éxito ─────────────────────────────────────────────────────────────────
      clearCart();
      setSuccess(true);
```

Replace with:
```ts
      // ── Éxito ─────────────────────────────────────────────────────────────────
      posthog.capture("order_completed", {
        cart_total: finalTotal,
        item_count: items.reduce((sum, i) => sum + i.quantity, 0),
      });
      clearCart();
      setSuccess(true);
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
pnpm run build 2>&1 | grep -E "error TS" | head -10
```

Expected: no errors. If you see "Cannot find name 'checkoutTracked'" it means the `useRef` import is missing — `useRef` is already imported in this file (line 3).

- [ ] **Step 5: Commit**

```bash
git add "apps/storefront/app/[locale]/checkout/page.tsx"
git commit -m "feat: add checkout_started and order_completed PostHog events"
```

---

## Task 8: Full build verification

**Files:** none

- [ ] **Step 1: Run full production build**

From `apps/storefront/`:
```bash
pnpm run build
```

Expected: build completes successfully with no errors. Warnings about `posthog-js` dynamic imports are acceptable.

- [ ] **Step 2: Verify linting**

```bash
pnpm run lint
```

Expected: no errors. If you see `import/no-unused-vars` for `posthog` in any file, that's a misconfiguration — check the import is being used.

- [ ] **Step 3: Smoke test in browser**

1. `pnpm run dev`
2. Open `http://localhost:3000` — console should show `$pageview` capture
3. Navigate to `/tienda` — console should show another `$pageview`
4. Add a product to cart — console should show `add_to_cart`
5. Open cart, click remove — console should show `remove_from_cart`
6. Navigate to `/checkout` — console should show `checkout_started`

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: PostHog integration complete — pageviews, identity, cart, checkout funnel"
```

---

## Checklist vs Spec

| Spec requirement | Task |
|---|---|
| `posthog.init()` with `capture_pageview: false` | Task 2 |
| Guard: init only if key defined | Task 2 |
| `ph.debug()` in development | Task 2 |
| `usePostHogIdentity` hook (identify + reset) | Task 3 |
| `PostHogProvider` with manual pageview on `pathname` change | Task 4 |
| Mount inside `ClerkProvider` in locale layout | Task 5 |
| `add_to_cart` event with product_id, variant_id, quantity, price | Task 6 |
| `remove_from_cart` event with product_id | Task 6 |
| `cart_quantity_updated` event with product_id, quantity | Task 6 |
| `typeof window !== 'undefined'` guard on all cart events | Task 6 |
| `checkout_started` with cart_total + item_count | Task 7 |
| `order_completed` with cart_total + item_count | Task 7 |
| `NEXT_PUBLIC_POSTHOG_KEY` + `NEXT_PUBLIC_POSTHOG_HOST` env vars | Task 1 |
