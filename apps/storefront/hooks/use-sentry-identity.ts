// apps/storefront/hooks/use-sentry-identity.ts
'use client'
import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

export function useSentryIdentity() {
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (!isLoaded) return

    if (user) {
      Sentry.setUser({
        id: user.id,
        email: user.primaryEmailAddress?.emailAddress,
      })
    } else {
      // Limpiar contexto de usuario al hacer logout
      Sentry.setUser(null)
    }
  }, [user, isLoaded])
}
