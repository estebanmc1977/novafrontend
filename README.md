# Novapatch Storefront

Frontend de e-commerce de Novapatch — plataforma de parches vitamínicos por suscripción para América Latina. Construido sobre Next.js 15 App Router con integración completa de Medusa, Clerk, Openpay, Sentry y PostHog.

---

## Tabla de contenidos

1. [Stack tecnológico](#stack-tecnológico)
2. [Estructura del proyecto](#estructura-del-proyecto)
3. [Variables de entorno](#variables-de-entorno)
4. [Comandos de desarrollo](#comandos-de-desarrollo)
5. [Testing](#testing)
6. [Multi-mercado e internacionalización](#multi-mercado-e-internacionalización)
7. [Sistema de diseño](#sistema-de-diseño)
8. [Arquitectura](#arquitectura)
9. [Módulos y librerías](#módulos-y-librerías)
10. [Hooks](#hooks)
11. [Contextos](#contextos)
12. [Rutas API (proxy server-side)](#rutas-api-proxy-server-side)
13. [Páginas y rutas](#páginas-y-rutas)
14. [Componentes](#componentes)
15. [Integraciones externas](#integraciones-externas)
16. [Flujo de checkout y pagos](#flujo-de-checkout-y-pagos)
17. [Observabilidad — Sentry y PostHog](#observabilidad--sentry-y-posthog)
18. [Seguridad](#seguridad)
19. [Despliegue en Vercel](#despliegue-en-vercel)
20. [Estado de la integración con Medusa](#estado-de-la-integración-con-medusa)

---

## Stack tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | Next.js App Router, React Server Components | 15.2.8 |
| UI | React, TypeScript strict mode | 19 / 5 |
| Estilos | Tailwind CSS v4, PostCSS | 4.x |
| Animaciones | Framer Motion | 12.x |
| Íconos | Lucide React, Heroicons v2 | — |
| Auth | Clerk (`@clerk/nextjs`) | 6.x |
| E-Commerce | Medusa v2 (headless REST) | 2.x |
| Pagos MX | Openpay (PCI-DSS) | SDK v1 |
| Pagos LATAM | MercadoPago | Pendiente |
| Componentes UI | shadcn/ui (New York style, neutral) | — |
| i18n | next-intl | 4.x |
| Geolocalización | Google Maps API + COPOMEX | — |
| Observabilidad | Sentry + PostHog | 10.x / 1.x |
| Email | Resend | 6.x |

---

## Estructura del proyecto

```
novafrontend/
└── apps/storefront/
    ├── app/
    │   ├── [locale]/                       # Todas las rutas están bajo prefijo de locale
    │   │   ├── layout.tsx                  # Layout por locale — Clerk, Cart, Sentry, PostHog, scripts de pago
    │   │   ├── page.tsx                    # Home — composición de secciones
    │   │   ├── error.tsx                   # Boundary de error por locale
    │   │   ├── checkout/
    │   │   │   ├── page.tsx                # Flujo de checkout completo (Client Component)
    │   │   │   ├── loading.tsx             # Skeleton de carga del checkout
    │   │   │   ├── cart/                   # Redirect al CartDrawer
    │   │   │   └── 3ds-return/page.tsx     # Handler del retorno de autenticación 3D Secure
    │   │   ├── cuenta/
    │   │   │   └── suscripciones/page.tsx  # Portal de suscripciones (protegido por Clerk)
    │   │   ├── tienda/page.tsx             # Listado de productos (Server Component)
    │   │   ├── sign-in/[[...sign-in]]/     # Sign-in custom con layout split
    │   │   ├── sign-up/[[...sign-up]]/     # Sign-up custom con layout split
    │   │   ├── nosotros/page.tsx
    │   │   ├── faq/page.tsx
    │   │   ├── suscripciones/page.tsx      # Página pública de planes
    │   │   ├── contacto/page.tsx
    │   │   ├── garantia/page.tsx
    │   │   ├── reembolso/page.tsx
    │   │   ├── privacidad/page.tsx
    │   │   └── terminos/page.tsx
    │   └── api/
    │       ├── contact/route.ts            # POST /api/contact → Resend
    │       ├── copomex/route.ts            # GET  /api/copomex?cp= → proxy COPOMEX
    │       └── validate-address/route.ts   # POST /api/validate-address → Google
    ├── components/
    │   ├── ui/                             # shadcn/ui: button, card, input, select, badge, table, textarea
    │   ├── home/                           # Secciones de la home
    │   │   ├── HeroWithBar.tsx             # Hero + AttributeBar con estado de carrusel compartido
    │   │   ├── HeroSection.tsx
    │   │   ├── AttributeBar.tsx
    │   │   ├── AbsorptionSection.tsx       # Sección de ciencia transdérmica (fondo navy)
    │   │   ├── HowItWorks.tsx
    │   │   ├── ComparisonTable.tsx
    │   │   ├── ProductGrid.tsx             # Cards de productos con selector de modo/frecuencia
    │   │   ├── Testimonials.tsx
    │   │   ├── CTABanner.tsx
    │   │   └── HomeFAQ.tsx
    │   ├── store/
    │   │   └── TiendaExperience.tsx        # Tienda completa con filtros
    │   ├── Navbar.tsx                      # Barra de navegación responsive con auth y carrito
    │   ├── CartDrawer.tsx                  # Panel deslizante del carrito
    │   ├── Footer.tsx
    │   ├── PostHogProvider.tsx             # Inicialización de PostHog en el cliente
    │   └── SentryIdentity.tsx             # Asocia usuario Clerk con sesiones de Sentry
    ├── contexts/
    │   └── CartContext.tsx                 # Estado global del carrito (localStorage + eventos DOM)
    ├── hooks/
    │   ├── useGooglePlaces.ts              # Autocomplete de Google Places para el campo de calle
    │   └── useCopomex.ts                   # Lookup CP → colonias/municipio/estado
    ├── i18n/
    │   ├── routing.ts                      # Locales disponibles y locale por defecto
    │   └── request.ts                      # Configuración de next-intl por request
    ├── lib/
    │   ├── cart.ts                         # Utilidades del carrito (CRUD localStorage)
    │   ├── markets.ts                      # Configuración por mercado (moneda, pago, región)
    │   ├── medusa.ts                       # Cliente REST completo de Medusa v2
    │   ├── openpay.ts                      # Wrapper del SDK de Openpay (tokenización, anti-fraude)
    │   ├── commerce.ts                     # Abstracción del catálogo con fallback
    │   ├── clerk-theme.ts                  # Tema visual y localización de Clerk por mercado
    │   └── product-meta.ts                 # Metadatos de marca de productos
    ├── messages/                           # Traducciones por locale
    │   ├── mx.json                         # Español México
    │   ├── br.json                         # Portugués Brasil
    │   ├── ar.json                         # Español Argentina
    │   ├── cl.json                         # Español Chile
    │   └── co.json                         # Español Colombia
    ├── public/
    │   └── logos/                          # logowht.webp, logocolor.webp
    ├── instrumentation.ts                  # Sentry server-side (Node.js + Edge)
    ├── instrumentation-client.ts           # Sentry + PostHog client-side
    ├── middleware.ts                        # Detección de locale y routing de next-intl
    ├── next.config.js                      # Sentry + next-intl + image optimization
    ├── tsconfig.json
    └── .env.local                          # Variables de entorno locales (no se commitea)
```

---

## Variables de entorno

Crear `.env.local` en `apps/storefront/`. Las keys con `NEXT_PUBLIC_` se exponen al browser. El resto son exclusivamente server-side.

```bash
# ── Clerk (Auth) ─────────────────────────────────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...                # SERVER ONLY — nunca exponer al browser

# ── Medusa (Backend) ──────────────────────────────────────────────────────────
NEXT_PUBLIC_MEDUSA_BACKEND_URL=http://localhost:9000
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=...     # Publishable API Key de Medusa Admin
NEXT_PUBLIC_MEDUSA_REGION_MX=reg_...       # ID de la región México en Medusa Admin
NEXT_PUBLIC_MEDUSA_REGION_BR=reg_...       # ID de la región Brasil
NEXT_PUBLIC_MEDUSA_REGION_AR=reg_...       # ID de la región Argentina
NEXT_PUBLIC_MEDUSA_REGION_CL=reg_...       # ID de la región Chile
NEXT_PUBLIC_MEDUSA_REGION_CO=reg_...       # ID de la región Colombia

# ── Openpay (Pagos México) ────────────────────────────────────────────────────
NEXT_PUBLIC_OPENPAY_MERCHANT_ID=...
NEXT_PUBLIC_OPENPAY_PUBLIC_KEY=...
NEXT_PUBLIC_OPENPAY_SANDBOX=true           # false en producción

# ── Google (Dirección) ────────────────────────────────────────────────────────
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=...        # Maps JS API + Places API habilitados
GOOGLE_ADDRESS_VALIDATION_KEY=...          # SERVER ONLY — Address Validation API

# ── COPOMEX (Código Postal México) ────────────────────────────────────────────
COPOMEX_TOKEN=...                          # SERVER ONLY — token de copomex.com

# ── Observabilidad ────────────────────────────────────────────────────────────
NEXT_PUBLIC_SENTRY_DSN=https://...
SENTRY_ORG=...                             # SERVER ONLY — para upload de source maps en build
SENTRY_PROJECT=...                         # SERVER ONLY
SENTRY_ENVIRONMENT=production              # SERVER ONLY
NEXT_PUBLIC_SENTRY_ENVIRONMENT=production
NEXT_PUBLIC_POSTHOG_KEY=phc_...
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# ── Email (Resend) ────────────────────────────────────────────────────────────
RESEND_API_KEY=re_...                      # SERVER ONLY
```

> **Cómo obtener `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY`:** Medusa Admin → Settings → API Key Management → Publishable. Esta key debe enviarse en el header `x-publishable-api-key` en cada request al storefront API.

---

## Comandos de desarrollo

Todos los comandos se ejecutan desde `apps/storefront/`:

```bash
# Instalar dependencias (desde la raíz del monorepo)
pnpm install

# Servidor de desarrollo en http://localhost:3000
pnpm dev

# Build de producción (usado por Vercel en CI)
pnpm build

# Servidor de producción local (requiere build previo)
pnpm start

# Linter ESLint
pnpm lint
```

> El proyecto usa `pnpm` como package manager. No usar `npm` ni `yarn`.

---

## Testing

### E2E con Playwright

Los tests E2E corren contra `https://www.novapatch.care` (producción con Openpay sandbox). Requieren un archivo `.env.test` en `apps/storefront/` — ver `.env.test.example`.

```bash
# Instalar browsers (primera vez)
pnpm exec playwright install chromium --with-deps

# Todos los tests
pnpm test:e2e

# Solo smoke tests (los más rápidos, ~15s)
pnpm test:e2e:smoke

# Con UI interactiva
pnpm test:e2e:ui
```

**Estructura de tests:**

```
tests/e2e/
├── helpers/
│   ├── auth.ts          # loginAsTestUser(), logout()
│   └── cart.ts          # addFirstProductToCart()
├── smoke/
│   └── critical-paths.spec.ts   # 4 checks: home, tienda, carrito, Medusa API
├── auth/
│   ├── login.spec.ts            # Login con cuenta existente, recuperación de contraseña
│   └── cart-persistence.spec.ts # Carrito persiste en localStorage entre sesiones
└── checkout/
    ├── happy-path.spec.ts       # Compra completa con tarjeta sandbox 4242424242424242
    ├── declined-card.spec.ts    # Tarjeta expirada → error visible, sin orden zombie
    └── coupon.spec.ts           # Cupón en orden de suscripción → descuento solo primer ciclo
```

**Variables de entorno para tests:**

```bash
BASE_URL=https://www.novapatch.care
BACKEND_URL=https://novabackend-production-7977.up.railway.app
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...
TEST_USER_EMAIL=tu-email-de-prueba@example.com
TEST_USER_PASSWORD=tu-contraseña
MEDUSA_ADMIN_EMAIL=admin@novapatch.care
MEDUSA_ADMIN_PASSWORD=...
TEST_COUPON_CODE=TESTDESC10   # opcional, default: TESTDESC10
```

**Tarjeta Openpay sandbox:**
- Éxito: `4242424242424242`, exp `12/30`, CVV `842`
- Rechazo: `4242424242424242`, exp `01/20` (fecha expirada fuerza rechazo), CVV `842`

---

### CI — GitHub Actions

El workflow `.github/workflows/smoke.yml` corre los smoke tests en cada PR a `main`.

**Secrets requeridos en GitHub → Settings → Actions → Repository secrets:**
- `BACKEND_URL` — URL completa del backend Railway (con `https://`)
- `MEDUSA_PUBLISHABLE_KEY` — publishable key de Medusa

---

### Lighthouse CI

Evalúa Core Web Vitals en `/mx` y `/mx/tienda` (3 runs cada una).

```bash
# Requiere @lhci/cli instalado globalmente
npm install -g @lhci/cli

bash scripts/run-lighthouse.sh
```

**Thresholds configurados en `lighthouserc.js`:**

| Métrica | Umbral |
|---------|--------|
| Performance score | ≥ 0.50 (warn) |
| Accessibility score | ≥ 0.70 (warn) |
| LCP | ≤ 10 000 ms |
| FCP | ≤ 5 000 ms |
| TTI | ≤ 12 000 ms |
| CLS | ≤ 0.25 |

> Resultados reales (abril 2026): Performance ~0.65, LCP ~7-8s. Optimización de performance es trabajo post-lanzamiento.

---

### k6 — Load Test

Simula 50 usuarios concurrentes durante 60 segundos contra el backend.

```bash
# Requiere k6 instalado: brew install k6
k6 run scripts/load-test.js \
  --env BASE_URL=https://www.novapatch.care \
  --env BACKEND_URL=https://novabackend-production-7977.up.railway.app \
  --env PUBLISHABLE_KEY=pk_...
```

**Flujo por VU:** `GET /mx/tienda` → `GET /store/products` → `GET /store/regions` → `POST /store/carts` → `POST /store/carts/:id/line-items`

**Thresholds:** `p(95) < 3 000ms`, error rate `< 1%`

> Resultado baseline (abril 2026, Railway): p95 = 2.33s, 0% errores con 50 VUs.

---

## Multi-mercado e internacionalización

### Locales soportados

| Locale | Mercado | Moneda | Proveedor de pago | Estado |
|--------|---------|--------|-------------------|--------|
| `mx` | México | MXN | Openpay | Activo |
| `br` | Brasil | BRL | MercadoPago | Pendiente |
| `ar` | Argentina | ARS | MercadoPago | Pendiente |
| `cl` | Chile | CLP | MercadoPago | Pendiente |
| `co` | Colombia | COP | MercadoPago | Pendiente |

### Routing

- Todas las rutas tienen prefijo de locale: `/mx/`, `/br/`, `/ar/`, etc.
- La raíz `/` detecta el locale en este orden de prioridad:
  1. Cookie `NEXT_LOCALE` (preferencia guardada del usuario)
  2. Header `x-vercel-ip-country` (geolocalización por IP de Vercel)
  3. Default: `mx`
- La cookie se setea con `maxAge: 1 año` cada vez que el usuario navega a una ruta con prefijo de locale.

### Configuración por mercado (`lib/markets.ts`)

El objeto `MARKETS` centraliza toda la configuración dependiente del mercado:

```ts
MARKETS['mx'] = {
  locale: 'es-MX',
  currency: 'MXN',
  paymentProvider: 'openpay',
  clerkLocaleKey: 'esMX',
  supportEmail: 'soporte@novapatch.mx',
  medusaRegionId: process.env.NEXT_PUBLIC_MEDUSA_REGION_MX,
  addressCountry: 'mx',
  taxLabel: 'IVA 16%',
}
```

Los scripts de Openpay solo se cargan para locales cuyo `paymentProvider === 'openpay'`, lo que evita cargar 2 scripts innecesarios en mercados LATAM que usarán MercadoPago.

### Traducciones

Los strings de UI están en `messages/{locale}.json`. El componente `<NextIntlClientProvider>` los inyecta en el árbol de React en `[locale]/layout.tsx`. Para agregar un string nuevo: editar todos los archivos en `messages/`.

---

## Sistema de diseño

### Paleta de colores

Definida como custom properties CSS en `app/globals.css` vía `@theme` de Tailwind v4. No usar valores hex directos en los componentes — usar los tokens.

| Token | Hex | Uso |
|---|---|---|
| `--color-coral` | `#E8503A` | CTA primario, accents, badges de suscripción |
| `--color-coral-light` | `#FF7A65` | Hover states del coral |
| `--color-coral-dark` | `#C43B28` | Active states |
| `--color-navy` | `#0D1B35` | Texto principal, fondos oscuros |
| `--color-navy-light` | `#1D3461` | Títulos secundarios |
| `--color-sky` | `#5BA8D5` | Accents secundarios, links, fondos de info |
| `--color-sky-light` | `#B8DDEF` | Fondos de cards |
| `--color-sky-pale` | `#EAF5FB` | Hover de items de lista |
| `--color-cream` | `#FAF7F2` | Fondos claros de página |
| `--color-lime` | `#C9D849` | Highlights de oferta, descuentos |
| `--color-lime-dark` | `#A8B42A` | Texto sobre fondo lime |

### Tipografía

- **Familia:** `"Avenir Next"`, `"Montserrat"`, `"Helvetica Neue"`, sans-serif
- **Escalas:** 11px (micro), 12px (labels), 14px (body), 16px (lead), 22–48px (headings)
- **Pesos:** 500 (regular), 600 (semibold), 700 (bold), 800–900 (black)

### Modelo de suscripción

| Frecuencia | días | Descuento |
|---|---|---|
| Mensual | 30 | 20% |
| Bimestral | 60 | 15% |
| Trimestral | 90 | 10% |

Estos descuentos están definidos en `FREQ_DISCOUNTS` en `checkout/page.tsx` y `lib/cart.ts`. El descuento se almacena como `metadata.discount_percentage` en la línea de Medusa, para que el plugin de suscripciones en el backend los aplique en cobros recurrentes.

---

## Arquitectura

### Server vs. Client Components

| Tipo | Ejemplos |
|---|---|
| **Server Components** | `app/[locale]/tienda/page.tsx`, páginas de contenido estático, `[locale]/layout.tsx` |
| **Client Components** | `app/[locale]/checkout/page.tsx`, todos los componentes de `components/home/`, `CartDrawer`, `Navbar` |
| **Sin directiva (shared)** | `lib/cart.ts`, `lib/medusa.ts`, `lib/openpay.ts`, `lib/markets.ts` |

### Middleware (`middleware.ts`)

El middleware de Next.js maneja dos responsabilidades:

1. **Redirect de raíz:** `GET /` → detecta locale → redirect a `/{locale}`
2. **Routing de next-intl:** valida que el locale del path sea uno de los soportados; devuelve 404 si no lo es

No hay protección de rutas en el middleware (Clerk Edge Runtime es incompatible con `#crypto`). La protección de `/cuenta/*` se delega al layout server-side con `auth()`.

### Configuración de Next.js (`next.config.js`)

```js
withSentryConfig(
  withNextIntl(nextConfig),
  {
    silent: true,
    widenClientFileUpload: true,   // sube todos los source maps, no solo los del entry point
    hideSourceMaps: true,          // los source maps no se sirven al browser
    autoInstrumentMiddleware: false // evita overhead de Sentry en cada request del middleware
  }
)
```

Imágenes: formato AVIF prioritario (20-30% más pequeño que WebP), WebP como fallback. Dominio externo permitido: `img.clerk.com` (avatars de usuarios).

---

## Módulos y librerías

### `lib/markets.ts` — Configuración por mercado

Fuente de verdad para toda la configuración dependiente del locale. Usado en `layout.tsx` para cargar scripts de pago condicionalmente, en `clerk-theme.ts` para la localización, y en el checkout para conocer el `medusaRegionId` activo.

---

### `lib/cart.ts` — Carrito en localStorage

Gestión del estado del carrito en el browser. Todas las funciones tienen guards `typeof window === "undefined"` para ser seguras en SSR.

```ts
type CartItem = {
  slug: string;
  title: string;
  image: string;
  price: number;          // MXN, precio regular sin descuento
  color: string;          // Color accent del producto
  bg: string;             // Color de fondo del producto
  mode: "once" | "sub";  // Compra única o suscripción
  freq: 30 | 60 | 90;    // Frecuencia de envío en días
  quantity: number;
  variantId?: string;     // ID de variante en Medusa (opcional — se resuelve en preload del checkout)
};
```

| Función | Descripción |
|---|---|
| `getCart()` | Lee el carrito de `localStorage["novapatch_cart"]` |
| `addToCart(item)` | Agrega o acumula quantity por clave (slug + mode + freq) |
| `updateQuantity(slug, mode, freq, delta)` | Ajusta quantity; elimina si llega a 0 |
| `removeFromCart(slug, mode, freq)` | Elimina un ítem |
| `clearCart()` | Vacía el carrito |
| `getCartItemCount()` | Total de unidades |
| `itemDisplayPrice(item)` | Precio con descuento de suscripción aplicado |
| `cartTotals(items)` | `{ subtotal, savings, total }` |
| `cartKey(item)` | Clave única: `"slug__mode__freq"` |

**Storage:** `localStorage["novapatch_cart"]`
**Evento DOM:** `"cart:updated"` — disparado en cada modificación para sincronizar entre componentes sin pasar por props.

---

### `lib/medusa.ts` — Cliente REST de Medusa v2

Implementa la integración completa con Medusa en 5 secciones. **Todas las llamadas** pasan por `medusaFetch()`, que incluye:

- Header `x-publishable-api-key` obligatorio
- Header `Authorization: Bearer <token>` cuando se pasa token
- **Retry con backoff exponencial:** 2 reintentos para errores de red en todos los métodos; 2 reintentos para 5xx solo en GET
- **Sin retry en paths sensibles:** `/complete` y `/payment-sessions` nunca retrian — un segundo intento de cobro podría duplicar el cargo
- Delays: 300ms → 600ms entre intentos

#### 1. Catálogo (público)

```ts
medusa.catalog.getProducts({ region_id? })  // GET /store/products?region_id=...
medusa.catalog.getVariant(id)               // GET /store/variants/:id
```

#### 2. Carrito (público)

```ts
medusa.cart.create(region_id, customer_id?)      // POST /store/carts
medusa.cart.ensure(region_id)                    // Obtiene cart_id de localStorage o crea uno nuevo
medusa.cart.getStoredId()                        // Lee cart_id de localStorage
medusa.cart.addOnceItem(cart_id, variant_id, qty)
// POST /store/carts/:id/line-items → { variant_id, quantity }

medusa.cart.addSubscriptionItem(cart_id, variant_id, interval_days, discount_pct, qty)
// POST /store/carts/:id/line-items → metadata: { is_subscription, interval_days, discount_percentage }

medusa.cart.update(cart_id, { email, shipping_address })
// POST /store/carts/:id → actualiza email y dirección

medusa.cart.getShippingOptions(cart_id)
// GET /store/shipping-options?cart_id=:id → devuelve opciones disponibles

medusa.cart.addShippingMethod(cart_id, option_id)
// POST /store/carts/:id/shipping-methods → { option_id }

medusa.cart.applyPromotion(cart_id, code)
// POST /store/carts/:id/promotions → { promo_codes: [code] }

medusa.cart.removePromotion(cart_id, code)
// DELETE /store/carts/:id/promotions → { promo_codes: [code] }

medusa.cart.updateItem(cart_id, line_id, qty)
// POST /store/carts/:id/line-items/:line_id → { quantity }
```

#### 3. Checkout y pagos

```ts
medusa.checkout.createPaymentSession(cart_id)
// POST /store/carts/:id/payment-sessions
// Registra el proveedor de pago (Openpay para MX); NO reintenta

medusa.checkout.completeCart(cart_id, openpay_token_id, email?, device_session_id?)
// POST /store/carts/:id/complete → { openpay_token_id, email, device_session_id }
// Retorna { type: "order", data: MedusaOrder } o { type: "redirect", redirect_url }
// NO reintenta — un segundo intento podría cobrar dos veces
```

#### 4. Customer sync (JWT de Clerk requerido)

```ts
medusa.customer.sync(clerk_jwt)
// GET /store/me/customer — asocia el carrito al cliente de Medusa
```

#### 5. Suscripciones (JWT requerido)

```ts
medusa.subscriptions.list(token)
medusa.subscriptions.pause(sub_id, token)
medusa.subscriptions.resume(sub_id, token)
medusa.subscriptions.cancel(sub_id, token)
medusa.subscriptions.updateFrequency(sub_id, days, token)
```

#### 6. Métodos de pago (JWT requerido)

```ts
medusa.paymentMethods.list(token)
// GET /store/me/payment-methods → devuelve tarjetas guardadas
// Nota: last4 viene como string completo "411111XXXXXX1111" — usar .slice(-4) para mostrar

medusa.paymentMethods.setDefault(openpay_token_id, token)
// POST /store/me/payment-methods/default → { openpay_token_id }
```

#### Tipos de retorno clave

```ts
type MedusaCart = {
  id: string;
  total: number;           // Total en centavos/unidades menores de la moneda
  subtotal: number;
  discount_total?: number;
  promotions?: Array<{ id: string; code: string; ... }>;
  items: MedusaLineItem[];
};

type CompleteCartResult =
  | { type: "order"; data: MedusaOrder }      // Pago exitoso sin 3DS
  | { type: "redirect"; redirect_url: string }; // 3DS requerido

type MedusaShippingOption = {
  id: string;
  name: string;
  amount: number;
  price_type: "flat" | "calculated";
};
```

---

### `lib/openpay.ts` — Wrapper del SDK de Openpay

El SDK de Openpay (`openpay.v1.min.js` + `openpay-data.v1.min.js`) se carga vía `<Script strategy="lazyOnload">` en `[locale]/layout.tsx` **solo para el mercado MX**.

**Flujo triangular PCI-DSS (los datos de tarjeta nunca tocan servidores de Novapatch):**

```
Browser                     Openpay                    Medusa Backend
  │                            │                             │
  │─── cardData ──────────────►│                             │
  │◄── tok_XXX ────────────────│                             │
  │                            │                             │
  │─── tok_XXX + deviceId ─────────────────────────────────►│
  │                            │◄─── POST charge ───────────│
  │◄── order / 3DS redirect ───────────────────────────────-│
```

```ts
getDeviceSessionId(formId?, fieldName?): string | null
// Genera fingerprint anti-fraude con openpay-data.js
// Debe llamarse ANTES de tokenizeCard()
// Si falla → retorna null (manejar el fallback en el caller)

tokenizeCard(cardData: OpenpayCardData): Promise<string>
// Tokeniza la tarjeta directo a Openpay → devuelve "tok_XXX"
// Nunca llama a servidores de Novapatch

parseCardForm(number, name, expiry, cvv): OpenpayCardData
// Convierte "4111 1111 1111 1111", "MARIA GARCIA", "08/27", "123" al formato Openpay

translateOpenpayError(err): string
// Códigos 2004–3012 → mensajes en español amigables
```

**Variables de entorno necesarias:**

```bash
NEXT_PUBLIC_OPENPAY_MERCHANT_ID=...
NEXT_PUBLIC_OPENPAY_PUBLIC_KEY=...
NEXT_PUBLIC_OPENPAY_SANDBOX=true   # true → sandbox-api.openpay.mx / false → api.openpay.mx
```

---

### `lib/commerce.ts` — Abstracción del catálogo

Capa con fallback automático para desarrollo sin backend:

1. Intenta `GET /store/products` en Medusa
2. Si falla → usa `PRODUCT_META` de `lib/product-meta.ts`
3. Ordena según `PRODUCT_ORDER = ["shield", "glow", "sleep", "energy", "zen", "woman"]`

---

### `lib/clerk-theme.ts` — Tema y localización de Clerk

`getClerkLocalization(locale)` retorna la localización correcta por mercado (`esMX`, `ptBR`, `esES`). El tema visual `novapatchAppearance` aplica los colores y tipografía de la marca a todos los componentes de Clerk.

---

### `lib/product-meta.ts` — Metadatos de productos

Fuente de verdad para información de marca. Productos: `energy`, `shield`, `glow`, `sleep`, `zen`, `woman`.

---

## Hooks

### `hooks/useGooglePlaces.ts`

Inicializa Google Places Autocomplete en el campo de calle del checkout. Carga el script de Maps JS API dinámicamente (singleton — un solo script aunque el hook se monte varias veces). Restricción por país: `mx`.

```ts
useGooglePlaces(
  inputRef: React.RefObject<HTMLInputElement | null>,
  onPlace: (parts: PlaceAddressParts) => void
): { ready: boolean; error: string | null }
```

**Requisitos en Google Cloud Console:** Maps JavaScript API ✓ y Places API (legacy) ✓.

---

### `hooks/useCopomex.ts`

Convierte un CP de 5 dígitos en municipio, estado, ciudad y lista de colonias. Usa el proxy `/api/copomex` (el token nunca va al browser). Cancela requests en vuelo con `AbortController` si el usuario cambia el CP rápidamente.

```ts
useCopomex(): {
  state: { status: "idle" | "loading" | "error" }
        | { status: "success"; data: CopomexResult };
  lookup: (cp: string) => Promise<void>;
  reset: () => void;
}
```

---

## Contextos

### `contexts/CartContext.tsx`

Estado global del carrito disponible en todo el árbol de componentes.

```ts
type CartContextType = {
  items: CartItem[];
  isOpen: boolean;
  coupon: AppliedCoupon | null;
  openCart: () => void;
  closeCart: () => void;
  addToCart: (item) => void;
  updateQty: (slug, mode, freq, delta) => void;
  removeItem: (slug, mode, freq) => void;
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
};
```

- Sincroniza con `localStorage` en cada operación
- Escucha `"cart:updated"` y `"storage"` (sincronización entre tabs)
- Cierra el drawer con `Escape`
- Abre el drawer automáticamente al agregar un ítem
- Persiste el cupón aplicado en `localStorage["novapatch_coupon"]`

---

## Rutas API (proxy server-side)

### `GET /api/copomex?cp=XXXXX`

Proxy server-side para COPOMEX. Mantiene el `COPOMEX_TOKEN` fuera del browser. Caché de 24h (`next: { revalidate: 86400 }`).

| Código | Significado |
|---|---|
| `200` | `{ municipio, estado, ciudad, colonias[] }` |
| `400` | CP no tiene 5 dígitos |
| `404` | CP no encontrado |
| `500` | `COPOMEX_TOKEN` no configurado |
| `502` | Error HTTP upstream de COPOMEX |
| `503` | Error de red al conectar con COPOMEX |

### `POST /api/validate-address`

Proxy server-side para Google Address Validation API. **No bloqueante** — si el API key no está configurado o la llamada falla, retorna `{ valid: true }` para no interrumpir una compra.

### `POST /api/contact`

Endpoint de formulario de contacto. Usa Resend (`RESEND_API_KEY`) para enviar el mensaje al email de soporte del mercado activo.

---

## Páginas y rutas

| Ruta | Tipo | Descripción |
|---|---|---|
| `/[locale]` | Server | Home — composición de 10 secciones |
| `/[locale]/tienda` | Server | Listado de los 6 productos |
| `/[locale]/checkout` | Client | Flujo de checkout completo (ver sección específica) |
| `/[locale]/checkout/3ds-return` | Client | Handler del retorno post-autenticación 3D Secure |
| `/[locale]/cuenta/suscripciones` | Client (protegido) | Portal de suscripciones del usuario |
| `/[locale]/sign-in` | Client | Sign-in con layout split (panel de marca + Clerk) |
| `/[locale]/sign-up` | Client | Sign-up con layout split |
| `/[locale]/suscripciones` | Server | Página pública de planes y precios |
| `/[locale]/nosotros` | Server | Historia y equipo |
| `/[locale]/faq` | Server | Preguntas frecuentes |
| `/[locale]/contacto` | Client | Formulario de contacto |
| `/[locale]/garantia` | Server | Política de garantía |
| `/[locale]/reembolso` | Server | Política de reembolso |
| `/[locale]/privacidad` | Server | Aviso de privacidad |
| `/[locale]/terminos` | Server | Términos y condiciones |

---

## Componentes

### `<Navbar>`
Transparente sobre la hero (texto blanco). Se vuelve `bg-cream` con scroll. Badge de cantidad en carrito (coral). Auth: `<UserButton>` si hay sesión, `<SignInButton mode="modal">` si no. Menú hamburguesa en mobile con `AnimatePresence`.

### `<CartDrawer>`
Panel deslizante desde la derecha. Lista ítems con imagen, título, precio con descuento, controles +/−. Suscripciones muestran badge de frecuencia. Botón "Ir al checkout" → `/[locale]/checkout`.

### `<ProductGrid>` / `<TiendaExperience>`
Cards de producto con selector de modo (Compra única / Suscripción) y frecuencia (30/60/90 días). Descuento visible al seleccionar suscripción. Botón "Agregar al carrito" → `useCart().addToCart()`.

### `<PostHogProvider>`
Inicializa PostHog en el cliente y captura `$pageview` en cada cambio de ruta, respetando el prefijo de locale de `next-intl`.

### `<SentryIdentity>`
Asocia el usuario de Clerk (`userId`, `email`) con la sesión activa de Sentry para enriquecer los error reports con contexto del usuario.

---

## Flujo de checkout y pagos

### Preload (mientras el usuario llena el formulario)

Al montar el componente de checkout, si hay items en el carrito, se inicia en paralelo:

```
Promise.all([
  GET /store/me/customer    ← sync Clerk → Medusa (si hay sesión)
  GET /store/products       ← construir mapa slug → variant_id
])
  └─► POST /store/carts                             ← crear carrito
        └─► POST /store/carts/:id/line-items × N   ← agregar ítems (secuencial — Medusa usa locks por cart)
              └─► POST /store/carts/:id/promotions  ← si hay cupón
```

El preload reduce el tiempo percibido del submit porque el carrito ya está listo antes de que el usuario haga click.

> **Locking de Medusa:** Los line items se agregan secuencialmente (no en paralelo) porque `addToCartWorkflow` adquiere un lock por `cart_id`. Enviar requests paralelos al mismo carrito los haría hacer cola de todas formas y podría causar timeouts. La optimización real requiere un endpoint bulk custom en el backend (ver roadmap).

### Submit (click en "Pagar")

```
1. validate() → errores en campos obligatorios
2. getDeviceSessionId() → fingerprint anti-fraude (Openpay SDK)
3. tokenizeCard(cardData) → tok_XXX (directo a Openpay, PCI-DSS)
4. Fallback: si el preload falló, crear carrito y agregar ítems
5. POST /store/carts/:id → actualizar email y dirección de envío
6. GET /store/shipping-options?cart_id=:id → obtener opciones de envío
7. POST /store/carts/:id/shipping-methods → aplicar primera opción disponible
   └─► Capturar cart.total como chargedTotal (total real incluyendo envío)
   └─► Si cupón estaba en preload → verificar que siga en shippedCart.promotions
8. Si cupón NO estaba en preload → POST /store/carts/:id/promotions
   └─► Actualizar chargedTotal con cart.total post-descuento
9. POST /store/carts/:id/payment-sessions → registrar Openpay como proveedor
10. POST /store/carts/:id/complete → cobrar
    ├─ { type: "order" } → clearCart() → pantalla de éxito
    └─ { type: "redirect" } → guardar chargedTotal en sessionStorage → redirect a URL 3DS de Openpay
```

### Retorno de 3D Secure (`/checkout/3ds-return`)

```
GET /[locale]/checkout/3ds-return?status=completed&id=txn_xxx
  └─► Leer sessionStorage: novapatch_3ds_total, novapatch_3ds_items
  └─► clearCart() + limpiar localStorage y sessionStorage
  └─► posthog.capture("order_completed", { cart_total, via_3ds: true })
  └─► Mostrar pantalla de confirmación con referencia de transacción
```

### Variables en storage durante checkout

| Storage | Clave | Contenido | Cuándo se elimina |
|---|---|---|---|
| `localStorage` | `novapatch_cart` | Items del carrito | Al hacer `clearCart()` |
| `localStorage` | `novapatch_medusa_cart_id` | ID del carrito de Medusa | Al completar orden (directo o 3DS) |
| `localStorage` | `novapatch_coupon` | Cupón aplicado | Al hacer `removeCoupon()` |
| `sessionStorage` | `novapatch_3ds_cart_id` | Cart ID para recuperar contexto | Al volver de 3DS |
| `sessionStorage` | `novapatch_3ds_total` | Total cobrado (real, de Medusa) | Al volver de 3DS |
| `sessionStorage` | `novapatch_3ds_items` | Cantidad de ítems | Al volver de 3DS |

### Gestión de errores en el cobro

| Error | Comportamiento |
|---|---|
| Cupón expiró entre preload y submit | Error claro al usuario, abort — no se cobra |
| Cupón inválido en submit | Error + abort |
| `createPaymentSession` falla | Error al usuario, sin retry automático |
| `completeCart` falla (red) | Error al usuario, sin retry — el usuario debe verificar su banco antes de reintentar |
| `completeCart` falla (5xx) | Error al usuario, sin retry |
| 3DS cancelado / rechazado | Pantalla de error con opción de reintentar |

---

## Observabilidad — Sentry y PostHog

### Sentry

Configurado en dos archivos:

- **`instrumentation.ts`** (server-side): inicializa Sentry para Node.js y Edge runtimes. `tracesSampleRate`: 10% en producción, 100% en staging. Deshabilitado en `development`.
- **`instrumentation-client.ts`** (client-side): inicializa Sentry en el browser con Session Replay.

**Session Replay:**
- 10% de sesiones normales
- 100% de sesiones con error
- `maskAllInputs: true` — campos de pago y contraseñas siempre enmascarados (PCI compliance)
- Los errores de extensiones de browser se filtran antes de enviarse

**`<SentryIdentity>`** asocia el `userId` y `email` de Clerk con la sesión activa de Sentry.

### PostHog

Inicializado en `instrumentation-client.ts` y gestionado por `<PostHogProvider>`. Eventos capturados:

| Evento | Cuándo | Propiedades |
|---|---|---|
| `$pageview` | Cada navegación | URL, locale |
| `checkout_started` | Al cargar `/checkout` | `cart_total` (estimado), `item_count` |
| `order_completed` | Cobro exitoso (directo) | `cart_total` (real de Medusa), `item_count` |
| `order_completed` | Cobro exitoso (3DS) | `cart_total`, `item_count`, `via_3ds: true` |

> `cart_total` en `checkout_started` es un estimado (total de productos + $85 fijo). En `order_completed` es el total confirmado por Medusa después de aplicar envío y descuentos.

---

## Seguridad

| Aspecto | Implementación |
|---|---|
| **Datos de tarjeta (PCI-DSS)** | Nunca tocan servidores de Novapatch. Van directo de browser a Openpay via SDK. Solo el token `tok_XXX` se envía a Medusa. |
| **Fingerprint anti-fraude** | `getDeviceSessionId()` genera un fingerprint del dispositivo que Openpay usa para detección de fraude. Se envía junto con el token en `completeCart`. |
| **Tokens de terceros** | `COPOMEX_TOKEN`, `GOOGLE_ADDRESS_VALIDATION_KEY`, `CLERK_SECRET_KEY`, `RESEND_API_KEY`, `SENTRY_ORG`, `SENTRY_PROJECT` no tienen prefijo `NEXT_PUBLIC_` — solo existen en el servidor. |
| **Autenticación** | Clerk maneja sesiones, tokens, MFA y social login. El middleware protege `/cuenta/*`. |
| **JWT para Medusa** | `useAuth().getToken()` de Clerk genera un JWT short-lived que Medusa valida en cada request protegido. |
| **Source maps** | `hideSourceMaps: true` en Sentry — los source maps se suben a Sentry pero no se sirven al browser. |
| **Session Replay** | `maskAllInputs: true` — todos los campos de formulario se enmascaran en las grabaciones. |
| **No retry en cobros** | `POST /store/carts/:id/complete` y `/payment-sessions` nunca retrian automáticamente para evitar dobles cargos. |
| **Validación de cupón** | Al submit, se verifica que el cupón aplicado en preload siga activo en el carrito (via `shippedCart.promotions`) sin llamadas extra. |

---

## Despliegue en Vercel

### Configuración del proyecto

| Setting | Valor |
|---|---|
| Root Directory | `apps/storefront` |
| Framework Preset | Next.js |
| Build Command | `pnpm build` |
| Install Command | `pnpm install` |
| Output Directory | `.next` (automático) |

### Variables de entorno en Vercel

Deben configurarse en el dashboard de Vercel (Settings → Environment Variables) para los entornos `Production`, `Preview` y `Development`:

- Todas las variables listadas en la sección [Variables de entorno](#variables-de-entorno)
- `SENTRY_AUTH_TOKEN` — requerido solo en build (para subir source maps); agregar como variable de entorno de build, no en runtime

### Detección de geolocalización

El middleware usa `x-vercel-ip-country` para detectar el país del usuario. Este header **solo está disponible en Vercel** (o detrás de Vercel's Edge Network). En desarrollo local, la detección por IP no funciona y siempre cae al locale por defecto (`mx`).

### Edge Runtime

El middleware (`middleware.ts`) corre en Edge Runtime de Vercel. Por este motivo, **no** se usa `@clerk/nextjs` en el middleware — el SDK de Clerk usa APIs de Node.js (`#crypto`, `#safe-node-apis`) que son incompatibles con Edge. La protección de rutas se hace en los layouts server-side con `auth()`.

---

## Estado de la integración con Medusa

El backend de Medusa aún no está en producción. El frontend tiene sistema de fallback completo:

| Módulo | Sin backend | Con backend |
|---|---|---|
| **Catálogo** | `PRODUCT_META` de `lib/product-meta.ts` | `GET /store/products?region_id=...` |
| **Carrito** | Estado local en `localStorage` | Sincronización en el preload del checkout |
| **Checkout** | Modo demo (dev) — si el backend no responde, simula éxito | Flujo completo con Medusa + Openpay |
| **Suscripciones** | Datos mock en la página de cuenta | `GET /store/me/subscriptions` con JWT |
| **Pagos en sandbox** | Token mock `"tok_dev_mock"` si Openpay SDK falla | Openpay sandbox completo |

### Para activar la integración con Medusa

1. Asegurarse de que el plugin de Openpay esté instalado en el backend de Medusa
2. Crear las regiones en Medusa Admin (México → MXN, Brasil → BRL, etc.)
3. Actualizar las variables de entorno:
   ```bash
   NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://api.novapatch.mx
   NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_...  # De Medusa Admin → API Keys
   NEXT_PUBLIC_MEDUSA_REGION_MX=reg_...       # ID de la región creada
   ```
4. Verificar que el plugin de Medusa maneje correctamente el campo `metadata.is_subscription` en los line items para activar los flujos de suscripción con Temporal.io

### Roadmap de optimizaciones pendientes (backend)

- **Bulk add line items:** Crear `POST /store/carts/:id/line-items/bulk` que acepte un array de items y los procese en una sola transacción con un solo lock. Actualmente los items se agregan secuencialmente por limitación del locking de Medusa por `cart_id`.
- **MercadoPago:** Integrar el plugin de MercadoPago en Medusa para los mercados BR, AR, CL, CO.
- **Temporal.io:** Conectar los workflows de suscripción recurrente.

---

*Última actualización: 2026-04-15 — Novapatch Storefront `apps/storefront`*
