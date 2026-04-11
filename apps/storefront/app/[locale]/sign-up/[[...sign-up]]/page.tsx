import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Gift, SlidersHorizontal, BellRing, Star } from "lucide-react";
import { novapatchAppearance } from "@/lib/clerk-theme";

const BENEFITS = [
  {
    icon: Gift,
    title: "20% OFF en tu primera suscripción",
    desc:  "Solo para miembros nuevos.",
  },
  {
    icon: SlidersHorizontal,
    title: "Panel de control completo",
    desc:  "Pausá, cambiá o cancelá cuando quieras.",
  },
  {
    icon: BellRing,
    title: "Recordatorios personalizados",
    desc:  "Te avisamos antes de cada envío.",
  },
];

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex">

      {/* ── Panel izquierdo — Marca ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[460px] flex-shrink-0 relative overflow-hidden px-12 py-10"
        style={{ background: "#0D1B35" }}
      >
        {/* Formas decorativas */}
        <div
          className="absolute -top-24 -right-24 w-72 h-72 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(201,216,73,0.12) 0%, transparent 70%)" }}
        />
        <div
          className="absolute -bottom-24 -left-16 w-64 h-64 rounded-full"
          style={{ background: "radial-gradient(circle, rgba(232,80,58,0.12) 0%, transparent 70%)" }}
        />
        {/* Línea accent lateral */}
        <div
          className="absolute top-0 right-0 w-[2px] h-full opacity-10"
          style={{ background: "linear-gradient(to bottom, transparent, #C9D849, transparent)" }}
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

        {/* Contenido */}
        <div className="relative z-10 space-y-9">
          <div>
            <p
              className="text-[10px] font-bold uppercase tracking-[0.18em] mb-4"
              style={{ color: "#C9D849" }}
            >
              Únete a Novapatch
            </p>
            <h2
              className="font-black leading-tight tracking-tight mb-4"
              style={{ fontSize: "clamp(24px, 2.8vw, 32px)", color: "#FAF7F2" }}
            >
              Pega el parche.<br />
              <span style={{ color: "#E8503A" }}>Olvidate del resto.</span>
            </h2>
            <p
              className="text-[14px] leading-relaxed"
              style={{ color: "rgba(250,247,242,0.55)" }}
            >
              Una cuenta, todos tus parches,<br />
              entrega automática.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-2">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="flex gap-3 p-3.5 rounded-xl"
                style={{
                  background: "rgba(250,247,242,0.04)",
                  border:     "1px solid rgba(250,247,242,0.07)",
                }}
              >
                <b.icon
                  className="h-5 w-5 flex-shrink-0 mt-0.5"
                  style={{ color: "rgba(201,216,73,0.75)" }}
                />
                <div>
                  <p
                    className="text-[13px] font-bold leading-snug"
                    style={{ color: "#FAF7F2" }}
                  >
                    {b.title}
                  </p>
                  <p
                    className="text-[11px] mt-0.5 leading-relaxed"
                    style={{ color: "rgba(250,247,242,0.45)" }}
                  >
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div
            className="flex items-center gap-3 p-4 rounded-xl"
            style={{
              background: "rgba(201,216,73,0.08)",
              border:     "1px solid rgba(201,216,73,0.15)",
            }}
          >
            <Star className="h-5 w-5 flex-shrink-0" fill="currentColor" style={{ color: "#C9D849" }} />
            <div>
              <p className="text-[12px] font-bold" style={{ color: "#C9D849" }}>
                +2,400 clientes en México
              </p>
              <p
                className="text-[11px] mt-0.5"
                style={{ color: "rgba(250,247,242,0.45)" }}
              >
                ya cuidan su bienestar con NovaPatch
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center gap-4">
          <p className="text-[11px]" style={{ color: "rgba(250,247,242,0.3)" }}>
            © 2025 Novapatch
          </p>
          <span style={{ color: "rgba(250,247,242,0.15)" }}>·</span>
          <a
            href="mailto:hola@novapatch.mx"
            className="text-[11px] transition-opacity hover:opacity-80"
            style={{ color: "rgba(250,247,242,0.3)" }}
          >
            hola@novapatch.mx
          </a>
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
          <SignUp
            appearance={novapatchAppearance}
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
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
