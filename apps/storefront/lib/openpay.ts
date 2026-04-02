/**
 * lib/openpay.ts — Wrapper tipado para el SDK de Openpay (frontend)
 *
 * El SDK se carga vía <Script> en app/layout.tsx (strategy="afterInteractive").
 * Expone tokenizeCard() y getDeviceSessionId() como async/await.
 *
 * Credenciales configuradas en .env.local:
 *   NEXT_PUBLIC_OPENPAY_MERCHANT_ID  = mcsjag7pd7iu4tuekpa6
 *   NEXT_PUBLIC_OPENPAY_PUBLIC_KEY   = pk_1137744197014608b028e035b8cab9dc
 *   NEXT_PUBLIC_OPENPAY_SANDBOX      = true  (apunta a sandbox-api.openpay.mx)
 *
 * Flujo de pago:
 *   1. getDeviceSessionId() → genera fingerprint anti-fraude (openpay-data.js)
 *   2. tokenizeCard(data)   → tokeniza tarjeta directo a Openpay, devuelve tok_XXX
 *   3. Ambos se envían a Medusa: POST /store/carts/:id/complete
 */

declare global {
  interface Window {
    OpenPay?: {
      setId: (id: string) => void;
      setApiKey: (key: string) => void;
      setSandboxMode: (sandbox: boolean) => void;
      token: {
        create: (
          cardData: OpenpayCardData,
          onSuccess: (response: OpenpayTokenResponse) => void,
          onError: (error: OpenpayError) => void
        ) => void;
      };
      deviceData: {
        setup: (formId?: string, fieldName?: string) => string;
      };
    };
  }
}

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type OpenpayCardData = {
  card_number: string;       // sin espacios ni guiones
  holder_name: string;       // nombre tal como aparece en la tarjeta
  expiration_year: string;   // YY  (ej: "27")
  expiration_month: string;  // MM  (ej: "08")
  cvv2: string;              // 3 o 4 dígitos
};

export type OpenpayTokenResponse = {
  data: {
    id: string;              // "tok_XXXX" → va a Medusa
    card: {
      card_number: string;   // ej: "411111XXXXXX1111"
      brand: string;         // "visa" | "mastercard" | "amex"
      type: string;          // "debit" | "credit"
      bank_name: string;
      bank_code: string;
      allows_charges: boolean;
      allows_payouts: boolean;
      creation_date: string;
      holder_name: string;
      expiration_year: string;
      expiration_month: string;
      address: null;
    };
  };
};

export type OpenpayError = {
  data: {
    category: string;        // "request" | "internal" | "gateway"
    description: string;     // mensaje legible
    error_code: number;
    http_code: number;
    request_id: string;
  };
  status: number;
};

// ─── Estado de inicialización ─────────────────────────────────────────────────

let initialized = false;

function initOpenpay(): boolean {
  if (typeof window === "undefined" || !window.OpenPay) return false;
  if (initialized) return true;

  const merchantId = process.env.NEXT_PUBLIC_OPENPAY_MERCHANT_ID;
  const publicKey  = process.env.NEXT_PUBLIC_OPENPAY_PUBLIC_KEY;
  const sandbox    = process.env.NEXT_PUBLIC_OPENPAY_SANDBOX !== "false";

  if (!merchantId || !publicKey) {
    console.warn(
      "[Openpay] Faltan NEXT_PUBLIC_OPENPAY_MERCHANT_ID o NEXT_PUBLIC_OPENPAY_PUBLIC_KEY en .env.local"
    );
    return false;
  }

  window.OpenPay.setId(merchantId);
  window.OpenPay.setApiKey(publicKey);
  window.OpenPay.setSandboxMode(sandbox);
  initialized = true;

  console.debug(
    `[Openpay] Inicializado. Merchant: ${merchantId} | Sandbox: ${sandbox}`
  );
  return true;
}

// ─── Funciones públicas ───────────────────────────────────────────────────────

