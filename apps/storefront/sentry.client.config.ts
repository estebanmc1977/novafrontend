import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  environment: process.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT,

  // 10% de transacciones en producción, 100% en staging para visibilidad completa
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

  // Session Replay: 10% de sesiones normales, 100% de sesiones con error
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      maskAllInputs: true,  // PCI compliance — oculta campos de pago y contraseñas
      blockAllMedia: false,
    }),
  ],

  enabled: process.env.NODE_ENV !== 'development',

  beforeSend(event) {
    // Filtrar errores de extensiones de browser — no son nuestros
    const frames = event.exception?.values?.[0]?.stacktrace?.frames
    if (frames?.some(f =>
      f.filename?.includes('chrome-extension') ||
      f.filename?.includes('moz-extension')
    )) return null
    return event
  },
})
