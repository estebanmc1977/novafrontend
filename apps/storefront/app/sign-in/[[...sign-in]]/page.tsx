import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import {
  ClipboardDocumentListIcon,
  ArrowPathIcon,
  CreditCardIcon,
  MapPinIcon,
} from "@heroicons/react/24/outline";
import { novapatchAppearance } from "@/lib/clerk-theme";

const PERKS = [
  { icon: ClipboardDocumentListIcon, label: "Historial de pedidos completo" },
  { icon: ArrowPathIcon,             label: "Gestión de suscripciones" },
  { icon: CreditCardIcon,            label: "Tarjetas guardadas de forma segura" },
  { icon: MapPinIcon,                label: "Direcciones guardadas" },
];

export default function SignInPage() {
  return (
    <div className="min-h-screen flex">

      {/* ── Panel izquierdo — Marca ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[480px] flex-shrink-0 relative overflow-hidden px-12 py-10"
        style={{ background: "#005088" }}
      >
        {/* Círculos decorativos */}
        <div className="absolute -top-24 -left-24 w-64 h-64 rounded-full opacity-10"
          style={{ background: "#FAF7F2" }} />
        <div className="absolute bottom-20 -right-16 w-80 h-80 rounded-full opacity-[0.07]"
          style={{ background: "#E8503A" }} />

        {/* Logo */}
        <Link href="/" className="relative z-10">
          <Image
            src="/logos/logowht.webp"
            alt="NovaPatch"
            width={160}
            height={44}
            className="h-[38px] w-auto object-contain"
            priority
          />
        </Link>

        {/* Contenido central */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2
              className="font-black leading-tight tracking-tight mb-3"
              style={{ fontSize: "clamp(26px,3vw,34px)", color: "#FAF7F2" }}
            >
              Tu bienestar,<br />
              <span style={{ color: "#E8503A" }}>siempre contigo.</span>
            </h2>
            <p className="text-[15px] leading-relaxed" style={{ color: "rgba(250,247,242,0.7)" }}>
              Ingresa para ver tus pedidos, gestionar suscripciones y mucho más.
            </p>
          </div>

          {/* Perks */}
          <div className="space-y-3">
            {PERKS.map((p) => (
              <div key={p.label} className="flex items-center gap-3">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-xl flex-shrink-0"
                  style={{ background: "rgba(250,247,242,0.1)" }}
                >
                  <p.icon className="h-5 w-5" style={{ color: "rgba(250,247,242,0.75)" }} />
                </span>
                <span className="text-[13px] font-semibold" style={{ color: "rgba(250,247,242,0.85)" }}>
                  {p.label}
                </span>
              </div>
            ))}
          </div>

          {/* Strip decorativo */}
          <div className="flex gap-2 pt-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-1 h-1 rounded-full"
                style={{ background: "rgba(232,80,58,0.5)" }} />
            ))}
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.15em]"
            style={{ color: "rgba(250,247,242,0.4)" }}>
            6 fórmulas · Un solo formato
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center gap-4">
          <p className="text-[11px]" style={{ color: "rgba(250,247,242,0.4)" }}>
            © 2025 Novapatch
          </p>
          <span style={{ color: "rgba(250,247,242,0.2)" }}>·</span>
          <Link href="/privacidad" className="text-[11px] transition-opacity hover:opacity-80"
            style={{ color: "rgba(250,247,242,0.4)" }}>
            Privacidad
          </Link>
        </div>
      </div>

      {/* ── Panel derecho — Formulario Clerk ── */}
      <div
        className="flex-1 flex flex-col items-center justify-center px-6 py-12"
        style={{ background: "#FAF7F2" }}
      >
        {/* Logo mobile */}
        <Link href="/" className="lg:hidden mb-8">
          <Image
            src="/logos/logocolor.webp"
            alt="NovaPatch"
            width={150}
            height={42}
            className="h-[36px] w-auto object-contain"
          />
        </Link>

        <SignIn
          appearance={novapatchAppearance}
          routing="path"
          path="/sign-in"
          signUpUrl="/sign-up"
          fallbackRedirectUrl="/"
        />

        <p className="lg:hidden mt-8 text-[11px]" style={{ color: "#9CA3AF" }}>
          © 2025 Novapatch · Bienestar que no interrumpe tu día
        </p>
      </div>
    </div>
  );
}
