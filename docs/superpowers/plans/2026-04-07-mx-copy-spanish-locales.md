# Unificar copy en español con mx como base — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reemplazar el copy de marketing de `ar.json`, `cl.json` y `co.json` con el copy de `mx.json`, manteniendo intactos `meta`, `checkout` y `legal.lastUpdated`.

**Architecture:** Edición directa de los tres archivos JSON de mensajes. Las secciones `nav`, `footer`, `home` se reemplazan completas. De `legal` se reemplazan todas las keys excepto `lastUpdated`. No hay cambios en la arquitectura de i18n.

**Tech Stack:** JSON, next-intl, Next.js 15

---

## Archivos modificados

| Archivo | Acción |
|---|---|
| `apps/storefront/messages/ar.json` | Reemplazar `nav`, `footer`, `home`, `legal` (parcial) |
| `apps/storefront/messages/cl.json` | Reemplazar `nav`, `footer`, `home`, `legal` (parcial) |
| `apps/storefront/messages/co.json` | Reemplazar `nav`, `footer`, `home`, `legal` (parcial) |

---

## Task 1: Actualizar `ar.json`

**Files:**
- Modify: `apps/storefront/messages/ar.json`

- [ ] **Step 1: Reemplazar el contenido de `ar.json`**

Reemplazar el archivo completo con el siguiente contenido (preserva `meta`, `checkout` y `legal.lastUpdated` de Argentina):

```json
{
  "nav": {
    "tienda": "Tienda",
    "suscripciones": "Suscripciones",
    "nosotros": "Nosotros",
    "cuenta": "Mi Cuenta",
    "signIn": "Iniciar sesión",
    "signUp": "Registrarse"
  },
  "footer": {
    "sections": {
      "comprar": "Comprar",
      "ayuda": "Ayuda",
      "nosotros": "Nosotros",
      "legal": "Legal"
    },
    "links": {
      "tienda": "Tienda",
      "suscripciones": "Suscripciones",
      "garantia": "Garantía",
      "contacto": "Contáctanos",
      "faq": "Preguntas frecuentes",
      "reembolso": "Solicitar reembolso",
      "nosotros": "Nosotros",
      "porQue": "¿Por qué parches?",
      "suscribeteAhorra": "Suscríbete y ahorra",
      "privacidad": "Aviso de Privacidad",
      "terminos": "Términos y Condiciones"
    },
    "newsletter": {
      "label": "Novedades y ofertas",
      "placeholder": "tu@correo.com",
      "button": "Suscribirse",
      "success": "¡Gracias por suscribirte!"
    },
    "social": {
      "followUs": "Síguenos"
    },
    "selectCountry": "País",
    "markets": {
      "mx": "México",
      "br": "Brasil",
      "ar": "Argentina",
      "cl": "Chile",
      "co": "Colombia"
    },
    "copyright": "© {year} Novapatch. Todos los derechos reservados.",
    "tagline": "Bienestar que no interrumpe tu día"
  },
  "home": {
    "hero": {
      "badge": "Parches de bienestar",
      "title": "Bienestar que no interrumpe tu día.",
      "subtitle": "Sin cápsulas. Sin horarios. Sin agua. Un solo parche y listo — el resto del día es tuyo.",
      "cta": "Conoce los parches",
      "ctaSecondary": "¿Cómo funciona?"
    },
    "howItWorks": {
      "badge": "Uso diario",
      "title": "Así de simple.",
      "step1Title": "Eliges tu parche",
      "step1Desc": "Energy, Sleep, Zen, Shield, Glow o Woman. Uno solo, según lo que necesitas hoy.",
      "step2Title": "Lo pones en segundos",
      "step2Desc": "En piel limpia, donde te sea cómodo. Sin agua, sin planificación, sin ritual.",
      "step3Title": "Listo. Ya está.",
      "step3Desc": "Durante las próximas horas el parche trabaja mientras tú vives tu día normal."
    },
    "absorption": {
      "badge": "La ciencia",
      "title": "No cualquier ingrediente funciona en un parche.",
      "subtitle": "Para atravesar la piel, un ingrediente necesita tener menos de 500 Daltons de masa molecular. El resultado: absorción directa al torrente sanguíneo, sin pasar por el sistema digestivo, durante entre 10 y 12 horas continuas.",
      "stat1Value": "<500",
      "stat1Label": "Tamaño molecular",
      "stat2Value": "10–12",
      "stat2Label": "Absorción sostenida",
      "stat3Value": "0",
      "stat3Label": "Digestión requerida"
    },
    "comparison": {
      "badge": "Comparativa",
      "title": "¿Pastillas, gomitas o parches?",
      "colNovapatch": "Parche",
      "colTraditional": "Cápsulas comunes"
    },
    "testimonials": {
      "badge": "Lo que dicen",
      "title": "Miles ya lo sienten"
    },
    "cta": {
      "title": "Tu rutina de bienestar, sin interrupciones",
      "subtitle": "Elige la frecuencia que mejor se adapte a tu ritmo. Pausa, cambia o cancela cuando quieras.",
      "button": "Elegir plan"
    },
    "faq": {
      "badge": "Resolvemos tus dudas",
      "title": "¿Tienes dudas?"
    }
  },
  "checkout": {
    "paymentMethods": {
      "title": "Método de pago",
      "description": "Pagá con tarjeta de crédito/débito o transferencia"
    }
  },
  "legal": {
    "badge": "Legal",
    "lastUpdated": "Última actualización: enero de 2025 · Ley aplicable: Argentina",
    "contactTitle": "¿Tienes alguna duda legal?",
    "contactSubtitle": "Contáctanos en cualquier momento.",
    "terms": {
      "title": "Términos y Condiciones"
    },
    "privacy": {
      "title": "Aviso de Privacidad"
    },
    "refund": {
      "title": "Política de Reembolso"
    },
    "warranty": {
      "title": "Garantía"
    }
  },
  "meta": {
    "currency": "ARS",
    "currencySymbol": "$",
    "locale": "es-AR",
    "country": "Argentina",
    "taxLabel": "IVA 21%",
    "paymentProvider": "mercadopago",
    "supportEmail": "soporte@novapatch.com.ar"
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/storefront/messages/ar.json
git commit -m "feat(i18n): sync ar copy with mx as base"
```

