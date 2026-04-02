import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import {
  GiftIcon,
  AdjustmentsHorizontalIcon,
  BellAlertIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";
import { novapatchAppearance } from "@/lib/clerk-theme";

const BENEFITS = [
  {
    icon: GiftIcon,
    title: "20% OFF en tu primera suscripción",
    desc: "Solo para miembros nuevos.",
  },
  {
    icon: AdjustmentsHorizontalIcon,
    title: "Panel de control completo",
    desc: "Pausá, cambiá o cancelá cuando quieras.",
  },
  {
    icon: BellAlertIcon,
    title: "Recordatorios personalizados",
    desc: "Te avisamos antes de cada envío.",
  },
];

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex">

      {/* ── Panel izquierdo — Marca ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[480px] flex-shrink-0 relative overflow-hidden px-12 py-10"
        style={{ background: "#005088" }}
      >
        {/* Formas decorativas */}
        <div className="absolute -top-32 -right-20 w-72 h-72 rounded-full opacity-[0.08]"
          style={{ background: "#C9D849" }} />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 rounded-full opacity-[0.07]"
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

        {/* Contenido */}
        <div className="relative z-10 space-y-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.16em] mb-3"
              style={{ color: "#E8503A" }}>
              Únete a Novapatch
            </p>
            <h2
              className="font-black leading-tight tracking-tight mb-3"
              style={{ fontSize: "clamp(24px,3vw,32px)", color: "#FAF7F2" }}
            >
              Pega el parche.<br />
              <span style={{ color: "#C9D849" }}>Olvidate del resto.</span>
            </h2>
            <p className="text-[14px] leading-relaxed" style={{ color: "rgba(250,247,242,0.65)" }}>
              Una cuenta, todos tus parches, entrega automática.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="flex gap-3 p-4 rounded-xl"
                style={{ background: "rgba(250,247,242,0.06)" }}
              >
                <b.icon className="h-6 w-6 flex-shrink-0 mt-0.5"
                  style={{ color: "rgba(250,247,242,0.65)" }} />
                <div>
                  <p className="text-[13px] font-bold leading-tight" style={{ color: "#FAF7F2" }}>
                    {b.title}
                  </p>
                  <p className="text-[11px] mt-0.5" style={{ color: "rgba(250,247,242,0.55)" }}>
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div
            className="flex items-center gap-3 p-4 rounded-xl"
            style={{ background: "rgba(201,216,73,0.12)", border: "1px solid rgba(201,216,73,0.2)" }}
          >
            <StarIcon className="h-5 w-5 flex-shrink-0" style={{ color: "#C9D849" }} />
            <div>
              <p className="text-[12px] font-bold" style={{ color: "#C9D849" }}>
                +2,400 clientes en México
              </p>
              <p className="text-[11px]" style={{ color: "rgba(250,247,242,0.5)" }}>
                ya cuidan su bienestar con NovaPatch
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10">
          <p className="text-[11px]" style={{ color: "rgba(250,247,242,0.35)" }}>
            © 2025 Novapatch · hola@novapatch.mx
          </p>
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

        <SignUp
          appearance={novapatchAppearance}
          routing="path"
          path="/sign-up"
          signInUrl="/sign-in"
          fallbackRedirectUrl="/"
        />

        <p className="lg:hidden mt-8 text-[11px]" style={{ color: "#9CA3AF" }}>
          © 2025 Novapatch · Bienestar que no interrumpe tu día
        </p>
      </div>
    </div>
  );
}
