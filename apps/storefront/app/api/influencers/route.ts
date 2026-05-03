import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const required = ["nombre", "email", "pais"];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `Campo requerido: ${field}` }, { status: 400 });
      }
    }
    // At least one of Instagram / TikTok handle must be present.
    if (!body.instagram_handle && !body.tiktok_handle) {
      return NextResponse.json(
        { error: "Indicá al menos un handle: Instagram o TikTok" },
        { status: 400 }
      );
    }

    const medusaUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
    if (!medusaUrl) {
      console.error("[influencers] NEXT_PUBLIC_MEDUSA_BACKEND_URL no configurado");
      return NextResponse.json({ error: "Error de configuración del servidor" }, { status: 503 });
    }

    const res = await fetch(`${medusaUrl}/store/influencers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY ?? "",
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(`[influencers] Medusa error ${res.status}:`, err);
      return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
    }

    const data = await res.json();
    return NextResponse.json({ success: true, id: data.id }, { status: 200 });
  } catch (err) {
    console.error("[influencers] Error:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
