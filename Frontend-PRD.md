# Novapatch Storefront — PRD Técnico

> **Audiencia**: Desarrolladores fullstack que necesitan entender, mantener o extender el frontend de Novapatch.
> **Fecha**: Abril 2026
> **Estado**: Producción activa en `novapatch.care`

---

## 1. Visión General

Novapatch es una plataforma de e-commerce de suscripción para parches vitamínicos transdérmicos, enfocada en México (expansión Brasil planeada). El storefront es una aplicación **Next.js 15** con App Router que conecta con un backend **Medusa V2** en Railway.

### Stack Tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | Next.js (App Router) | 15.2.8 |
| UI Library | React | 19 |
| Lenguaje | TypeScript (strict mode) | 5 |
| Estilos | Tailwind CSS v4 | 4.x |
| Animaciones | Framer Motion | latest |
| Auth | Clerk | latest |
| Commerce Backend | Medusa V2 | v2 |
| Pagos MX | Openpay | v1 |
| Email | Resend | 6.10.0 |
| Iconos | Heroicons + Lucide React | latest |
| Componentes | shadcn/ui (New York style) | latest |

### URLs Importantes

| Entorno | URL |
|---------|-----|
| Producción (frontend) | `https://novapatch.care` |
| Backend Medusa | `https://novabackend-production-7977.up.railway.app` |
| Dashboard Clerk | `https://dashboard.clerk.com` |
| Resend | `https://resend.com` |

---

## 2. Estructura de Directorios

```
apps/storefront/
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout: ClerkProvider + CartProvider + Scripts
│   ├── globals.css                   # Tema global: variables CSS + Tailwind
│   ├── page.tsx                      # Home (ensambla secciones)
│   ├── error.tsx                     # Error boundary
│   ├── not-found.tsx                 # 404 page
│   │
│   ├── api/                          # API Routes (server-side)
│   │   ├── contact/route.ts          # POST → Resend email a hola@novapatch.care
│   │   ├── copomex/route.ts          # GET ?cp=XXXXX → colonias/municipio/estado
│   │   └── validate-address/route.ts # POST → Google Address Validation API
│   │
│   ├── tienda/                       # Tienda
│   │   ├── page.tsx                  # Grid de productos (Server Component + Client store)
│   │   └── loading.tsx               # Skeleton de carga
│   │
│   ├── checkout/
│   │   ├── page.tsx                  # Checkout multi-paso (Client Component, ~700 líneas)
│   │   ├── cart/page.tsx             # /checkout/cart → redirect a /tienda (abre cart drawer)
│   │   └── loading.tsx               # Skeleton de carga
│   │
│   ├── cuenta/
│   │   ├── layout.tsx                # Guard de autenticación (server-side, redirige si no autenticado)
│   │   └── suscripciones/page.tsx    # Gestión de suscripciones del usuario
│   │
│   ├── sign-in/[[...sign-in]]/page.tsx   # Login (Clerk embedded + brand panel)
│   ├── sign-up/[[...sign-up]]/page.tsx   # Registro (Clerk embedded + brand panel)
│   │
│   ├── nosotros/page.tsx             # Historia de marca
│   ├── contacto/page.tsx             # Formulario de contacto + info
│   ├── faq/page.tsx                  # Preguntas frecuentes con categorías
│   ├── garantia/page.tsx             # Garantía 30 días
│   ├── reembolso/page.tsx            # Wizard de solicitud de reembolso (5 pasos)
│   ├── privacidad/page.tsx           # Aviso de privacidad (LFPDPPP)
│   └── terminos/page.tsx             # Términos y condiciones
│
├── components/
│   ├── Navbar.tsx                    # Navegación principal (fija, scroll-aware)
│   ├── Footer.tsx                    # Footer con links, newsletter, redes sociales
│   ├── CartDrawer.tsx                # Carrito lateral (slide-out)
│   │
│   ├── home/                         # Secciones del Home
│   │   ├── HeroWithBar.tsx           # Hero pantalla completa + barra de producto
│   │   ├── HowItWorks.tsx            # 3 pasos visuales
│   │   ├── AbsorptionSection.tsx     # Ciencia de absorción transdérmica
│   │   ├── ComparisonTable.tsx       # Parches vs Pastillas vs Otros parches
│   │   ├── ProductGrid.tsx           # Grid de 6 productos
│   │   ├── Testimonials.tsx          # Carousel de testimonios
│   │   ├── CTABanner.tsx             # Banner de llamada a suscripción
│   │   ├── HomeFAQ.tsx               # FAQ abreviado (accordion)
│   │   └── AttributeBar.tsx          # Features del producto (vegan, sin gluten, etc.)
│   │
│   ├── store/
│   │   └── TiendaExperience.tsx      # Grid de tienda con "Add to Cart"
│   │
│   └── ui/                           # Componentes shadcn/ui
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── select.tsx
│       ├── table.tsx
│       ├── textarea.tsx
│       ├── badge.tsx
│       └── Skeleton.tsx
│
├── contexts/
│   └── CartContext.tsx               # Estado global del carrito (React Context)
│
├── hooks/
│   ├── useCopomex.ts                 # Hook: CP → colonias (llama a /api/copomex)
│   └── useGooglePlaces.ts            # Hook: autocomplete de calle (Google Places)
│
├── lib/
│   ├── cart.ts                       # Lógica del carrito (localStorage + eventos)
│   ├── commerce.ts                   # Abstracción de productos (Medusa + fallback)
│   ├── medusa.ts                     # Cliente REST completo para Medusa V2
│   ├── openpay.ts                    # Tokenización de tarjetas con Openpay SDK
│   ├── clerk-theme.ts                # Apariencia + localización español (MX) de Clerk
│   ├── product-meta.ts               # Catálogo estático de 6 productos (source of truth)
│   └── utils.ts                      # cn() helper para clases Tailwind
│
└── public/
    ├── logos/                        # logocolor.webp, logowht.webp
    ├── products/                     # {slug}.webp, {slug}_thumb.webp, {slug}_og.webp
    ├── carousel/                     # Imágenes del hero carousel
    ├── productusers/                 # Contexto de uso
    ├── features/                     # Iconos de atributos (vegan, gluten-free, etc.)
    ├── comparison/                   # Iconos para tabla comparativa
    ├── socialproof/                  # Fotos para testimonios
    └── favicon/                      # favicon.ico, .png, apple-touch-icon, webmanifest
```

