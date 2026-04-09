"use client";

import * as Sentry from '@sentry/nextjs'
import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
    Sentry.captureException(error)
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-32" style={{ background: "linear-gradient(160deg, #EAF5FB 0%, #FAF7F2 100%)" }}>
      <div className="max-w-lg text-center flex flex-col items-center gap-6">
        <div className="w-20 h-20 rounded-3xl bg-[#E8503A]/12 flex items-center justify-center text-4xl">⚠️</div>

        <div>
          <h1 className="text-3xl font-bold text-[#0D1B35] mb-3">Algo salió mal</h1>
          <p className="text-[#0D1B35]/55 text-lg leading-relaxed">
            Ocurrió un error inesperado. Nuestro equipo ya fue notificado. Puedes intentar de nuevo o volver al inicio.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <button onClick={reset}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#E8503A] text-white font-semibold rounded-2xl hover:bg-[#C43B28] active:scale-95 transition-all duration-200 shadow-[0_4px_20px_rgba(232,80,58,0.3)]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M13 2v4H9M3 14v-4h4M13 6A6 6 0 1 1 7 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Reintentar
          </button>
          <Link href="/"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white border-2 border-[#0D1B35]/12 text-[#0D1B35] font-semibold rounded-2xl hover:border-[#E8503A]/30 hover:text-[#E8503A] active:scale-95 transition-all duration-200">
            Ir al inicio
          </Link>
        </div>

        {error.digest && (
          <p className="text-xs text-[#0D1B35]/25 font-mono">Error ID: {error.digest}</p>
        )}
      </div>
    </main>
  );
}
