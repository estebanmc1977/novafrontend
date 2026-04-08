import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="es">
      <body style={{ margin: 0, fontFamily: "sans-serif" }}>
        <main
          className="min-h-screen flex items-center justify-center px-6 py-32"
          style={{ background: "linear-gradient(160deg, #EAF5FB 0%, #FAF7F2 100%)", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem 1.5rem" }}
        >
          <div style={{ maxWidth: "32rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", gap: "1.5rem" }}>
            <div style={{ position: "relative" }}>
              <span style={{ fontSize: "10rem", fontWeight: 900, lineHeight: 1, color: "rgba(232,80,58,0.12)", userSelect: "none", display: "block" }}>404</span>
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "3.5rem" }}>🩹</span>
              </div>
            </div>

            <div>
              <h1 style={{ fontSize: "2rem", fontWeight: 700, color: "#0D1B35", marginBottom: "0.75rem" }}>Esta página no existe</h1>
              <p style={{ color: "rgba(13,27,53,0.55)", fontSize: "1.125rem", lineHeight: 1.6 }}>
                Parece que este parche se despegó. La página que buscas no está aquí, pero el bienestar sí.
              </p>
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", justifyContent: "center" }}>
              <Link
                href="/mx"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "1rem 2rem", backgroundColor: "#E8503A", color: "#fff", fontWeight: 600, borderRadius: "1rem", textDecoration: "none" }}
              >
                Ir al inicio
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
              </Link>
              <Link
                href="/mx/faq"
                style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "1rem 2rem", backgroundColor: "#fff", border: "2px solid rgba(13,27,53,0.12)", color: "#0D1B35", fontWeight: 600, borderRadius: "1rem", textDecoration: "none" }}
              >
                Ver preguntas frecuentes
              </Link>
            </div>
          </div>
        </main>
      </body>
    </html>
  );
}