---

## 3. Configuración y Variables de Entorno

El archivo `.env.local` (nunca se commitea) contiene todos los secretos:

```bash
# ── Clerk (Auth) ──────────────────────────────────────────────────────────────
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...   # pk_test_ en desarrollo
CLERK_SECRET_KEY=sk_live_...                     # sk_test_ en desarrollo
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/

# ── Medusa V2 (Commerce Backend) ─────────────────────────────────────────────
NEXT_PUBLIC_MEDUSA_BACKEND_URL=https://novabackend-production-7977.up.railway.app
NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=pk_a118d644...
NEXT_PUBLIC_MEDUSA_REGION_ID=reg_01KNAF0276KEPK8HRMACPEQ80Y   # Región México

# ── Openpay (Pagos MX) ───────────────────────────────────────────────────────
NEXT_PUBLIC_OPENPAY_MERCHANT_ID=mcsjag7pd7iu4tuekpa6
NEXT_PUBLIC_OPENPAY_PUBLIC_KEY=pk_1137744197...
NEXT_PUBLIC_OPENPAY_SANDBOX=true   # false en producción

# ── Servicios de Dirección ────────────────────────────────────────────────────
COPOMEX_TOKEN=92a7b1b6-...                   # Solo server-side (sin NEXT_PUBLIC_)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=AIzaSyC5s4...
GOOGLE_ADDRESS_VALIDATION_KEY=AIzaSyAbcDP4...  # Solo server-side

# ── Email ─────────────────────────────────────────────────────────────────────
RESEND_SECRET_KEY=re_3Yq84Aug_...             # Solo server-side
```

> **Regla**: Variables sin `NEXT_PUBLIC_` son exclusivamente server-side. Jamás se exponen al navegador.

---

## 4. Sistema de Diseño

### Paleta de Colores (CSS Custom Properties en `globals.css`)

