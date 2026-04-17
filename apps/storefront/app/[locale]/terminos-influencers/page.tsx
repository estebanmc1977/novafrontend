import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Términos de Colaboración para Influencers | Novapatch",
  description: "Condiciones de colaboración entre creadores de contenido y Novapatch México.",
  robots: { index: false, follow: false },
};

const SECTIONS = [
  {
    title: "1. Partes del acuerdo",
    body: `Este documento establece los términos de colaboración entre Novapatch México ("la Marca") y el creador de contenido que completa el formulario de postulación ("el Influencer"). La relación que se origina no es laboral ni de exclusividad, salvo que se acuerde expresamente por escrito.`,
  },
  {
    title: "2. Proceso de postulación y selección",
    body: `El envío del formulario de postulación no garantiza la aceptación en el programa. Novapatch evaluará cada perfil de forma interna y notificará la decisión dentro de los 7 días hábiles posteriores al envío. Los criterios de selección incluyen, de forma no exhaustiva: nicho de contenido, tamaño y calidad de audiencia, alineación con los valores de la marca y tipo de colaboración solicitado.`,
  },
  {
    title: "3. Modalidades de colaboración",
    body: `Las colaboraciones pueden ser de tres tipos:\n\n• Producto a cambio de contenido: el Influencer recibe productos Novapatch sin costo a cambio de publicar contenido acordado.\n• Colaboración paga: el Influencer recibe una compensación económica acordada previamente por la creación y publicación de contenido específico.\n• Embajador a largo plazo: relación continua con beneficios exclusivos y compensación recurrente, sujeta a contrato separado.\n\nEn todos los casos, los términos específicos (piezas requeridas, plazos, formatos) se confirmarán por escrito antes del inicio de la colaboración.`,
  },
  {
    title: "4. Obligaciones del Influencer",
    body: `Al participar en el programa, el Influencer se compromete a:\n\n• Publicar el contenido acordado dentro del plazo establecido.\n• Declarar explícitamente la relación comercial con Novapatch en cada publicación patrocinada, conforme a las normas de la FTC y la legislación mexicana vigente (uso de etiquetas como #Publicidad, #Ad o equivalentes).\n• No realizar afirmaciones médicas o de salud no autorizadas sobre los productos.\n• No colaborar con marcas directamente competidoras durante la vigencia activa de la colaboración, salvo acuerdo en contrario.\n• Compartir métricas de las publicaciones (alcance, impresiones, interacciones) dentro de los 7 días posteriores a cada publicación.`,
  },
  {
    title: "5. Obligaciones de Novapatch",
    body: `Novapatch se compromete a:\n\n• Proveer los productos y/o compensación acordados dentro de los plazos estipulados.\n• Dar feedback sobre el contenido propuesto en un plazo máximo de 48 horas hábiles.\n• Respetar la voz y estilo creativo del Influencer, sin exigir alteraciones que comprometan su autenticidad.\n• Mantener la confidencialidad de la información personal y métricas compartidas por el Influencer.`,
  },
  {
    title: "6. Derechos de contenido",
    body: `El Influencer conserva la propiedad intelectual del contenido que crea. Al publicarlo, otorga a Novapatch una licencia no exclusiva para republicarlo en los canales propios de la marca (redes sociales, sitio web, newsletters) con atribución al creador. Novapatch no podrá modificar el contenido de forma sustancial ni utilizarlo en campañas de pago (meta ads, Google Ads, etc.) sin consentimiento escrito adicional del Influencer.`,
  },
  {
    title: "7. Productos y envíos",
    body: `Los productos enviados como parte de una colaboración son un beneficio asociado al programa y no constituyen pago por servicios. En caso de no publicarse el contenido acordado en el plazo establecido sin causa justificada, Novapatch podrá solicitar la devolución del producto o su equivalente en valor. Los envíos se realizan únicamente dentro del territorio mexicano en la Fase 1.`,
  },
  {
    title: "8. Privacidad de datos",
    body: `Los datos personales recopilados mediante el formulario de postulación (nombre, email, handles, métricas) se utilizan exclusivamente para evaluar y gestionar la relación de colaboración. No se comparten con terceros sin consentimiento, salvo obligación legal. Para más detalle, consultá nuestra Política de Privacidad en novapatch.care/privacidad.`,
  },
  {
    title: "9. Modificaciones y terminación",
    body: `Novapatch se reserva el derecho de modificar estos términos con previo aviso de 15 días. Cualquiera de las partes puede dar por finalizada la colaboración en cualquier momento, respetando los compromisos ya acordados y en curso. En caso de incumplimiento grave por parte del Influencer, Novapatch podrá suspender la relación de forma inmediata.`,
  },
  {
    title: "10. Jurisdicción",
    body: `Este acuerdo se rige por las leyes de los Estados Unidos Mexicanos. Cualquier disputa que no pueda resolverse de forma amigable será sometida a la jurisdicción de los tribunales competentes de la Ciudad de México.`,
  },
];

