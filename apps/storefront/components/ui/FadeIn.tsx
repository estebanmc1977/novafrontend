"use client";

import { motion } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";

interface FadeInProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  x?: number;
  y?: number;
  duration?: number;
}

export function FadeIn({
  children,
  className,
  style,
  delay = 0,
  x = 0,
  y = 24,
  duration = 0.6,
}: FadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
