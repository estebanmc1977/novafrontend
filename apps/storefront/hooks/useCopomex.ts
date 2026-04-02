/**
 * useCopomex — CP → colonias/municipio/estado
 *
 * Llama a nuestro proxy /api/copomex?cp=XXXXX (server-side).
 * El token de COPOMEX nunca se expone en el browser.
 *
 * La API real de COPOMEX devuelve un array donde cada ítem es un asentamiento.
 * El proxy normaliza eso a { municipio, estado, ciudad, colonias: string[] }.
 */

import { useState, useCallback, useRef } from "react";

export type CopomexResult = {
  municipio: string;
  estado: string;
  ciudad: string;
  colonias: string[];
};

export type CopomexState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: CopomexResult }
  | { status: "error"; message: string };

export function useCopomex() {
  const [state, setState] = useState<CopomexState>({ status: "idle" });
  const lastCp = useRef<string>("");
  const abortRef = useRef<AbortController | null>(null);

  const lookup = useCallback(async (cp: string) => {
    const clean = cp.replace(/\D/g, "");
    if (clean.length !== 5) {
      setState({ status: "idle" });
      return;
    }

    // Evitar llamadas duplicadas al mismo CP
    if (clean === lastCp.current && state.status === "success") return;
    lastCp.current = clean;

    // Cancelar request anterior si sigue en vuelo
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setState({ status: "loading" });

    try {
      const res = await fetch(`/api/copomex?cp=${clean}`, {
        signal: abortRef.current.signal,
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error || `Error ${res.status}`);
      }

      const data: CopomexResult = await res.json();

      setState({ status: "success", data });
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return; // request cancelado, no es error
      const msg = err instanceof Error ? err.message : "Error al buscar CP";
      setState({ status: "error", message: msg });
    }
  }, [state.status]);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    lastCp.current = "";
    setState({ status: "idle" });
  }, []);

  return { state, lookup, reset };
}
