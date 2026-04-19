# Pre-Launch Testing Suite — Novapatch

**Date:** 2026-04-18  
**Environment:** `www.novapatch.care` (Vercel frontend + Railway backend, todas las claves prod excepto Openpay sandbox)  
**Approach:** Playwright E2E (frontend) + Vitest + supertest (backend integration) + k6 load test + Lighthouse CI + runbook manual

---

## Scope

| Area | Tool | Cómo se valida |
|---|---|---|
| Flujos UI críticos | Playwright E2E | Automatizado |
| Edge cases de backend (webhooks, suscripciones, BullMQ) | Vitest + supertest | Automatizado (estado en Medusa) |
| Cobros en Openpay | Manual | Dashboard sandbox de Openpay |
| Performance | k6 + Lighthouse CI | Automatizado |
| Emails, SPF/DKIM, R2, Clerk prod | Runbook manual | Checklist humano |
| Regresiones en CI | Playwright smoke | Automatizado en cada PR |

---

## Estructura de archivos

```
novafrontend/
  tests/
    e2e/
      auth/
        login.spec.ts
        cart-persistence.spec.ts
      checkout/
        happy-path.spec.ts
        declined-card.spec.ts
        coupon.spec.ts
      smoke/
        critical-paths.spec.ts        # CI — corre en cada PR

novabackend/
  tests/
    integration/
      payments/
        webhook-idempotency.test.ts
        partial-capture.test.ts
      subscriptions/
        renewal-cycle.test.ts
        cancel-mid-cycle.test.ts
        pause-resume.test.ts
      jobs/
        bullmq-idempotency.test.ts

scripts/
  load-test.js                        # k6
  lighthouse.js                       # @lhci/cli

.github/workflows/
  smoke.yml
```

---

## Playwright E2E (novafrontend)

### Prerequisito
Cuenta de cliente de prueba existente en Clerk prod. Credenciales en `.env.test` (no en repo).  
Tarjetas Openpay sandbox: `4111111111111111` (éxito), `4000000000000002` (decline). **Validar estos números en la documentación de Openpay México antes de implementar.**

### `checkout/happy-path.spec.ts`
1. Login con cuenta de prueba (Clerk prod)
2. Agregar producto desde homepage o `/tienda`
3. Completar checkout con tarjeta sandbox exitosa
4. Verificar orden en Medusa con status `payment_captured`
5. Verificar que llega email de confirmación a la cuenta de prueba

### `checkout/declined-card.spec.ts`
1. Login → agregar producto → checkout con tarjeta de decline
2. Verificar que el storefront muestra mensaje de error legible (no pantalla en blanco ni "Error 500")
3. Verificar via API de Medusa que no existe orden en status `pending` o `payment_initiated` para ese carrito (sin zombie order)

### `checkout/coupon.spec.ts`
1. Aplicar cupón válido + elegir modo suscripción
2. Completar compra
3. Verificar que el descuento aparece en la orden del primer ciclo
4. Verificar via API que `subscription.metadata` no propaga el cupón al campo que afecta `next_billing_date`

### `auth/login.spec.ts`
1. Registro de nuevo usuario contra Clerk prod
2. Login con credenciales existentes
3. Flujo de recuperación de contraseña (envío de email de reset)

### `auth/cart-persistence.spec.ts`
1. Agregar ítems al carrito como usuario autenticado
2. Logout
3. Login
4. Verificar estado del carrito según diseño (documentar si el comportamiento esperado es carrito persistente o vacío)

### `smoke/critical-paths.spec.ts` (CI)
Corre en cada PR. Máximo 90 segundos. Sin pagos ni emails.
1. Homepage carga con productos visibles
2. `/tienda` carga con productos visibles
3. Carrito abre correctamente
4. `GET /api/store/products` responde HTTP 200

---

## Tests de integración backend (novabackend)

### Setup
- Framework: Vitest + supertest
- Los tests llaman al backend en Railway (`BACKEND_URL` desde env)
- Assertions solo sobre estado en Medusa (status de orden, suscripción, `next_billing_date`, conteo de órdenes)
- Los cobros en Openpay sandbox se validan manualmente en el dashboard

### `payments/webhook-idempotency.test.ts`
1. Enviar payload de webhook de Openpay al endpoint `/api/webhooks/openpay` con el mismo `transaction.id`
2. Enviar el mismo payload una segunda vez
3. Verificar que el estado de la orden en Medusa no cambió dos veces (idempotencia)
4. **Nota:** Si el backend no tiene deduplicación Redis para este webhook (como sí tiene Envia), este test la descubrirá y se deberá implementar antes del lanzamiento.

### `payments/partial-capture.test.ts`
1. Enviar webhook con status `in_progress` al endpoint
2. No enviar el webhook de `completed` (simular timeout)
3. Verificar que la orden queda en estado definido (no `payment_captured`)
4. Verificar que no se reintenta el cobro automáticamente

