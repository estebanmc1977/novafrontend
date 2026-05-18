# Smoke Manual Semanal — Checkout Verification

**Frecuencia:** Una vez por semana (lunes ~10am CDMX)
**Tiempo:** 5-10 min
**Responsable:** Diego (founder)

## Por qué

El L3 automatizado corre diario y valida hasta la creación del payment session. El L4 que validaría el cobro real + webhook + email + Slack está pausado porque Openpay producción fuerza 3DS y el smoke unattended no puede completarlo.

Mientras tanto, **un humano comprando una vez por semana** valida más cosas que el L4: frontend, UX del checkout, 3DS real, email visualmente OK, Slack notification, label NO generada (gracias al guard de smoke_test).

## Pre-requisitos one-time (ya hechos)

- Customer `smoke@novapatch.care` en Medusa admin
- Alias `smoke@novapatch.care` → `cristian@novapatch.care` en Google Workspace
- Customer group `smoke-test-only` con ese customer adentro
- Dos promotions activas (ambas con customer group restriction):
  - `SMOKE-INTERNAL-328016b3` — 99% off product
  - `SMOKE-INTERNAL-328016b3-SHIP` — free shipping
- Backend deployed con guard `metadata.smoke_test=true` en envia-fulfillment + flag `🧪 [SMOKE]` en Slack mapper

## Checklist semanal

### 1. Comprar como `smoke@novapatch.care`

- [ ] Abrí incógnito o cerrá sesión de cualquier customer
- [ ] Andá a https://www.novapatch.care/tienda
- [ ] Elegí el producto más barato (single-pack `energy` o el que esté de oferta)
- [ ] En el checkout:
  - Email: **`smoke@novapatch.care`** (crítico — sin esto los promos no aplican)
  - Dirección: cualquier MX válida (poné `Smoke Test` como nombre para identificar)
  - Aplicá **ambos** códigos: `SMOKE-INTERNAL-328016b3` y `SMOKE-INTERNAL-328016b3-SHIP`
- [ ] Confirmá que el total queda ≤ $30 MXN (si es más, alguno de los promos falló — abortá y reportá)
- [ ] Tarjeta: la tuya personal o virtual con límite bajo
- [ ] Completá el 3DS challenge en tu banco
- [ ] Esperá confirmación de orden en pantalla

### 2. Marcar la order como smoke_test=true

⚠️ **Importante:** sin esta marca, Envia te va a generar una etiqueta real (~$80-130 MXN). El subscriber lo guardea solo si `metadata.smoke_test=true`.

**Hacelo INMEDIATO después de confirmar la compra** (idealmente en <30s, antes de que el webhook dispare envia-fulfillment):

- [ ] Andá a https://admin.novapatch.care/orders
- [ ] Abrí la order recién creada
- [ ] Editá **Metadata** → agregá clave `smoke_test` valor `true` (boolean, no string)
- [ ] Save

**Si te tardás:** chequeá Envia dashboard. Si hay label nueva → cancelala manualmente desde Envia para que reembolsen. No es el fin del mundo, pero por eso conviene ser rápido.

> **Mejora futura:** mover la marca a frontend (que el cart se cree con `metadata.smoke_test=true` desde el primer request) eliminaría esta carrera. Está anotado como deuda.

### 3. Validar side effects (~3 min)

Verificá que cada uno de estos pasó:

- [ ] **Openpay dashboard** → hay un charge de ~$1-5 MXN tuyo, status `completed`
- [ ] **Slack `#orders`** → llegó mensaje con header **`🧪 [SMOKE] Cobro confirmado`** (si dice `💳 Cobro confirmado` sin el flag, el metadata no se guardó a tiempo o el subscriber no lo vio)
- [ ] **Tu inbox (`cristian@novapatch.care`)** → llegó el email de confirmación de orden. **Abrilo y revisá visualmente** que se vea OK (no roto, links funcionan, branding correcto)
- [ ] **Envia dashboard** → **NO** hay label nueva para esta order (si hay → revisá si la marcaste a tiempo)
- [ ] **Medusa admin** → la order existe, total bajo, items correctos

### 4. Cleanup

- [ ] **Medusa admin** → cancelar la order (esquina superior derecha → Cancel)
- [ ] **Openpay** → opcional: refund del residual (~$1-5 MXN, no vale la pena salvo que querés costo cero)

### 5. Anotar

Llevá un mini-log para detectar tendencias:

| Fecha | Total cobrado | 3DS pasó? | Email OK? | Slack OK? | Notas |
|---|---|---|---|---|---|
| 2026-05-18 | $X | ✅ | ✅ | ✅ | Primera ejecución manual |
| ... | | | | | |

Si algo falla 2 semanas seguidas → bug real, investigar.

## Si pasa algo raro

- **Promo no aplica** → revisar que el email del checkout sea exactamente `smoke@novapatch.care` y que el customer esté en el grupo `smoke-test-only` (admin → customer → groups)
- **3DS no se dispara** → tu banco probablemente lo desactivó. Mirá si la orden quedó como `captured` directo. Igual sirve como smoke; anotalo
- **Email no llega** → revisá spam de `cristian@novapatch.care`. Si no está ni ahí → bug de Resend o del subscriber
- **Slack no muestra `[SMOKE]`** → el flag de metadata se guardó tarde. Próxima vez sé más rápido en el paso 2

## Cuándo automatizar de nuevo

Despertá el L4 cuando:
- Tengas equipo de ≥2 personas (no depender de una persona para el chequeo)
- Openpay habilite bypass de 3DS para customers específicos (preguntar a soporte)
- Tengas un sandbox de Openpay que comparta config con prod (improbable)

Mientras tanto, el spec y el plan del L4 quedan en el repo:
- `novabackend/docs/superpowers/specs/2026-05-17-smoke-l4-full-checkout-design.md`
- `novabackend/docs/superpowers/plans/2026-05-17-smoke-l4-full-checkout.md`
