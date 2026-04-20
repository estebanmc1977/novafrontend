"use client"

import { useParams } from "next/navigation"
import { MARKETS } from "@/lib/markets"
import type { Locale } from "@/i18n/routing"

export function useMarket() {
  const params = useParams()
  const raw = typeof params?.locale === "string" ? params.locale : "mx"
  return MARKETS[raw as Locale] ?? MARKETS.mx
}