/**
 * Genera el deviceSessionId para el sistema anti-fraude de Openpay.
 * Requiere que openpay-data.v1.min.js esté cargado.
 * Se llama ANTES de tokenizeCard() y se envía junto con el token a Medusa.
 *
 * @param formId     ID del <form> del checkout (opcional, mejora la detección)
 * @param fieldName  Nombre del hidden field donde Openpay guarda el ID (opcional)
 */
export function getDeviceSessionId(
  formId = "checkout-form",
  fieldName = "device_session_id"
): string | null {
  if (!initOpenpay()) return null;

  try {
    const sessionId = window.OpenPay!.deviceData.setup(formId, fieldName);
    return sessionId;
  } catch (err) {
    console.warn("[Openpay] deviceData.setup() falló:", err);
    return null;
  }
}

/**
 * Tokeniza la tarjeta usando el SDK de Openpay.
 * Los datos de tarjeta viajan directamente a los servidores de Openpay (PCI-DSS).
 * NUNCA pasan por el servidor de Novapatch.
 *
 * @returns token_id  (ej: "tok_r3b0pu3l74ys9c6mipfs")
 */
export async function tokenizeCard(cardData: OpenpayCardData): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!initOpenpay()) {
      reject(new Error("Openpay SDK no disponible. Verificá que los scripts están cargados."));
      return;
    }

    window.OpenPay!.token.create(
      cardData,
      (res) => {
        console.debug("[Openpay] Token creado:", res.data.id, `(${res.data.card.brand})`);
        resolve(res.data.id);
      },
      (err) => {
        const msg = err?.data?.description ?? "Error al procesar la tarjeta";
        console.error("[Openpay] Error tokenizando:", err);
        reject(new Error(translateOpenpayError(err)));
      }
    );
  });
}

/**
 * Convierte los códigos de error de Openpay a mensajes en español amigables.
 */
function translateOpenpayError(err: OpenpayError): string {
  const code = err?.data?.error_code;
  const messages: Record<number, string> = {
    2004: "El dígito verificador de la tarjeta es inválido.",
    2005: "La tarjeta está vencida.",
    2006: "El código de seguridad (CVV) es incorrecto.",
    2007: "El número de tarjeta es inválido.",
    2008: "La tarjeta no es válida para transacciones en línea.",
    2009: "El código de seguridad (CVV) tiene un formato inválido.",
    2010: "La autenticación 3D Secure falló.",
    2011: "Tipo de tarjeta no soportado. Usa Visa, Mastercard o Amex.",
    3001: "La tarjeta fue rechazada.",
    3002: "La tarjeta venció.",
    3003: "Fondos insuficientes.",
    3004: "La tarjeta fue identificada como robada.",
    3005: "La tarjeta fue identificada como fraudulenta.",
    3006: "La operación no está permitida para este cliente o transacción.",
    3008: "La tarjeta no está habilitada para compras en línea.",
    3009: "La tarjeta fue reportada como perdida.",
    3010: "El banco restringió la tarjeta.",
    3011: "El banco solicitó que se retenga la tarjeta.",
    3012: "Se requiere solicitar autorización al banco antes de realizar este pago.",
  };
  return messages[code] ?? err?.data?.description ?? "Error al procesar la tarjeta. Intentá con otra.";
}

/**
 * Parsea los datos del formulario de tarjeta al formato que espera Openpay.
 *
 * @param number   "1234 5678 9012 3456" (con o sin espacios)
 * @param name     "MARIA GARCIA"
 * @param expiry   "MM/AA"
 * @param cvv      "123" o "1234"
 */
export function parseCardForm(
  number: string,
  name: string,
  expiry: string,
  cvv: string
): OpenpayCardData {
  const [month = "", year = ""] = expiry.split("/");
  return {
    card_number:       number.replace(/\s/g, ""),
    holder_name:       name.trim(),
    expiration_month:  month.trim(),
    expiration_year:   year.trim(),
    cvv2:              cvv.trim(),
  };
}
