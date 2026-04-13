// apps/storefront/components/PostHogProvider.tsx
'use client'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import posthog from 'posthog-js'
import { usePostHogIdentity } from '@/hooks/use-posthog-identity'

export function PostHogProvider() {
  const pathname = usePathname()

  // Sync Clerk identity → PostHog on every auth state change
  usePostHogIdentity()

  // Manual pageview on every route change (capture_pageview: false in init)
  useEffect(() => {
    posthog.capture('$pageview', { $current_url: window.location.href })
  }, [pathname])

  return null
}
