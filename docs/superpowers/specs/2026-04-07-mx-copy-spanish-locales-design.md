# Design: Unificar copy en español usando mx como base

**Fecha:** 2026-04-07
**Estado:** Aprobado

## Contexto

El storefront de Novapatch soporta 5 locales: `mx`, `br`, `ar`, `cl`, `co`. Los archivos de mensajes de `ar`, `cl` y `co` tienen copy de marketing diferente al de `mx` (distintos slogans, tonos regionales, algunas keys en voseo). La intención actual es arrancar con un copy unificado en español y diferenciarlo por país más adelante.

## Objetivo

Reemplazar el copy de marketing de `ar.json`, `cl.json` y `co.json` con el copy de `mx.json`, manteniendo intactos todos los datos locales.

## Archivos afectados

| Archivo | Acción |
|---|---|
| `messages/ar.json` | Reemplazar secciones de copy |
| `messages/cl.json` | Reemplazar secciones de copy |
| `messages/co.json` | Reemplazar secciones de copy |
| `messages/mx.json` | Sin cambios (fuente de verdad) |
| `messages/br.json` | Sin cambios (portugués) |

## Qué se copia desde `mx.json`

### Secciones completas
- `nav` — navegación principal
- `footer` — pie de página completo (incluyendo `markets`, que es idéntico en todos los locales)
- `home` — todo el copy de la página principal (hero, howItWorks, absorption, comparison, testimonials, cta, faq)

### Sección `legal` — copia parcial
Se copian estas keys:
- `legal.badge`
- `legal.contactTitle`
- `legal.contactSubtitle`
- `legal.terms.title`
- `legal.privacy.title`
- `legal.refund.title`
- `legal.warranty.title`

Se **mantiene** `legal.lastUpdated` de cada locale — contiene la referencia a la ley aplicable del país.

## Qué NO se toca

- `meta` — moneda, símbolo, locale, país, taxLabel, paymentProvider, supportEmail
- `checkout.paymentMethods` — descripción de métodos de pago por región

## Estado futuro

Cuando se diferencie el copy por país, se editan directamente los archivos `ar.json`, `cl.json` o `co.json` sin cambios arquitectónicos. Cada archivo es autónomo.

## Enfoque técnico

Edición directa de los tres archivos JSON. No hay cambios en la arquitectura de i18n (`i18n/request.ts`, `i18n/routing.ts`, `middleware.ts`).
