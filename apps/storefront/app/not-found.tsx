import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-6 py-32" style={{ background: "linear-gradient(160deg, #EAF5FB 0%, #FAF7F2 100%)" }}>
        <div className="max-w-lg text-center flex flex-col items-center gap-6">
          {/* Big 404 */}
          <div className="relative">
            <span className="text-[180px] font-black leading-none text-[#E8503A]/12 select-none">404</span>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-6xl">🩹</div>
            </div>
          </div>

          <div>
            <h1 className="text-3xl lg:text-4xl font-bold text-[#0D1B35] mb-3">Esta página no existe</h1>
            <p className="text-[#0D1B35]/55 text-lg leading-relaxed">
              Parece que este parche se despegó. La página que buscas no está aquí, pero el bienestar sí.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link href="/"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#E8503A] text-white font-semibold rounded-2xl hover:bg-[#C43B28] active:scale-95 transition-all duration-200 shadow-[0_4px_20px_rgba(232,80,58,0.3)]">
              Ir al inicio
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </Link>
            <Link href="/faq"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-[#0D1B35]/12 text-[#0D1B35] font-semibold rounded-2xl hover:border-[#E8503A]/30 hover:text-[#E8503A] active:scale-95 transition-all duration-200">
              Ver preguntas frecuentes
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