export default function TerminosInfluencersPage() {
  return (
    <>
      <Navbar lightBg />
      <main style={{ background: "#FAF7F2" }}>
        {/* Header */}
        <section
          className="pt-32 pb-16 px-6"
          style={{ borderBottom: "1px solid rgba(13,27,53,0.08)" }}
        >
          <div className="max-w-3xl mx-auto">
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-4"
              style={{ color: "#E8503A" }}
            >
              Legal · Programa de Influencers
            </p>
            <h1
              className="text-4xl font-bold mb-4"
              style={{ color: "#0D1B35", letterSpacing: "-0.02em" }}
            >
              Términos de Colaboración
            </h1>
            <p style={{ color: "rgba(13,27,53,0.5)", lineHeight: 1.7 }}>
              Versión 1.0 · Vigente desde mayo 2026 · México
            </p>
          </div>
        </section>

        {/* Intro callout */}
        <section className="px-6 py-10">
          <div className="max-w-3xl mx-auto">
            <div
              className="rounded-2xl px-7 py-6"
              style={{ background: "rgba(232,80,58,0.06)", border: "1px solid rgba(232,80,58,0.15)" }}
            >
              <p className="text-base leading-relaxed" style={{ color: "rgba(13,27,53,0.7)" }}>
                Este documento describe cómo funciona la relación entre Novapatch y los creadores de contenido que forman parte de nuestro programa de embajadores. Lo escribimos en lenguaje claro para que sepas exactamente qué podés esperar de nosotros y qué esperamos de vos.
              </p>
            </div>
          </div>
        </section>

        {/* Sections */}
        <section className="px-6 pb-24">
          <div className="max-w-3xl mx-auto flex flex-col gap-10">
            {SECTIONS.map((s) => (
              <div key={s.title}>
                <h2
                  className="text-lg font-bold mb-3"
                  style={{ color: "#0D1B35" }}
                >
                  {s.title}
                </h2>
                <div
                  className="text-base leading-relaxed whitespace-pre-line"
                  style={{ color: "rgba(13,27,53,0.65)" }}
                >
                  {s.body}
                </div>
              </div>
            ))}

            {/* CTA back to form */}
            <div
              className="mt-6 pt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              style={{ borderTop: "1px solid rgba(13,27,53,0.08)" }}
            >
              <a
                href="/influencers#aplicar"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full font-semibold text-sm text-white"
                style={{ background: "#E8503A" }}
              >
                Volver a postularme
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                  <path d="M2.5 7H11.5M11.5 7L7 2.5M11.5 7L7 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
              <p className="text-sm" style={{ color: "rgba(13,27,53,0.4)" }}>
                ¿Tenés preguntas? Escribinos a{" "}
                <a href="mailto:hola@novapatch.care" style={{ color: "#E8503A" }}>
                  hola@novapatch.care
                </a>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
