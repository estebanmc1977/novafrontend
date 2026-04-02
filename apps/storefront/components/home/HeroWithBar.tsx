"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import HeroSection from "./HeroSection";
import AttributeBar from "./AttributeBar";

export const slides = [
  { src: "/carousel/Glow-new.webp",   alt: "Novapatch Glow",   accent: "#F25C54" },
  { src: "/carousel/Shield-new.webp", alt: "Novapatch Shield", accent: "#FFA849" },
  { src: "/carousel/Energy-new.webp", alt: "Novapatch Energy", accent: "#83B5F4" },
  { src: "/carousel/Sleep-new.webp",  alt: "Novapatch Sleep",  accent: "#1EB1BC" },
  { src: "/carousel/Woman-new.webp",  alt: "Novapatch Woman",  accent: "#C693C4" },
  { src: "/carousel/Zen-new.webp",    alt: "Novapatch Zen",    accent: "#4E82BC" },
];

export default function HeroWithBar() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 4500);
  }, []);

  useEffect(() => {
    resetTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [resetTimer]);

  const handleNav = (dir: number) => {
    setCurrent((c) => (c + dir + slides.length) % slides.length);
    resetTimer();
  };

  const handleDot = (i: number) => {
    setCurrent(i);
    resetTimer();
  };

  return (
    <>
      <HeroSection
        slides={slides}
        current={current}
        onNav={handleNav}
        onDot={handleDot}
      />
      <AttributeBar current={current} accent={slides[current].accent} />
    </>
  );
}