```css
@theme {
  --color-coral:  #E8503A;   /* Acción primaria, CTAs */
  --color-navy:   #0D1B35;   /* Texto, fondos oscuros */
  --color-sky:    #5BA8D5;   /* Acento secundario */
  --color-cream:  #FAF7F2;   /* Fondos claros */
  --color-lime:   #C9D849;   /* Acento highlight */
}
```

### Tipografía

- **Fuente**: Montserrat (Google Fonts)
- **Pesos**: 400, 500, 600, 700, 800, 900
- **Variable CSS**: `--font-montserrat`
- **Responsive**: `clamp()` para tamaños de heading

### Convenciones Tailwind

- Tailwind v4 usa `@import "tailwindcss"` (NO `@tailwind base/components/utilities`)
- Path alias: `@/*` → `apps/storefront/`
- Colores de marca disponibles como `bg-coral`, `text-navy`, etc.

---

## 5. Catálogo de Productos

Definido en `lib/product-meta.ts`. Es la fuente de verdad estática para toda la UI.

| Slug | Nombre | Color | Bg | Precio MXN |
|------|--------|-------|-----|------------|
| `energy` | Energy | `#2B7CC1` | `#EBF4FB` | $750 |
| `sleep` | Sleep | `#138A75` | `#E6F5F1` | $750 |
| `glow` | Glow | `#C94030` | `#FDECEA` | $750 |
| `shield` | Shield | `#A07000` | `#FDF6E3` | $750 |
| `zen` | Zen | `#3A6FA8` | `#EBF2FA` | $750 |
| `woman` | Woman | `#8A3EBE` | `#F3ECF9` | $750 |

**Ingredientes activos de cada producto**: definidos en `product-meta.ts` con beneficios, modo de uso, y textos de marketing.

**Imágenes** (todas en `/public/products/`):
- `{slug}.webp` — imagen principal (PDP, grids grandes)
- `{slug}_thumb.webp` — miniatura (cart, checkout)
- `{slug}_og.webp` — preview para redes sociales

---

## 6. Carrito (Cart System)

### Almacenamiento

**localStorage** con key `novapatch_cart`. Sincronizado con React Context.

### Tipos

```typescript
type CartMode = "once" | "sub";
type CartFreq = 30 | 60 | 90;   // días

type CartItem = {
  slug:       string;       // "energy", "sleep", etc.
  title:      string;       // "Energy"
  image:      string;       // /products/energy_thumb.webp
  price:      number;       // Precio base en MXN
  color:      string;       // Color del producto (hex)
  bg:         string;       // Fondo del badge (hex)
  mode:       CartMode;
  freq:       CartFreq;
  quantity:   number;
  variantId?: string;       // Medusa variant ID (cuando esté disponible)
};
```

### Lógica de Precios

```typescript
// lib/cart.ts
const DISCOUNTS = { 30: 0.20, 60: 0.15, 90: 0.10 };

function itemDisplayPrice(item: CartItem): number {
  if (item.mode === "once") return item.price;
  return item.price * (1 - DISCOUNTS[item.freq]);
}
// once:  $750 (sin descuento)
// sub30: $600 (20% off)
// sub60: $637.50 (15% off)
// sub90: $675 (10% off)
```

### API del Carrito (`lib/cart.ts`)

```typescript
getCart(): CartItem[]
addToCart(item: CartItem): void              // Deduplica por (slug + mode + freq)
removeFromCart(slug, mode, freq): void
updateQuantity(slug, mode, freq, delta): void
cartTotals(items): { subtotal, savings, total }
clearCart(): void
```

### Sincronización

```typescript
// Constante exportada para eventos
CART_UPDATED_EVENT = "novapatch:cart-updated"

// Cada mutación dispara:
window.dispatchEvent(new Event(CART_UPDATED_EVENT))

// Navbar y CartContext escuchan:
useEffect(() => {
  window.addEventListener(CART_UPDATED_EVENT, syncCart);
  return () => window.removeEventListener(CART_UPDATED_EVENT, syncCart);
}, []);
```

### CartDrawer

Componente slide-out desde la derecha. Se abre cuando:
1. Usuario hace click en ícono de carrito en el Navbar
2. Se navega a `/checkout/cart` (redirect)
3. Se agrega un producto exitosamente (opcional, configurable)

