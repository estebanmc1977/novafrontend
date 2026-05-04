"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import { medusa } from "@/lib/medusa";

const MEDUSA_CART_KEY = "novapatch_medusa_cart_id";

type Status = "loading" | "redirecting" | "completed" | "not-found" | "error";

export default function CartRecoveryPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { locale } = useParams<{ locale: string }>();
  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const cartId = params.get("id");
    if (!cartId) {
      setStatus("error");
      setErrorMsg("Link de recuperación inválido.");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        // Verify the cart still exists and isn't already completed.
        const cart = await medusa.cart.retrieve(cartId);
        if (cancelled) return;

        // If the user already finished this purchase since the email was sent,
        // send them home — no need to recover anything.
        if (cart.completed_at) {
          setStatus("completed");
          setTimeout(() => {
            router.replace(`/${locale ?? "mx"}`);
          }, 1500);
          return;
        }

        // Restore the Medusa cart_id in localStorage so the checkout flow
        // picks up the existing line items instead of creating a fresh cart.
        if (typeof window !== "undefined") {
          window.localStorage.setItem(MEDUSA_CART_KEY, cart.id);
        }

        setStatus("redirecting");
        router.replace(`/${locale ?? "mx"}/checkout`);
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : String(err);
        // 404 → cart doesn't exist (expired/deleted)
        if (/not found|404/i.test(message)) {
          setStatus("not-found");
        } else {
          setStatus("error");
          setErrorMsg(message);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [params, router, locale]);

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#FAF7F2",
        padding: "24px",
      }}
    >
      <div
        style={{
          maxWidth: 420,
          textAlign: "center",
          background: "white",
          borderRadius: 20,
          padding: "32px 28px",
          boxShadow: "0 4px 20px rgba(13,27,53,0.08)",
        }}
      >
        {(status === "loading" || status === "redirecting") && (
          <>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                border: "3px solid #17B8A3",
                borderTopColor: "transparent",
                margin: "0 auto 20px",
                animation: "spin 1s linear infinite",
              }}
            />
            <p style={{ color: "#0D1B35", fontSize: 16, fontWeight: 600 }}>
              {status === "loading" ? "Recuperando tu carrito..." : "Te llevamos al checkout..."}
            </p>
          </>
        )}

        {status === "completed" && (
          <>
            <p style={{ color: "#0D1B35", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
              Esta compra ya fue completada.
            </p>
            <p style={{ color: "rgba(13,27,53,0.55)", fontSize: 14 }}>
              Te llevamos al inicio.
            </p>
          </>
        )}

        {status === "not-found" && (
          <>
            <p style={{ color: "#0D1B35", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
              Este carrito ya no está disponible.
            </p>
            <p style={{ color: "rgba(13,27,53,0.55)", fontSize: 14, marginBottom: 16 }}>
              Probá agregando los productos de nuevo desde la tienda.
            </p>
            <a
              href={`/${locale ?? "mx"}`}
              style={{
                display: "inline-block",
                background: "#0D1B35",
                color: "white",
                textDecoration: "none",
                borderRadius: 999,
                padding: "12px 24px",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Ir a la tienda
            </a>
          </>
        )}

        {status === "error" && (
          <>
            <p style={{ color: "#0D1B35", fontSize: 18, fontWeight: 700, marginBottom: 8 }}>
              No pudimos recuperar tu carrito.
            </p>
            {errorMsg && (
              <p
                style={{
                  color: "rgba(13,27,53,0.55)",
                  fontSize: 12,
                  marginBottom: 16,
                  fontFamily: "monospace",
                }}
              >
                {errorMsg}
              </p>
            )}
            <a
              href={`/${locale ?? "mx"}`}
              style={{
                display: "inline-block",
                background: "#0D1B35",
                color: "white",
                textDecoration: "none",
                borderRadius: 999,
                padding: "12px 24px",
                fontSize: 14,
                fontWeight: 600,
              }}
            >
              Volver a la tienda
            </a>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
