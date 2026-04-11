import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { ClipboardList, RefreshCw, CreditCard, MapPin } from "lucide-react";
import { novapatchAppearance } from "@/lib/clerk-theme";

const PERKS = [
  { icon: ClipboardList, label: "Historial de pedidos completo" },
  { icon: RefreshCw,    label: "Gestión de suscripciones" },
  { icon: CreditCard,   label: "Tarjetas guardadas de forma segura" },
  { icon: MapPin,       label: "Direcciones guardadas" },
];

export default function SignInPage() {
  return (
    <div className="min-h-screen flex">

      {/* ── Panel izquierdo — Marca ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[460px] flex-shrink-0 relative overflow-hidden px-12 py-10"
        style={{ background: "#0D1B35" }}
      >
        {/* Formas decorativas */}
        <div
          className="absolute -top-28 -left-28 w-72 h-72 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(91,168,213,0.15) 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-16 -right-20 w-80 h-80 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(232,80,58,0.12) 0%, transparent 70%)" }}
        />
        {/* Línea accent lateral */}
        <div
          className="absolute top-0 right-0 w-[2px] h-full opacity-10"
          style={{ background: "linear-gradient(to bottom, transparent, #E8503A, transparent)" }}
        />

        {/* Logo */}
        <Link href="/" className="relative z-10">
          <Image
            src="/logos/logowht.webp"
            alt="NovaPatch"
            width={160}
            height={44}
            className="h-[34px] w-auto object-contain"
            priority
          />
        </Link>

        {/* Contenido central */}
        <div className="relative z-10 space-y-10">
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.18em] mb-4"
              style={{ color: "#E8503A" }}
            >
              Tu cuenta
            </p>
            <h2
              className="font-black leading-tight tracking-tight mb-4"
              style={{ fontSize: "clamp(24px, 2.8vw, 32px)", color: "#FAF7F2" }}
            >
              Tu bienestar,<br />
              <span style={{ color: "#5BA8D5" }}>siempre contigo.</span>
            </h2>
            <p
              className="text-[14px] leading-relaxed"
              style={{ color: "rgba(250,247,242,0.55)" }}
            >
              Ingresa para ver tus pedidos, gestionar<br />
              suscripciones y mucho más.
            </p>
          </div>

          {/* Perks */}
          <div className="space-y-2">
            {PERKS.map((p) => (
              <div key={p.label} className="flex items-center gap-3 py-1">
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-lg flex-shrink-0"
                  style={{ background: "rgba(91,168,213,0.12)", border: "1px solid rgba(91,168,213,0.15)" }}
                >
                  <p.icon className="h-4 w-4" style={{ color: "rgba(91,168,213,0.8)" }} />
                </span>
                <span
                  className="text-[13px] font-medium"
                  style={{ color: "rgba(250,247,242,0.7)" }}
                >
                  {p.label}
                </span>
              </div>
            ))}
          </div>

          {/* Strip decorativo */}
          <div className="flex gap-1.5">
            {["#E8503A", "#5BA8D5", "#C9D849", "#E8503A", "#5BA8D5", "#C9D849"].map((c, i) => (
              <div
                key={i}
                className="flex-1 h-[3px] rounded-full"
                style={{ background: c, opacity: 0.4 }}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center gap-4">
          <p className="text-[11px]" style={{ color: "rgba(250,247,242,0.3)" }}>
            © 2025 Novapatch
          </p>
          <span style={{ color: "rgba(250,247,242,0.15)" }}>·</span>
          <Link
            href="/privacidad"
            className="text-[11px] transition-opacity hover:opacity-80"
            style={{ color: "rgba(250,247,242,0.3)" }}
          >
            Privacidad
          </Link>
          <span style={{ color: "rgba(250,247,242,0.15)" }}>·</span>
          <Link
            href="/terminos"
            className="text-[11px] transition-opacity hover:opacity-80"
            style={{ color: "rgba(250,247,242,0.3)" }}
          >
            Términos
          </Link>
        </div>
      </div>

      {/* ── Panel derecho — Formulario Clerk (embedded) ── */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-6 py-16"
        style={{ background: "#FAF7F2" }}
      >

        {/* Logo mobile */}
        <Link href="/" className="lg:hidden mb-10">
          <Image
            src="/logos/logocolor.webp"
            alt="NovaPatch"
            width={150}
            height={42}
            className="h-[32px] w-auto object-contain"
          />
        </Link>

        {/* Formulario sin card chrome */}
        <div className="w-full" style={{ maxWidth: "400px" }}>
          <SignIn
            appearance={novapatchAppearance}
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
            fallbackRedirectUrl="/"
          />
        </div>

        <p
          className="lg:hidden mt-10 text-[11px]"
          style={{ color: "#9CA3AF" }}
        >
          © 2025 Novapatch · Bienestar que no interrumpe tu día
        </p>
      </div>
    </div>
  );
}