---

## 7. Checkout (Flujo Completo)

Archivo: `app/checkout/page.tsx` (~700 líneas, Client Component)

### Pasos del Checkout

```
1. Tu Información
   └── Email, Nombre (first/last), Teléfono

2. Dirección de Envío
   ├── CP → lookup automático (COPOMEX)
   ├── Autocomplete de calle (Google Places)
   ├── Selector de colonia (dropdown desde COPOMEX)
   ├── Ciudad, Estado, CP (autollenados)
   └── Validación (Google Address Validation API)

3. Resumen del Carrito
   ├── Lista de items (imagen, nombre, precio, cantidad)
   ├── Subtotal, Ahorro (descuento suscripción), Total
   └── Campo de cupón

4. Pago
   ├── Número de tarjeta (Luhn check client-side)
   ├── Nombre del titular
   ├── Fecha de expiración (MM/YY)
   ├── CVV
   └── Tokenización → Openpay

5. Confirmación
   ├── Número de orden
   ├── Total
   ├── Items ordenados
   └── Fecha estimada de entrega
```

### Flujo de Datos del Checkout

```
Usuario llena form
  → Validación client-side
  → Openpay.tokenize(cardData) → token_id
  → Openpay.getDeviceSessionId() → device_session_id
  → medusa.cart.ensure(region_id, customer_id)
  → medusa.cart.addItems(cart_id, items)
  → medusa.cart.update(cart_id, { email, shipping_address })
  → medusa.checkout.createPaymentSession(cart_id)
  → medusa.checkout.completeCart(cart_id, token_id, email, device_session_id)
  → MedusaOrder
  → Mostrar pantalla de confirmación
  → clearCart()
```

---

## 8. Autenticación (Clerk)

### Setup

```tsx
// app/layout.tsx
<ClerkProvider
  appearance={novapatchAppearance}
  localization={esLocalization}
  signInUrl="/sign-in"
  signUpUrl="/sign-up"
  signInFallbackRedirectUrl="/"
  signUpFallbackRedirectUrl="/"
>
```

### Páginas de Auth

- **`/sign-in`**: Clerk `<SignIn>` embedded + panel izquierdo con brand (desktop)
- **`/sign-up`**: Clerk `<SignUp>` embedded + panel izquierdo con beneficios (desktop)
- Ambas usan `routing="path"` (no hash routing)

### Protección de Rutas

```tsx
// app/cuenta/layout.tsx (Server Component)
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function CuentaLayout({ children }) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");
  return <>{children}</>;
}
```

### JWT para Medusa

```tsx
// En Client Components:
const { getToken } = useAuth();
const token = await getToken();
// Se pasa a lib/medusa.ts para endpoints autenticados
```

### Personalización Visual (`lib/clerk-theme.ts`)

- **Card**: Sin chrome (transparent, sin borde, sin sombra) — look "embedded"
- **Colors**: coral como primario, navy como neutral
- **Background**: cream `#FAF7F2` para integrar con el fondo de página
- **Layout**: Links de privacidad/términos/ayuda configurados
- **Localización**: `esMX` de `@clerk/localizations` + overrides de marca

---

## 9. Integración Medusa V2 (`lib/medusa.ts`)

### Cliente Base

```typescript
const BASE = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
const PUB_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY;

async function req<T>(path, options?): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      "x-publishable-api-key": PUB_KEY,
      ...(options?.token && { Authorization: `Bearer ${options.token}` }),
    },
    ...options,
  });
  if (!res.ok) throw new MedusaError(res.status, await res.json());
  return res.json();
}
```

### Módulos del Cliente

#### Catálogo (público)
```typescript
medusa.catalog.getProducts(params?)     // → MedusaProduct[]
medusa.catalog.getVariant(id)           // → MedusaVariant
```

#### Carrito (público)
```typescript
medusa.cart.create(region_id, customer_id?)
medusa.cart.ensure(region_id, customer_id?)     // get or create
medusa.cart.addOnceItem(cart_id, variant_id, qty)
medusa.cart.addSubscriptionItem(cart_id, variant_id, interval_days, discount_pct, qty)
  // → inyecta metadata: { is_subscription: true, interval_days, discount_pct }
medusa.cart.update(cart_id, fields)
medusa.cart.updateItem(cart_id, line_id, qty)
```