---

## Task 2: Actualizar `cl.json`

**Files:**
- Modify: `apps/storefront/messages/cl.json`

- [ ] **Step 1: Reemplazar el contenido de `cl.json`**

```json
{
  "nav": {
    "tienda": "Tienda",
    "suscripciones": "Suscripciones",
    "nosotros": "Nosotros",
    "cuenta": "Mi Cuenta",
    "signIn": "Iniciar sesión",
    "signUp": "Registrarse"
  },
  "footer": {
    "sections": {
      "comprar": "Comprar",
      "ayuda": "Ayuda",
      "nosotros": "Nosotros",
      "legal": "Legal"
    },
    "links": {
      "tienda": "Tienda",
      "suscripciones": "Suscripciones",
      "garantia": "Garantía",
      "contacto": "Contáctanos",
      "faq": "Preguntas frecuentes",
      "reembolso": "Solicitar reembolso",
      "nosotros": "Nosotros",
      "porQue": "¿Por qué parches?",
      "suscribeteAhorra": "Suscríbete y ahorra",
      "privacidad": "Aviso de Privacidad",
      "terminos": "Términos y Condiciones"
    },
    "newsletter": {
      "label": "Novedades y ofertas",
      "placeholder": "tu@correo.com",
      "button": "Suscribirse",
      "success": "¡Gracias por suscribirte!"
    },
    "social": {
      "followUs": "Síguenos"
    },
    "selectCountry": "País",
    "markets": {
      "mx": "México",
      "br": "Brasil",
      "ar": "Argentina",
      "cl": "Chile",
      "co": "Colombia"
    },
    "copyright": "© {year} Novapatch. Todos los derechos reservados.",
    "tagline": "Bienestar que no interrumpe tu día"
  },
  "home": {
    "hero": {
      "badge": "Parches de bienestar",
      "title": "Bienestar que no interrumpe tu día.",
      "subtitle": "Sin cápsulas. Sin horarios. Sin agua. Un solo parche y listo — el resto del día es tuyo.",
      "cta": "Conoce los parches",
      "ctaSecondary": "¿Cómo funciona?"
    },
    "howItWorks": {
      "badge": "Uso diario",
      "title": "Así de simple.",
      "step1Title": "Eliges tu parche",
      "step1Desc": "Energy, Sleep, Zen, Shield, Glow o Woman. Uno solo, según lo que necesitas hoy.",
      "step2Title": "Lo pones en segundos",
      "step2Desc": "En piel limpia, donde te sea cómodo. Sin agua, sin planificación, sin ritual.",
      "step3Title": "Listo. Ya está.",
      "step3Desc": "Durante las próximas horas el parche trabaja mientras tú vives tu día normal."
    },
    "absorption": {
      "badge": "La ciencia",
      "title": "No cualquier ingrediente funciona en un parche.",
      "subtitle": "Para atravesar la piel, un ingrediente necesita tener menos de 500 Daltons de masa molecular. El resultado: absorción directa al torrente sanguíneo, sin pasar por el sistema digestivo, durante entre 10 y 12 horas continuas.",
      "stat1Value": "<500",
      "stat1Label": "Tamaño molecular",
      "stat2Value": "10–12",
      "stat2Label": "Absorción sostenida",
      "stat3Value": "0",
      "stat3Label": "Digestión requerida"
    },
    "comparison": {
      "badge": "Comparativa",
      "title": "¿Pastillas, gomitas o parches?",
      "colNovapatch": "Parche",
      "colTraditional": "Cápsulas comunes"
    },
    "testimonials": {
      "badge": "Lo que dicen",
      "title": "Miles ya lo sienten"
    },
    "cta": {
      "title": "Tu rutina de bienestar, sin interrupciones",
      "subtitle": "Elige la frecuencia que mejor se adapte a tu ritmo. Pausa, cambia o cancela cuando quieras.",
      "button": "Elegir plan"
    },
    "faq": {
      "badge": "Resolvemos tus dudas",
      "title": "¿Tienes dudas?"
    }
  },
  "checkout": {
    "paymentMethods": {
      "title": "Método de pago",
      "description": "Paga con tarjeta de crédito/débito o transferencia"
    }
  },
  "legal": {
    "badge": "Legal",
    "lastUpdated": "Última actualización: enero de 2025 · Ley aplicable: Chile",
    "contactTitle": "¿Tienes alguna duda legal?",
    "contactSubtitle": "Contáctanos en cualquier momento.",
    "terms": {
      "title": "Términos y Condiciones"
    },
    "privacy": {
      "title": "Aviso de Privacidad"
    },
    "refund": {
      "title": "Política de Reembolso"
    },
    "warranty": {
      "title": "Garantía"
    }
  },
  "meta": {
    "currency": "CLP",
    "currencySymbol": "$",
    "locale": "es-CL",
    "country": "Chile",
    "taxLabel": "IVA 19%",
    "paymentProvider": "mercadopago",
    "supportEmail": "soporte@novapatch.cl"
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/storefront/messages/cl.json
git commit -m "feat(i18n): sync cl copy with mx as base"
```

