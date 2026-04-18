# Checkout: Número Interior e Indicaciones de Entrega

**Date:** 2026-04-18  
**Branch:** feature/influencers-medusa-integration  
**Status:** Approved

## Overview

Add two optional fields to the shipping address form in checkout:
1. **Número interior** — short text (e.g. "4B", "Depto 3")
2. **Indicaciones de entrega** — textarea for delivery instructions (e.g. "Edificio azul, no llamar por teléfono")

Both fields must propagate to the carrier shipping label AND be stored as structured data in Medusa.

## Affected Files

- `apps/storefront/app/[locale]/checkout/page.tsx` — sole file to modify

## Design

### 1. Form State

Add two fields to the `address` state object (around line 330):

```typescript
const [address, setAddress] = useState({
  street: "",
  colonia: "",
  city: "",
  state: "",
  zip: "",
  interior: "",       // optional, max 20 chars
  instructions: "",   // optional, max 200 chars
});
```

### 2. UI Fields

Inserted in the address section after the `street` field:

- **Número interior** — `<input type="text">`, label "Número interior (opcional)", placeholder "Ej. 4B, Depto 3", maxLength 20
- **Indicaciones de entrega** — `<textarea>`, label "Indicaciones de entrega (opcional)", placeholder "Ej. Edificio azul, no llamar por teléfono", maxLength 200, ~3 rows

Both fields are optional — no changes to existing validation logic.

### 3. Medusa Payload

On form submit, the `medusa.cart.update()` call is updated:

```typescript
shipping_address: {
  // existing fields unchanged...
  address_1: address.interior
    ? `${address.street} Int ${address.interior}`
    : address.street,
  address_2: address.instructions
    ? `${address.colonia} | ${address.instructions}`
    : address.colonia,
  // city, province, postal_code, country_code, phone unchanged
},
metadata: {
  numero_interior: address.interior || null,
  indicaciones_entrega: address.instructions || null,
},
```

**Concatenation is conditional:** if both new fields are empty, `address_1` and `address_2` are identical to today's output — no regression.

The `metadata` field is supported natively by Medusa's `POST /store/carts/:id` endpoint.

### 4. Order Summary Display

Where the confirmed address is shown to the user (checkout summary), render the interior inline with the street and instructions as a separate line below:

```
Insurgentes Sur 1457 Int 4B
Del Valle
Ciudad de México, CDMX 03100

Indicaciones: Edificio azul, no llamar por teléfono
```

Interior and instructions are read from local state — no additional Medusa fetch needed.

## Out of Scope

- Backend changes (no Medusa plugin modifications required)
- Carrier-specific delivery instruction fields (instructions reach the carrier via `address_2`)
- Saved addresses / address book
- Brazil region (not yet implemented)