#### Checkout (público)
```typescript
medusa.checkout.createPaymentSession(cart_id)
medusa.checkout.completeCart(cart_id, openpay_token_id, email, device_session_id)
  // → MedusaOrder
```

#### Cliente (requiere JWT de Clerk)
```typescript
medusa.customer.sync(token)    // → MedusaCustomer
```

#### Suscripciones (requiere JWT)
```typescript
medusa.subscriptions.list(token)
medusa.subscriptions.pause(sub_id, token)
medusa.subscriptions.resume(sub_id, token)
medusa.subscriptions.cancel(sub_id, token)
medusa.subscriptions.updateFrequency(sub_id, interval_days, token)
```

#### Métodos de Pago (requiere JWT)
```typescript
medusa.paymentMethods.list(token)
medusa.paymentMethods.setDefault(openpay_token_id, token)
```

### Fallback de Productos

`lib/commerce.ts` provee `getProducts()` y `getOrderedProducts()` con fallback a datos hardcoded si Medusa no responde. Esto mantiene la tienda funcional durante desarrollo o si el backend está caído.

---

## 10. Pagos — Openpay (`lib/openpay.ts`)

### Flujo PCI-DSS Compliant

```
1. Cargar SDK (via <Script> en layout.tsx, afterInteractive)
   ├── /openpay.v1.min.js
   └── /openpay-data.v1.min.js (anti-fraude)

2. Inicializar:
   OpenPay.setId(MERCHANT_ID)
   OpenPay.setApiKey(PUBLIC_KEY)
   OpenPay.setSandboxMode(SANDBOX === "true")

3. Generar device session:
   OpenPay.deviceData.setup() → device_session_id

4. Tokenizar tarjeta:
   OpenPay.token.create({
     card_number, holder_name, expiration_year, expiration_month, cvv2
   }) → { id: "tok_XXXX" }

5. Enviar a Medusa:
   medusa.checkout.completeCart(cart_id, "tok_XXXX", email, device_session_id)
   // Medusa se encarga del cargo real en Openpay server-side
```

> **Importante**: Los datos de tarjeta NUNCA pasan por los servidores de Novapatch. Van directo de browser a Openpay, que devuelve un token de un solo uso.

### Validación Client-Side

- **Número**: Algoritmo de Luhn
- **Expiración**: Formato MM/YY, fecha no vencida
- **CVV**: 3-4 dígitos según tipo de tarjeta
- **Mensajes de error**: Traducidos al español

---

## 11. Servicios de Dirección

### COPOMEX (Código Postal → Colonias)

```typescript
// Hook: hooks/useCopomex.ts
const { colonias, municipio, estado, loading } = useCopomex(cp);

// Internamente llama a:
// GET /api/copomex?cp=11560
// El API route inyecta el token server-side
// Response: { municipio, estado, ciudad, colonias: string[] }
// Cache: revalidate 86400s (24h)
```

### Google Places Autocomplete (Autocompletar Calle)

```typescript
// Hook: hooks/useGooglePlaces.ts
useGooglePlaces(inputRef, (place) => {
  // place.street    → "Av. Insurgentes Sur 1602"
  // place.colonia   → "Crédito Constructor"
  // place.city      → "Ciudad de México"
  // place.state     → "CDMX"
  // place.zip       → "03940"
});

// Requiere NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
// Script cargado como singleton (evita duplicados en HMR)
// Dropdown estilizado en globals.css
```

### Google Address Validation (Verificar Dirección)

```typescript
// Llamado desde checkout/page.tsx antes de proceder al pago
// POST /api/validate-address
// Body: { street, colonia, city, state, zip }
// Response: { valid, verdict, issues, standardized }
// Degradación elegante si no está configurado
```

---

## 12. Email — Resend (`app/api/contact/route.ts`)

### Endpoint de Contacto

```
POST /api/contact
Body: { nombre, email, asunto, mensaje }
Response: { ok: true } | { error: "msg" }
```