### `subscriptions/renewal-cycle.test.ts`
1. Crear suscripción de prueba vía API de Medusa
2. Setear `next_billing_date` a hace 1 minuto via API
3. Disparar manualmente el job `process-daily-subscriptions`
4. Verificar que se creó una nueva orden en Medusa
5. Verificar que `next_billing_date` avanzó al siguiente ciclo correcto
6. Validar cobro en dashboard de Openpay sandbox

### `subscriptions/cancel-mid-cycle.test.ts`
1. Crear suscripción activa de prueba
2. Cancelar via API (`cancel-subscription` workflow)
3. Forzar ejecución del job de billing
4. Verificar que no se generó nueva orden en Medusa para esa suscripción
5. Verificar que el status en Medusa es `canceled`

### `subscriptions/pause-resume.test.ts`
1. Pausar suscripción activa via API
2. Correr job de billing → verificar sin nueva orden
3. Reactivar suscripción via API
4. Correr job de billing → verificar nueva orden creada y `next_billing_date` avanzado
5. Validar cobro en dashboard de Openpay sandbox

### `jobs/bullmq-idempotency.test.ts`
1. Encolar el job de billing dos veces para la misma suscripción con el mismo `next_billing_date`
2. Verificar que en Medusa solo existe una orden nueva (no dos)
3. Verificar que `next_billing_date` solo avanzó una vez
4. Validar en Openpay sandbox que solo aparece un cargo

---

## Scripts de performance

### k6 — `scripts/load-test.js`
- **Escenario:** 50 usuarios concurrentes virtuales
- **Flujo:** `GET /tienda` → `GET /api/store/products` → `POST /api/store/carts` → `POST /api/store/carts/:id/line-items`
- **Sin checkout** — no cobra nada
- **Thresholds:** p95 de latencia < 2000ms, error rate < 1%
- **Ejecutar:** `k6 run scripts/load-test.js --env BASE_URL=https://www.novapatch.care`

### Lighthouse CI — `scripts/lighthouse.js`
- **Rutas:** homepage (`/`) y `/tienda`
- **Tool:** `@lhci/cli`
- **Thresholds mínimos:** Performance > 70, LCP < 4s, CLS < 0.1
- **Ejecutar:** `lhci autorun` con configuración en `lighthouserc.js`

---

## CI — GitHub Actions

### `.github/workflows/smoke.yml`
- **Trigger:** en cada PR hacia `main`
- **Steps:** instalar deps → `playwright test tests/e2e/smoke/`
- **Timeout:** 5 minutos máximo
- **No requiere** credenciales de Openpay ni Resend

---

## Runbook manual (pre-lanzamiento)

Checklist que un humano ejecuta una vez antes del go-live. Marcar cada ítem con fecha y resultado.

| # | Test | Pasos | Resultado esperado |
|---|---|---|---|
| 1 | SPF/DKIM | Enviar email desde Resend prod a mail-tester.com | Score ≥ 9/10 |
| 2 | Email rendering — confirmación de orden | Abrir email en Gmail, Outlook, Apple Mail | Sin elementos rotos, texto legible, CTAs visibles |
| 3 | Email rendering — envío con tracking | Abrir email en Gmail, Outlook, Apple Mail | Link de rastreo válido y clickeable |
| 4 | Email rendering — suscripción bienvenida | Abrir email en Gmail, Outlook, Apple Mail | Sin elementos rotos |
| 5 | Cloudflare R2 | Inspeccionar URLs de imágenes en producción | Dominio propio (no `*.r2.cloudflarestorage.com`) |
| 6 | Clerk prod — registro | Crear cuenta nueva con email real | Email de verificación llega, cuenta activa |
| 7 | Clerk prod — login | Login con cuenta existente | Sesión activa, redirige correctamente |
| 8 | Clerk prod — recuperación contraseña | Solicitar reset con email real | Email de reset llega, contraseña actualizable |
| 9 | Sync Clerk → Medusa | Completar registro nuevo → verificar en Medusa | Customer creado en Medusa con mismo email |
| 10 | Openpay 3DS | Checkout con tarjeta que requiere 3DS en sandbox | Redirige a página de banco, vuelve con resultado correcto |

---

## Criterios de aceptación para go-live

- [ ] Todos los tests de Playwright E2E pasan
- [ ] Todos los tests de integración de backend pasan
- [ ] Openpay sandbox: sin cobros duplicados visibles en dashboard en los tests de idempotencia
- [ ] k6: p95 < 2s, error rate < 1% con 50 usuarios concurrentes
- [ ] Lighthouse: Performance > 70 en homepage y `/tienda`
- [ ] Runbook manual: todos los ítems marcados con "pass"
- [ ] mail-tester.com: score ≥ 9/10
