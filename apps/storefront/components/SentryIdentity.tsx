// apps/storefront/components/SentryIdentity.tsx
'use client'
import { useSentryIdentity } from '@/hooks/use-sentry-identity'

export function SentryIdentity() {
  useSentryIdentity()
  return null
}