---

## Task 3: Actualizar `co.json`

**Files:**
- Modify: `apps/storefront/messages/co.json`

- [ ] **Step 1: Reemplazar el contenido de `co.json`**

```json
{
  "nav": {
    "tienda": "Tienda",
    "suscripciones": "Suscripciones",
    "nosotros": "Nosotros",
    "cuenta": "Mi Cuenta",
    "signIn": "Iniciar sesión",
    "signUp": "Registrarse"
  },
  "footer": {
    "sections": {
      "comprar": "Comprar",
      "ayuda": "Ayuda",
      "nosotros": "Nosotros",
      "legal": "Legal"
    },
    "links": {
      "tienda": "Tienda",
      "suscripciones": "Suscripciones",
      "garantia": "Garantía",
      "contacto": "Contáctanos",
      "faq": "Preguntas frecuentes",
      "reembolso": "Solicitar reembolso",
      "nosotros": "Nosotros",
      "porQue": "¿Por qué parches?",
      "suscribeteAhorra": "Suscríbete y ahorra",
      "privacidad": "Aviso de Privacidad",
      "terminos": "Términos y Condiciones"
    },
    "newsletter": {
      "label": "Novedades y ofertas",
      "placeholder": "tu@correo.com",
      "button": "Suscribirse",
      "success": "¡Gracias por suscribirte!"
    },
    "social": {
      "followUs": "Síguenos"
    },
    "selectCountry": "País",
    "markets": {
      "mx": "México",
      "br": "Brasil",
      "ar": "Argentina",
      "cl": "Chile",
      "co": "Colombia"
    },
    "copyright": "© {year} Novapatch. Todos los derechos reservados.",
    "tagline": "Bienestar que no interrumpe tu día"
  },
  "home": {
    "hero": {
      "badge": "Parches de bienestar",
      "title": "Bienestar que no interrumpe tu día.",
      "subtitle": "Sin cápsulas. Sin horarios. Sin agua. Un solo parche y listo — el resto del día es tuyo.",
      "cta": "Conoce los parches",
      "ctaSecondary": "¿Cómo funciona?"
    },
    "howItWorks": {
      "badge": "Uso diario",
      "title": "Así de simple.",
      "step1Title": "Eliges tu parche",
      "step1Desc": "Energy, Sleep, Zen, Shield, Glow o Woman. Uno solo, según lo que necesitas hoy.",
      "step2Title": "Lo pones en segundos",
      "step2Desc": "En piel limpia, donde te sea cómodo. Sin agua, sin planificación, sin ritual.",
      "step3Title": "Listo. Ya está.",
      "step3Desc": "Durante las próximas horas el parche trabaja mientras tú vives tu día normal."
    },
    "absorption": {
      "badge": "La ciencia",
      "title": "No cualquier ingrediente funciona en un parche.",
      "subtitle": "Para atravesar la piel, un ingrediente necesita tener menos de 500 Daltons de masa molecular. El resultado: absorción directa al torrente sanguíneo, sin pasar por el sistema digestivo, durante entre 10 y 12 horas continuas.",
      "stat1Value": "<500",
      "stat1Label": "Tamaño molecular",
      "stat2Value": "10–12",
      "stat2Label": "Absorción sostenida",
      "stat3Value": "0",
      "stat3Label": "Digestión requerida"
    },
    "comparison": {
      "badge": "Comparativa",
      "title": "¿Pastillas, gomitas o parches?",
      "colNovapatch": "Parche",
      "colTraditional": "Cápsulas comunes"
    },
    "testimonials": {
      "badge": "Lo que dicen",
      "title": "Miles ya lo sienten"
    },
    "cta": {
      "title": "Tu rutina de bienestar, sin interrupciones",
      "subtitle": "Elige la frecuencia que mejor se adapte a tu ritmo. Pausa, cambia o cancela cuando quieras.",
      "button": "Elegir plan"
    },
    "faq": {
      "badge": "Resolvemos tus dudas",
      "title": "¿Tienes dudas?"
    }
  },
  "checkout": {
    "paymentMethods": {
      "title": "Método de pago",
      "description": "Paga con tarjeta de crédito/débito o transferencia"
    }
  },
  "legal": {
    "badge": "Legal",
    "lastUpdated": "Última actualización: enero de 2025 · Ley aplicable: Colombia",
    "contactTitle": "¿Tienes alguna duda legal?",
    "contactSubtitle": "Contáctanos en cualquier momento.",
    "terms": {
      "title": "Términos y Condiciones"
    },
    "privacy": {
      "title": "Aviso de Privacidad"
    },
    "refund": {
      "title": "Política de Reembolso"
    },
    "warranty": {
      "title": "Garantía"
    }
  },
  "meta": {
    "currency": "COP",
    "currencySymbol": "$",
    "locale": "es-CO",
    "country": "Colombia",
    "taxLabel": "IVA 19%",
    "paymentProvider": "mercadopago",
    "supportEmail": "soporte@novapatch.co"
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add apps/storefront/messages/co.json
git commit -m "feat(i18n): sync co copy with mx as base"
```

---

## Task 4: Verificar build

- [ ] **Step 1: Correr build para verificar que no hay errores de i18n**

Desde `apps/storefront/`:

```bash
pnpm run build
```

Expected: build exitoso sin errores. Si hay errores de tipo relacionados con keys faltantes o inválidas en los JSON, revisar que el JSON sea válido con `cat messages/ar.json | python3 -m json.tool`.

- [ ] **Step 2: Commit final si hubo ajustes**

Si el build requirió correcciones:

```bash
git add apps/storefront/messages/
git commit -m "fix(i18n): fix json issues after copy sync"
```
