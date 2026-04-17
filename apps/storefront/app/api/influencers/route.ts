import { NextRequest, NextResponse } from "next/server";

// Required env vars:
//   NOTION_API_KEY       — Integration token from notion.so/my-integrations
//   NOTION_DATABASE_ID   — ID of the "Influencers" database (share it with your integration)

const NOTION_VERSION = "2022-06-28";

function richText(content: string) {
  return [{ text: { content: content ?? "" } }];
}

async function saveToNotion(body: Record<string, unknown>) {
  const res = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.NOTION_API_KEY}`,
      "Content-Type": "application/json",
      "Notion-Version": NOTION_VERSION,
    },
    body: JSON.stringify({
      parent: { database_id: process.env.NOTION_DATABASE_ID },
      properties: {
        // ── Title (required by Notion) ─────────────────────────────────────
        Nombre: { title: richText(body.nombre as string) },

        // ── Step 1 ────────────────────────────────────────────────────────
        Email:              { email: body.email },
        País:               { select: { name: body.pais } },
        "Red principal":    { select: { name: body.red_principal } },
        Handle:             { rich_text: richText(body.handle as string) },
        "Handle secundario":{ rich_text: richText((body.handle_secundario as string) ?? "") },
        "Link perfil":      { url: (body.link_perfil as string) || null },

        // ── Step 2 ────────────────────────────────────────────────────────
        Seguidores:         { select: { name: body.rango_seguidores } },
        Nicho:              { multi_select: (body.nicho as string[]).map((n) => ({ name: n })) },
        "Tipo contenido":   { multi_select: (body.tipo_contenido as string[]).map((t) => ({ name: t })) },
        "Género audiencia": { select: { name: body.genero_audiencia } },
        "Edad audiencia":   { select: { name: body.edad_audiencia } },
        "Contenido bienestar": { select: { name: body.tiene_contenido_bienestar } },
        "Marcas previas":   { rich_text: richText((body.marcas_previas as string) ?? "") },

        // ── Step 3 ────────────────────────────────────────────────────────
        Parches:            { multi_select: (body.parches as string[]).map((p) => ({ name: p })) },
        Modalidad:          { multi_select: (body.modalidad as string[]).map((m) => ({ name: m })) },
        "Media kit":        { select: { name: (body.media_kit as string) || "no" } },
        ...(body.media_kit === "si" && body.media_kit_url
          ? { "Media kit URL": { url: body.media_kit_url as string } }
          : {}),
        Mensaje:            { rich_text: richText((body.mensaje_libre as string) ?? "") },

        // ── Meta ──────────────────────────────────────────────────────────
        Estado:             { select: { name: "pendiente" } },
        Fecha:              { date: { start: new Date().toISOString() } },
      },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Notion error ${res.status}: ${err}`);
  }

  return res.json();
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const required = ["nombre", "email", "pais", "red_principal", "handle", "link_perfil"];
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json({ error: `Campo requerido: ${field}` }, { status: 400 });
      }
    }

    if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
      console.warn("[influencers] NOTION_API_KEY o NOTION_DATABASE_ID no configurados — guardando solo en logs");
      console.log("[influencers] Postulación:", { nombre: body.nombre, email: body.email });
      return NextResponse.json({ success: true }, { status: 200 });
    }

    await saveToNotion(body);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[influencers] Error:", err);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}