**Comportamiento**:
- Envía email a `hola@novapatch.care`
- `reply-to` es el email del usuario (para responder directamente)
- Subject: `[Contacto] {Asunto} — {Nombre}`
- HTML template on-brand (navy/coral/cream)
- Error handling + feedback al usuario en UI

---

## 13. API Routes

### `GET /api/copomex?cp={codigo_postal}`

**Propósito**: Proxy para la API de COPOMEX. Oculta el token server-side.

**Response**:
```json
{
  "municipio": "Miguel Hidalgo",
  "estado": "Ciudad de México",
  "ciudad": "México",
  "colonias": ["Modelo Pensil", "Nueva Anzures", "..."]
}
```

---

### `POST /api/validate-address`

**Propósito**: Proxy para Google Address Validation API. Oculta la key server-side.

**Request**:
```json
{ "street": "Privada Lago Bolsena 22", "colonia": "Modelo Pensil", "city": "CDMX", "state": "CDMX", "zip": "11450" }
```

**Response**:
```json
{
  "valid": true,
  "verdict": { "addressComplete": true, "validationGranularity": "PREMISE" },
  "issues": [],
  "standardized": "Privada Lago Bolsena 22, Modelo Pensil, 11450 Miguel Hidalgo, CDMX"
}
```

---

### `POST /api/contact`

**Propósito**: Enviar email de formulario de contacto via Resend.

**Request**:
```json
{ "nombre": "str", "email": "str", "asunto": "pedido|suscripcion|producto|otro", "mensaje": "str" }
```

**Response**: `{ "ok": true }` o `{ "error": "msg" }` con status 400/500.

---

## 14. Páginas — Referencia Rápida

| Ruta | Tipo | Descripción | Protegida |
|------|------|-------------|-----------|
| `/` | Server | Home con secciones de marketing | No |
| `/tienda` | Server + Client | Catálogo de 6 productos | No |
| `/checkout` | Client | Checkout multi-paso | No (pero Clerk opcional) |
| `/checkout/cart` | Server | Redirect a /tienda | No |
| `/cuenta/suscripciones` | Client | Gestión de suscripciones | **Sí (Clerk)** |
| `/sign-in` | Client | Login con Clerk embedded | No |
| `/sign-up` | Client | Registro con Clerk embedded | No |
| `/nosotros` | Server | Historia de la marca | No |
| `/contacto` | Client | Formulario + info de contacto | No |
| `/faq` | Client | FAQs con categorías | No |
| `/garantia` | Server | Garantía 30 días | No |
| `/reembolso` | Client | Wizard de reembolso (5 pasos) | No |
| `/privacidad` | Server | Aviso de privacidad LFPDPPP | No |
| `/terminos` | Server | Términos y condiciones | No |

---

## 15. Componentes Clave

### `Navbar.tsx`

- Fijo en el top (`position: fixed`)
- Muestra logo + ícono carrito + menú hamburguesa (móvil)
- `UserButton` de Clerk si el usuario está autenticado
- Contador de items del carrito (reactivo a `CART_UPDATED_EVENT`)
- Prop `lightBg` para cambiar estilo en páginas con fondo claro

### `CartDrawer.tsx`

- Slide-out desde la derecha
- Muestra items con imagen, nombre, precio, cantidad
- Controles +/- por item
- Botón "Ir a pagar" → `/checkout`
- Reactivo al Context de carrito

### `TiendaExperience.tsx` (`components/store/`)

- Renderiza el grid de productos
- Cada card tiene:
  - Selector de modo: Una vez / Suscripción
  - Selector de frecuencia (si es suscripción): 30/60/90 días
  - Precio dinámico según selección
  - Selector de cantidad
  - Botón "Agregar al carrito"

---

## 16. Gestión de Suscripciones (`/cuenta/suscripciones`)

**Estado actual**: Frontend completo con mock data mientras la integración de Medusa se completa.

### UI por Suscripción

- Badge de estado: Activa (verde) / Pausada (naranja) / Cancelada (rojo)
- Cambio de frecuencia: Dropdown (30/60/90 días)
- Toggle Pausar/Reanudar
- Botón Cancelar (con confirmación)

