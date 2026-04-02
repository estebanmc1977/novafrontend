/**
 * lib/clerk-theme.ts
 * Tema visual y localización en español (México) para todos los componentes de Clerk.
 * Se usa tanto en <ClerkProvider> (modales) como en las páginas /sign-in y /sign-up.
 */

import { esMX } from "@clerk/localizations";

// ─── Tema visual Novapatch ────────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const novapatchAppearance: Record<string, any> = {
  variables: {
    colorPrimary: "#E8503A",
    colorBackground: "#FFFFFF",
    colorText: "#005088",
    colorTextSecondary: "#6B7280",
    colorTextOnPrimaryBackground: "#FFFFFF",
    colorInputBackground: "#FFFFFF",
    colorInputText: "#005088",
    colorDanger: "#E8503A",
    colorSuccess: "#059669",
    colorWarning: "#D97706",
    borderRadius: "0.75rem",
    fontFamily: "inherit",
    fontSize: "14px",
    fontWeight: {
      normal: 500,
      medium: 600,
      bold: 800,
    },
    spacingUnit: "1rem",
  },
  elements: {
    // ── Card ─────────────────────────────────────────────────────────────────
    card: {
      boxShadow: "0 8px 40px rgba(0,80,136,0.10)",
      border: "1px solid rgba(0,80,136,0.08)",
      borderRadius: "1.25rem",
      padding: "2rem",
      backgroundColor: "#FFFFFF",
    },
    cardBox: {
      boxShadow: "none",
    },

    // ── Header ────────────────────────────────────────────────────────────────
    headerTitle: {
      color: "#005088",
      fontSize: "22px",
      fontWeight: "900",
      letterSpacing: "-0.02em",
    },
    headerSubtitle: {
      color: "#6B7280",
      fontSize: "14px",
    },

    // ── Social buttons ────────────────────────────────────────────────────────
    socialButtonsBlockButton: {
      border: "1.5px solid #E5E7EB",
      borderRadius: "0.75rem",
      fontWeight: "600",
      color: "#005088",
      backgroundColor: "#FFFFFF",
      transition: "all 0.15s ease",
    },
    socialButtonsBlockButtonText: {
      color: "#005088",
      fontWeight: "600",
    },

    // ── Divider ───────────────────────────────────────────────────────────────
    dividerLine: {
      backgroundColor: "#E5E7EB",
    },
    dividerText: {
      color: "#9CA3AF",
      fontSize: "12px",
    },

    // ── Form fields ───────────────────────────────────────────────────────────
    formFieldLabel: {
      color: "#005088",
      fontWeight: "700",
      fontSize: "11px",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
    },
    formFieldInput: {
      border: "1.5px solid #E5E7EB",
      borderRadius: "0.75rem",
      color: "#005088",
      fontSize: "14px",
      padding: "0.75rem 1rem",
      transition: "border-color 0.15s ease, box-shadow 0.15s ease",
    },
    formFieldInputShowPasswordButton: {
      color: "#9CA3AF",
    },
    formFieldHintText: {
      color: "#9CA3AF",
      fontSize: "11px",
    },
    formFieldErrorText: {
      color: "#E8503A",
      fontSize: "11px",
    },
    formFieldSuccessText: {
      color: "#059669",
      fontSize: "11px",
    },

    // ── Primary button ────────────────────────────────────────────────────────
    formButtonPrimary: {
      backgroundColor: "#E8503A",
      borderRadius: "0.75rem",
      fontWeight: "700",
      fontSize: "15px",
      padding: "0.875rem",
      transition: "all 0.2s ease",
      boxShadow: "0 4px 12px rgba(232,80,58,0.25)",
    },

    // ── Footer ────────────────────────────────────────────────────────────────
    footerActionText: {
      color: "#6B7280",
      fontSize: "13px",
    },
    footerActionLink: {
      color: "#E8503A",
      fontWeight: "600",
      fontSize: "13px",
    },
    footerPages: {
      backgroundColor: "transparent",
    },

    // ── Alternative methods ───────────────────────────────────────────────────
    alternativeMethodsBlockButton: {
      border: "1.5px solid #E5E7EB",
      borderRadius: "0.75rem",
      color: "#005088",
      fontWeight: "600",
    },

    // ── OTP / Code input ──────────────────────────────────────────────────────
    otpCodeFieldInput: {
      border: "1.5px solid #E5E7EB",
      borderRadius: "0.75rem",
      color: "#005088",
      fontWeight: "800",
      fontSize: "20px",
    },

    // ── Identifiers ───────────────────────────────────────────────────────────
    identityPreviewText: {
      color: "#005088",
      fontWeight: "600",
    },
    identityPreviewEditButton: {
      color: "#E8503A",
    },

    // ── Badges / Tags ─────────────────────────────────────────────────────────
    badge: {
      backgroundColor: "#EBF4FB",
      color: "#005088",
    },

    // ── Internal links ────────────────────────────────────────────────────────
    formResendCodeLink: {
      color: "#E8503A",
      fontWeight: "600",
    },
  },
};

// ─── Localización en español (México) ─────────────────────────────────────────
// Base: esMX oficial de @clerk/localizations (todas las traducciones).
// Override: solo los textos específicos de la marca Novapatch.
// Deep merge manual por sección para no pisar las keys de esMX.

type DeepPartial<T> = T extends object
  ? { [P in keyof T]?: DeepPartial<T[P]> }
  : T;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepMerge<T extends Record<string, any>>(base: T, overrides: DeepPartial<T>): T {
  const result = { ...base };
  for (const key of Object.keys(overrides) as Array<keyof T>) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const ov = (overrides as any)[key];
    const bv = base[key];
    if (ov && typeof ov === "object" && !Array.isArray(ov) && bv && typeof bv === "object") {
      result[key] = deepMerge(bv as object, ov as DeepPartial<object>) as T[keyof T];
    } else if (ov !== undefined) {
      result[key] = ov as T[keyof T];
    }
  }
  return result;
}

// Solo los overrides específicos de Novapatch (el resto viene de esMX)
const novapatchOverrides = {
  signIn: {
    start: {
      subtitle: "Ingresá a tu cuenta de Novapatch",
    },
    alternativeMethods: {
      getHelp: {
        content: "Si tenés problemas para acceder, escribinos a soporte@novapatch.mx",
      },
    },
  },
  signUp: {
    start: {
      subtitle: "Regístrate para gestionar tus pedidos y suscripciones",
    },
  },
  // Placeholders con formato mexicano
  formFieldInputPlaceholder__emailAddress: "tu@correo.com",
  formFieldInputPlaceholder__phoneNumber: "+52 55 0000 0000",
  formFieldInputPlaceholder__firstName: "María",
  formFieldInputPlaceholder__lastName: "García",
};

export const esLocalization = deepMerge(
  esMX as object,
  novapatchOverrides as object
) as typeof esMX;
