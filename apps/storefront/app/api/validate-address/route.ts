/**
 * POST /api/validate-address
 *
 * Proxy server-side para Google Address Validation API.
 * La API key se mantiene privada (sin NEXT_PUBLIC_).
 *
 * Requiere:
 *   GOOGLE_ADDRESS_VALIDATION_KEY en .env.local
 *   API habilitada: Address Validation API en Google Cloud Console
 *
 * Body: { street, colonia, city, state, zip }
 *
 * Response: { valid, verdict, standardized?, issues? }
 *   - valid: boolean — ¿dirección entregable?
 *   - verdict: objeto crudo de Google
 *   - issues: array de strings con problemas encontrados
 */

import { NextRequest, NextResponse } from "next/server";

const VALIDATION_URL =
  "https://addressvalidation.googleapis.com/v1:validateAddress";

export async function POST(req: NextRequest) {
  const apiKey = process.env.GOOGLE_ADDRESS_VALIDATION_KEY;

  // Si no hay key configurada, pasar validación (no bloquear compra)
  if (!apiKey || apiKey === "TU_GOOGLE_ADDRESS_VALIDATION_KEY") {
    return NextResponse.json({
      valid: true,
      verdict: null,
      issues: [],
      skipped: true,
    });
  }

  try {
    const { street, colonia, city, state, zip } = await req.json();

    const googleRes = await fetch(`${VALIDATION_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        address: {
          regionCode: "MX",
          postalCode: zip,
          locality: city,
          administrativeArea: state,
          addressLines: [street, colonia].filter(Boolean),
        },
        enableUspsCass: false,
      }),
    });

    if (!googleRes.ok) {
      throw new Error(`Google API error: ${googleRes.status}`);
    }

    const data = await googleRes.json();
    const verdict = data.result?.verdict ?? {};

    const issues: string[] = [];
    if (verdict.hasUnconfirmedComponents) {
      issues.push("Algunos componentes de la dirección no pudieron confirmarse.");
    }
    if (verdict.hasInferredComponents) {
      issues.push("Se infirieron algunos datos de la dirección.");
    }
    if (verdict.hasReplacedComponents) {
      issues.push("Algunos componentes fueron corregidos automáticamente.");
    }

    const valid =
      verdict.addressComplete === true &&
      verdict.validationGranularity !== "OTHER" &&
      verdict.validationGranularity !== "ROUTE";

    return NextResponse.json({
      valid,
      verdict,
      issues,
      standardized: data.result?.address?.formattedAddress ?? null,
    });
  } catch (err) {
    console.error("[validate-address]", err);
    // Fallar silenciosamente — no bloquear compra por error de validación
    return NextResponse.json({ valid: true, verdict: null, issues: [], error: true });
  }
}
