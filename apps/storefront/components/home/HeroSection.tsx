"use client";

import { useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface Slide {
  src: string;
  alt: string;
  accent: string;
}

interface HeroSectionProps {
  slides: Slide[];
  current: number;
  onNav: (dir: number) => void;
  onDot: (i: number) => void;
  onPause: () => void;
  onResume: () => void;
}

const SWIPE_THRESHOLD = 50;

export default function HeroSection({ slides, current, onNav, onDot, onPause, onResume }: HeroSectionProps) {
  const t = useTranslations("home.hero");
  const pointerStartX = useRef<number | null>(null);
  const swiping = useRef(false);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerStartX.current = e.clientX;
    swiping.current = false;
    if (e.pointerType === "touch") {
      onPause();
    }
  }, [onPause]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (pointerStartX.current === null) return;
    const dx = e.clientX - pointerStartX.current;
    if (Math.abs(dx) >= SWIPE_THRESHOLD) {
      swiping.current = true;
    }
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (pointerStartX.current === null) return;
    const dx = e.clientX - pointerStartX.current;
    pointerStartX.current = null;

    if (Math.abs(dx) >= SWIPE_THRESHOLD) {
      onNav(dx < 0 ? 1 : -1);
      // onNav already pauses + schedules resume
    } else if (e.pointerType === "touch") {
      // Touch tap without swipe — resume after delay
      onResume();
    }
  }, [onNav, onResume]);

  const handlePointerCancel = useCallback(() => {
    pointerStartX.current = null;
    swiping.current = false;
    onResume();
  }, [onResume]);

  return (
    <section
      className="relative w-full overflow-hidden min-h-[580px] sm:min-h-0 sm:aspect-video touch-pan-y"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onMouseEnter={onPause}
      onMouseLeave={onResume}
    >

      {/* Carousel track */}
      <div
        className="absolute inset-0 flex transition-transform duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div key={i} className="relative min-w-full h-full flex-shrink-0">
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              // En mobile centramos la imagen; en desktop mantenemos object-top
              className="object-cover object-center sm:object-top"
              priority={i === 0}
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      {/* Gradient overlay
          Mobile: gradiente desde abajo (texto va abajo) y una capa superior
          Desktop: gradiente diagonal desde la izquierda como antes */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: [
            /* capa mobile — fondo oscuro abajo para el texto */
            "linear-gradient(to top, rgba(0,30,50,0.80) 0%, rgba(0,30,50,0.50) 40%, rgba(0,0,0,0.15) 100%)",
          ].join(", "),
        }}
      />
      {/* Capa adicional desktop que mantiene el estilo original */}
      <div
        className="absolute inset-0 z-[1] hidden sm:block"
        style={{
          background:
            "linear-gradient(100deg, rgba(0,55,65,0.55) 0%, rgba(0,55,65,0.28) 42%, rgba(0,0,0,0.0) 100%)",
        }}
      />

      {/* ── Text overlay ──────────────────────────────────────────────────────────
          Mobile:   fijo al fondo (items-end), padding generoso, todo centrado
          Desktop:  centrado verticalmente, alineado a la izquierda como antes  */}
      <div className="absolute inset-0 z-[2] flex items-end sm:items-center pb-14 sm:pb-0">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-14 w-full">
          <div className="max-w-[560px] mx-auto sm:mx-0">

            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 mb-4 sm:mb-5 px-3.5 py-1 sm:px-4 sm:py-1.5 rounded-full text-white font-medium"
              style={{
                fontSize: "clamp(11px, 3vw, 13px)",
                background: "rgba(255,255,255,0.22)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.35)",
              }}
            >
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-white flex-shrink-0" />
              {t("badge")}
            </div>

            {/* Headline
                Mobile: más compacto, sin salto de línea forzado → el texto fluye
                Desktop: tamaño grande con salto de línea */}
            <h1
              className="text-white font-black leading-[1.08] mb-3 sm:mb-4 tracking-[-0.02em] text-center sm:text-left"
              style={{ fontSize: "clamp(34px, 8vw, 62px)" }}
            >
              {t("title")}
            </h1>

            {/* Subtitle */}
            <p
              className="text-white/85 font-normal mb-6 sm:mb-9 leading-[1.6] max-w-[400px] mx-auto sm:mx-0 text-center sm:text-left"
              style={{ fontSize: "clamp(14px, 3.5vw, 17px)" }}
            >
              {t("subtitle")}
            </p>

            {/* CTAs
                Mobile: botones full-width apilados verticalmente
                Desktop: fila horizontal */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <Link
                href="#productos"
                className="inline-flex items-center justify-center gap-2 bg-white font-bold px-7 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,0,0,0.2)] shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
                style={{ color: "#005088", fontSize: "clamp(14px, 3.5vw, 15px)" }}
              >
                {t("cta")}
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="#como-funciona"
                className="inline-flex items-center justify-center gap-2 bg-transparent text-white font-semibold px-6 py-3.5 rounded-full transition-all duration-200 hover:bg-white/15"
                style={{
                  border: "2px solid rgba(255,255,255,0.5)",
                  fontSize: "clamp(14px, 3.5vw, 15px)",
                }}
              >
                {t("ctaSecondary")}
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Prev/Next — ocultos en mobile (demasiado pequeños para tocar) */}
      <button
        onClick={() => onNav(-1)}
        aria-label="Anterior"
        className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-[5] w-10 h-10 rounded-full bg-white/90 items-center justify-center text-[#111827] shadow-[0_4px_16px_rgba(0,0,0,0.10)] transition-all duration-200 hover:bg-white hover:scale-105"
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        onClick={() => onNav(1)}
        aria-label="Siguiente"
        className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-[5] w-10 h-10 rounded-full bg-white/90 items-center justify-center text-[#111827] shadow-[0_4px_16px_rgba(0,0,0,0.10)] transition-all duration-200 hover:bg-white hover:scale-105"
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Dots — más grandes en mobile para facilitar el toque */}
      <div className="absolute bottom-4 sm:bottom-4 left-1/2 -translate-x-1/2 z-[5] flex gap-2 items-center">
        {slides.map((s, i) => (
          <button
            key={i}
            onClick={() => onDot(i)}
            aria-label={`Slide ${i + 1}`}
            className="rounded-full transition-all duration-[350ms]"
            style={{
              height: "8px",
              width: i === current ? "24px" : "8px",
              background: i === current ? s.accent : "rgba(255,255,255,0.5)",
              // Área de toque mínima de 44px en mobile
              padding: "8px 0",
              margin: "-8px 0",
              boxSizing: "content-box",
            }}
          />
        ))}
      </div>
    </section>
  );
}
