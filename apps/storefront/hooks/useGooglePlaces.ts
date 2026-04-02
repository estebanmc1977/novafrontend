/**
 * useGooglePlaces — Google Places Autocomplete para campo de calle
 *
 * Requiere:
 *   - NEXT_PUBLIC_GOOGLE_MAPS_API_KEY en .env.local
 *   - APIs habilitadas en Google Cloud Console:
 *       · Maps JavaScript API
 *       · Places API (legacy)
 *
 * Uso:
 *   const streetRef = useRef<HTMLInputElement>(null);
 *   const { ready, error } = useGooglePlaces(streetRef, (parts) => {
 *     setAddress(a => ({ ...a, street: parts.street, zip: parts.zip, ... }));
 *   });
 *
 * Fixes sobre la versión anterior:
 *   1. Singleton de carga — un solo script en el DOM aunque se monte varias veces.
 *   2. onPlaceRef — siempre llama a la versión más reciente del callback (evita stale closure).
 *   3. `loading=async` en la URL del script — requerido por Google para `libraries=places`.
 *   4. Flag `cancelled` — evita setReady() después de unmount.
 *   5. Verifica `google.maps.places` antes de instanciar Autocomplete.
 *   6. Devuelve `error` además de `ready`.
 */

import { useEffect, useRef, useState } from "react";

export type PlaceAddressParts = {
  street: string;    // route + street_number
  colonia: string;   // sublocality_level_1
  city: string;      // locality
  state: string;     // administrative_area_level_1
  zip: string;       // postal_code
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GoogleAutoComplete = any;

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    google: any;
  }
}

// ─── Singleton de carga ────────────────────────────────────────────────────────
// Una sola Promise compartida para que múltiples mounts no creen scripts duplicados.
let _loadPromise: Promise<void> | null = null;

function loadGoogleMapsScript(apiKey: string): Promise<void> {
  // Si ya existe la API en window, resolver inmediatamente sin reusar la Promise
  // (evita que un _loadPromise stale de HMR bloquee nuevos mounts)
  if (typeof window !== "undefined" && window.google?.maps?.places) {
    return Promise.resolve();
  }

  if (_loadPromise) return _loadPromise;

  _loadPromise = new Promise<void>((resolve, reject) => {

    // Script ya en el DOM (p.ej. recargado por HMR) — esperar el evento
    const existing = document.querySelector<HTMLScriptElement>("#google-maps-script");
    if (existing) {
      const poll = setInterval(() => {
        if (window.google?.maps?.places) {
          clearInterval(poll);
          resolve();
        }
      }, 100);
      // Tiempo máximo de espera: 10 s
      setTimeout(() => {
        clearInterval(poll);
        reject(new Error("Timeout esperando Google Maps"));
      }, 10_000);
      return;
    }

    const script = document.createElement("script");
    script.id = "google-maps-script";
    // NOTA: NO usar loading=async con libraries=places — es solo para el nuevo Bootstrap Loader.
    // El atributo async/defer del <script> es suficiente para carga no bloqueante.
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&language=es`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      // Pequeño delay para que google.maps.places quede completamente definido
      const poll = setInterval(() => {
        if (window.google?.maps?.places) {
          clearInterval(poll);
          resolve();
        }
      }, 50);
      setTimeout(() => {
        clearInterval(poll);
        // Si después de 5 s sigue sin estar, intentamos resolver igualmente
        resolve();
      }, 5_000);
    };

    script.onerror = () => {
      _loadPromise = null; // permitir reintento
      reject(new Error("Error cargando Google Maps API"));
    };

    document.head.appendChild(script);
  });

  return _loadPromise;
}

// ─── Parser de componentes ────────────────────────────────────────────────────

function parseAddressComponents(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  components: Array<{ types: string[]; long_name: string; short_name: string }>
): PlaceAddressParts {
  const get = (type: string) =>
    components.find((c) => c.types.includes(type))?.long_name ?? "";
  const getShort = (type: string) =>
    components.find((c) => c.types.includes(type))?.short_name ?? "";

  const streetNumber = get("street_number");
  const route        = get("route");
  const street       = [route, streetNumber].filter(Boolean).join(" ");

  return {
    street,
    colonia: get("sublocality_level_1") || get("neighborhood") || get("sublocality"),
    city:    get("locality") || get("administrative_area_level_2"),
    state:   get("administrative_area_level_1"),
    zip:     getShort("postal_code"),
  };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useGooglePlaces(
  inputRef: React.RefObject<HTMLInputElement | null>,
  onPlace: (parts: PlaceAddressParts) => void
) {
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Ref para evitar stale closure: siempre apunta al onPlace más reciente
  const onPlaceRef = useRef(onPlace);
  useEffect(() => { onPlaceRef.current = onPlace; });

  const autocompleteRef = useRef<GoogleAutoComplete | null>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    console.log("[GP] apiKey:", apiKey ? apiKey.slice(0, 8) + "…" : "MISSING");
    if (!apiKey || apiKey === "TU_GOOGLE_MAPS_API_KEY") {
      console.warn("[useGooglePlaces] NEXT_PUBLIC_GOOGLE_MAPS_API_KEY no configurada");
      return;
    }

    let cancelled = false;

    loadGoogleMapsScript(apiKey)
      .then(() => {
        if (cancelled) return;

        // El Maps script puede resolverse antes de que el formulario se renderice
        // (p.ej. durante el spinner de isLoaded). Reintentamos hasta que el input
        // esté en el DOM, con un máximo de 3 s (30 intentos × 100 ms).
        function tryAttach(attempt = 0): void {
          if (cancelled) return;

          if (!inputRef.current) {
            if (attempt < 30) {
              setTimeout(() => tryAttach(attempt + 1), 100);
            } else {
              console.warn("[GP] timeout esperando que el input de calle aparezca en el DOM");
            }
            return;
          }

          if (!window.google?.maps?.places) {
            setError("Google Maps Places no disponible");
            return;
          }

          // Evitar doble-attach si ya estaba conectado
          if (autocompleteRef.current) return;

          autocompleteRef.current = new window.google.maps.places.Autocomplete(
            inputRef.current,
            {
              componentRestrictions: { country: "mx" },
              fields: ["address_components"],
              types: ["address"],
            }
          );

          autocompleteRef.current.addListener("place_changed", () => {
            const place = autocompleteRef.current?.getPlace();
            if (!place?.address_components) return;

            const parts = parseAddressComponents(place.address_components);

            // Fallback: si address_components no trae calle+número (frecuente en MX),
            // usar el texto que Google escribió directamente en el input.
            if (!parts.street && inputRef.current?.value) {
              parts.street = inputRef.current.value;
            }

            onPlaceRef.current(parts);
          });

          if (!cancelled) setReady(true);
        }

        tryAttach();
      })
      .catch((err: Error) => {
        if (cancelled) return;
        console.warn("[useGooglePlaces]", err.message);
        setError(err.message);
      });

    return () => {
      cancelled = true;
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
    // Solo re-ejecutar si cambia el inputRef — onPlace se maneja vía onPlaceRef
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputRef]);

  return { ready, error };
}
