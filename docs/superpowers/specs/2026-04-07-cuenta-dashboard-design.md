# Diseño: Mi Cuenta Dashboard

**Fecha**: 2026-04-07
**Branch**: `feat/cuenta-dashboard`
**Scope**: Suscripciones reales + Historial de órdenes en `/cuenta`

---

## Resumen

Consolidar la gestión de cuenta del usuario en una sola página `/cuenta` con tabs, reemplazando el actual redirect. Conectar suscripciones y método de pago a los endpoints reales de Medusa. Agregar historial de órdenes.

**Fuera de scope**: Cupones (backend no implementado), detalle de orden individual, facturación.

---

## Routing

```
/cuenta                         → página principal "Mi cuenta" (nueva)
/cuenta?tab=suscripciones       → tab Suscripciones (default)
/cuenta?tab=pedidos             → tab Pedidos
/cuenta?tab=pago                → tab Pago
/cuenta/suscripciones           → redirect a /cuenta?tab=suscripciones
```

`app/cuenta/layout.tsx` — sin cambios (auth guard con Clerk ya funciona).

---

## Estructura de Archivos

```
app/cuenta/
├── page.tsx                    # NUEVO: página completa "Mi cuenta"
└── suscripciones/
    └── page.tsx                # MODIFICAR: redirect → /cuenta?tab=suscripciones
```

Todo el UI vive en `page.tsx`. Sin componentes separados.

---

## API Endpoints

Todos los métodos usan el JWT de Clerk via `useAuth()`.

| Método | Endpoint Medusa | Existe en `lib/medusa.ts` |
|--------|----------------|--------------------------|
| `subscriptions.list(token)` | `GET /store/me/subscriptions` | ✅ |
| `subscriptions.pause(id, token)` | `POST /store/me/subscriptions/:id/pause` | ✅ |
| `subscriptions.resume(id, token)` | `POST /store/me/subscriptions/:id/resume` | ✅ |
| `subscriptions.cancel(id, token)` | `POST /store/me/subscriptions/:id/cancel` | ✅ |
| `subscriptions.updateFrequency(id, days, token)` | `POST /store/me/subscriptions/:id/frequency` | ✅ |
| `orders.list(token)` | `GET /store/orders?customer_id=...` | ❌ NUEVO |
| `paymentMethods.list(token)` | `GET /store/me/payment-methods` | ✅ |
| `customer.sync(token)` | `POST /store/me/customer` | ✅ |

**Único cambio a `lib/medusa.ts`**: agregar `orders.list(token)`.

---

## Flujo de Carga

```
1. useAuth() → obtener JWT de Clerk
2. medusa.customer.sync(token)        → asegurar customer en Medusa
3. En paralelo (Promise.all):
   - medusa.subscriptions.list(token)
   - medusa.orders.list(token)
   - medusa.paymentMethods.list(token)
4. Cada tab maneja su propio estado independientemente
```

---

## Componentes (todos en `page.tsx`)

```
<MiCuentaPage>
  Header: "Mi cuenta" + "Hola, {nombre}"
  <TabNav tabs={["Suscripciones", "Pedidos", "Pago"]} />

  <TabSuscripciones>
    Sección "Requieren atención" (past_due, delayed_out_of_stock) — si aplica
    Sección "Activas" — cards de suscripciones activas
    Sección "Pausadas" — cards de suscripciones pausadas
    Sección "Canceladas" — cards minimizadas (solo nombre + fecha cancelación)
    Estado vacío: "Sin suscripciones activas → ir a tienda"

  <SubscriptionCard sub={sub}>
    Imagen producto + nombre + precio/entrega
    Frecuencia (clickable → selector 30/60/90 días)
    Próxima entrega
    Badge de status
    Acciones: Pausar / Reanudar | Cancelar (con confirmación inline)

  <TabPedidos>
    Lista de órdenes ordenadas por fecha DESC
    <OrderRow order={order}>
      Número de orden + fecha
      Thumbnails de productos (máx 3, +N si hay más)
      Total
      Badge de status (pending/processing/shipped/delivered/cancelled)
    Estado vacío: "Sin pedidos → ir a tienda"

  <TabPago>
    Tarjeta guardada: tipo (Visa/MC) + last4 + vencimiento + badge "Principal"
    Botón "+ Agregar" (abre tokenización Openpay — funcionalidad existente)
    Nota de seguridad Openpay
```

---

## Estados de UI por Tab

| Estado | Comportamiento |
|--------|---------------|
| `loading` | Skeleton placeholders |
| `empty` | Mensaje + CTA a /tienda |
| `error` | Mensaje genérico + botón "Reintentar" |
| `data` | Contenido normal |

---

## Acciones y Error Handling

### Optimistic UI (pause/resume/frecuencia)
- Cambio reflejado en UI inmediatamente
- Si API falla → revertir estado + mostrar error inline en la card
- No hay toasts globales — el error vive en la card afectada

### Cancelar suscripción
- **Sin modal**. Flujo inline en 2 clicks:
  1. Click "Cancelar suscripción" → botón cambia a "¿Confirmar cancelación?"
  2. Click confirmación → llama API → mueve card a sección "Canceladas"
  3. Click en cualquier otro lugar → cancela la acción

### Customer sync fallido
- No bloquea la página
- Cada tab muestra su propio error con "Reintentar"

### Status `past_due` / `delayed_out_of_stock`
- Sección separada "Requieren atención" al tope del tab Suscripciones
- Badge de aviso naranja/rojo
- Sin acciones de pausar/frecuencia (solo contacto de soporte)

---

## Tipos Esperados de Medusa

```typescript
// Ya en lib/medusa.ts
type MedusaSubscription = {
  id: string;
  status: "active" | "paused" | "cancelled" | "past_due" | "delayed_out_of_stock";
  interval_days: 30 | 60 | 90;
  next_delivery_at: string;        // ISO date
  product_title: string;
  variant_id: string;
  unit_price: number;
  quantity: number;
  created_at: string;
}

// NUEVO — para historial de órdenes
type MedusaOrder = {
  id: string;
  display_id: number;              // Número legible de orden
  created_at: string;
  status: string;                  // pending | processing | shipped | delivered | cancelled
  total: number;
  items: Array<{
    title: string;
    thumbnail: string;
    quantity: number;
    unit_price: number;
  }>;
}
```

---

## Trabajo Existente Reutilizable

En `git stash` (rama `copy-edits`) hay una implementación parcial de `/cuenta/page.tsx` con:
- UI completa de suscripciones con mock data
- Estilos y diseño visual aprobado
- Lógica de acciones (pause/resume/cancel/frecuencia)

**Estrategia**: recuperar el stash, tomar el UI/estilos, reemplazar mock data con llamadas reales a Medusa.

---

## Definición de Listo

- [ ] `/cuenta` carga datos reales de Medusa (suscripciones, órdenes, método de pago)
- [ ] Pause/resume/cancel/frecuencia funcionan contra el backend
- [ ] Cancelación requiere confirmación inline (sin modal)
- [ ] Historial de órdenes muestra datos reales
- [ ] Estados loading/empty/error en cada tab
- [ ] `/cuenta/suscripciones` redirige a `/cuenta?tab=suscripciones`
- [ ] Funciona en mobile
