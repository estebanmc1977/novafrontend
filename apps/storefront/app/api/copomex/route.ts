/**
 * GET /api/copomex?cp=11560
 *
 * Proxy server-side para COPOMEX — mantiene el token privado.
 * La API real retorna un array donde cada ítem es un asentamiento:
 *
 * [
 *   { error: false, response: { municipio, estado, ciudad, asentamiento, tipo_asentamiento } },
 *   { error: false, response: { municipio, estado, ciudad, asentamiento, tipo_asentamiento } },
 *   ...
 * ]
 *
 * Normalizamos al formato que necesita el frontend:
 * { municipio, estado, ciudad, colonias: string[] }
 */

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const cp = req.nextUrl.searchParams.get("cp");

  if (!cp || !/^\d{5}$/.test(cp)) {
    return NextResponse.json({ error: "CP inválido" }, { status: 400 });
  }

  const token = process.env.COPOMEX_TOKEN;
  if (!token) {
    return NextResponse.json({ error: "Token no configurado" }, { status: 500 });
  }

  try {
    const res = await fetch(
      `https://api.copomex.com/query/info_cp/${cp}?token=${token}`,
      {
        headers: { Accept: "application/json" },
        next: { revalidate: 86400 }, // cache 24h — los CPs no cambian seguido
      }
    );

    if (!res.ok) {
      return NextResponse.json(
        { error: `COPOMEX HTTP ${res.status}` },
        { status: 502 }
      );
    }

    const raw = await res.json();

    // La API puede devolver un objeto con error=true si el CP no existe
    if (!Array.isArray(raw)) {
      if (raw?.error) {
        return NextResponse.json(
          { error: raw.error_message || "CP no encontrado" },
          { status: 404 }
        );
      }
      // Formato inesperado
      return NextResponse.json({ error: "Respuesta inesperada de COPOMEX" }, { status: 502 });
    }

    if (raw.length === 0) {
      return NextResponse.json({ error: "CP no encontrado" }, { status: 404 });
    }

    // Todos los ítems comparten municipio/estado/ciudad — tomamos el primero
    const first = raw[0]?.response ?? {};

    // Extraemos el nombre del asentamiento de cada ítem y filtramos duplicados
    const colonias: string[] = Array.from(
      new Set(
        raw
          .map((item: { response?: { asentamiento?: string } }) => item?.response?.asentamiento)
          .filter((name: string | undefined): name is string => typeof name === "string" && name.trim() !== "")
      )
    ).sort() as string[];

    return NextResponse.json({
      municipio: first.municipio ?? "",
      estado: first.estado ?? "",
      ciudad: first.ciudad ?? first.municipio ?? "",
      colonias,
    });
  } catch (err) {
    console.error("[/api/copomex]", err);
    return NextResponse.json({ error: "Error de red" }, { status: 503 });
  }
}
