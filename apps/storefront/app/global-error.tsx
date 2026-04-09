'use client'
import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="es">
      <body
        style={{
          margin: 0,
          background: '#FAF7F2',
          fontFamily: 'sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        }}
      >
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h1 style={{ color: '#0D1B35', fontSize: '1.75rem', marginBottom: '0.75rem' }}>
            Algo salió mal
          </h1>
          <p style={{ color: '#4A5568', marginBottom: '1.5rem' }}>
            Ocurrió un error inesperado. Intenta recargar la página.
          </p>
          <button
            onClick={reset}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#E8503A',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            Reintentar
          </button>
          {error.digest && (
            <p style={{ color: '#9CA3AF', fontSize: '0.75rem', marginTop: '1rem', fontFamily: 'monospace' }}>
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  )
}