### Métodos de Pago

- Lista de tarjetas guardadas con last4 + expiración
- Indicador de tarjeta predeterminada
- Modal para agregar nueva tarjeta (tokenización Openpay)

---

## 17. Scripts de Terceros (`app/layout.tsx`)

```tsx
// Cargados con strategy="afterInteractive" (no bloquean render)
<Script src="https://js.openpay.mx/openpay.v1.min.js" strategy="afterInteractive" />
<Script src="https://js.openpay.mx/openpay-data.v1.min.js" strategy="afterInteractive" />
```

**Google Maps** se carga como singleton desde `hooks/useGooglePlaces.ts` cuando se monta el componente de checkout.

---

## 18. Tareas Pendientes / Gaps

| Feature | Estado | Notas |
|---------|--------|-------|
| Formulario de reembolso | ⚠️ Mock | `handleSubmit` simula éxito; necesita API route + integración Medusa |
| Sincronización customer Medusa | ⚠️ Parcial | `medusa.customer.sync(token)` implementado pero no integrado al flujo de Clerk |
| Tracking de órdenes | ❌ Pendiente | No existe página; link en confirmación de compra es placeholder |
| Métodos de pago (backend) | ⚠️ Parcial | UI completa; backend de Medusa pendiente |
| Multi-región Brasil | ❌ Planificado | Requiere i18n, rutas `/br/*`, MercadoPago, pt-BR |
| Detección geolocalización | ❌ Planificado | Middleware Next.js con `req.geo` de Vercel |
| Analytics (PostHog) | ❌ Pendiente | No configurado |
| Error tracking (Sentry) | ❌ Pendiente | No configurado |
| Tests E2E (Playwright) | ❌ Pendiente | Planeado en PRD original |
| Notificaciones de suscripción | ❌ Pendiente | Depende de Temporal.io (no integrado) |

---

## 19. Comandos de Desarrollo

```bash
# Desde apps/storefront/
pnpm install        # Instalar dependencias
pnpm run dev        # Dev server → http://localhost:3000
pnpm run build      # Build de producción
pnpm run start      # Correr build de producción
pnpm run lint       # ESLint
```

---

## 20. Deploy

**Frontend**: Vercel (branch `main` → auto-deploy)
**Backend Medusa**: Railway

### Variables de Entorno en Vercel

Las mismas que `.env.local` pero configuradas en **Vercel → Settings → Environment Variables**. Las keys deben ser de **producción** (`pk_live_`, `sk_live_`) no de desarrollo.

### DNS (Namecheap → novapatch.care)

| Type | Host | Value |
|------|------|-------|
| `A Record` | `@` | `76.76.21.21` (Vercel) |
| `CNAME` | `www` | `cname.vercel-dns.com` |
| `CNAME` | `clerk` | `frontend-api.clerk.services` |
| `CNAME` | `accounts` | `accounts.clerk.services` |
| `CNAME` | `clkmail` | `mail.p34ixe9hlpk3.clerk.services` |
| `CNAME` | `clk._domainkey` | `dkim1.p34ixe9hlpk3.clerk.services` |
| `CNAME` | `clk2._domainkey` | `dkim2.p34ixe9hlpk3.clerk.services` |
| `CNAME` | `dashboardmx` | `792ece9011525db3.vercel-dns-017.com` |
| `CNAME` | `fo3lmi4yxn2n` | `gv-dvy2uroydc2lyt.dv.googlehosted.com` (Google Workspace) |

---

## 21. Convenciones de Código

- **Server Components**: Default. Async, pueden hacer fetch directo.
- **Client Components**: `"use client"` solo cuando necesario (interactividad, hooks, browser APIs).
- **Path Alias**: `@/` → `apps/storefront/` (configurado en `tsconfig.json`)
- **Estilos**: Tailwind inline preferred. `cn()` de `lib/utils.ts` para condicionales.
- **Tipado**: TypeScript strict. No `any` salvo casos justificados con comentario.
- **Imágenes**: Siempre `next/image` con `width`, `height`, y `priority` en above-the-fold.
- **Animaciones**: Framer Motion con `viewport={{ once: true }}` para scroll reveals.
