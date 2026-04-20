export function formatPrice(amount: number, currency: string, locale?: string): string {
  const resolvedLocale = locale ?? localeForCurrency(currency)
  return new Intl.NumberFormat(resolvedLocale, {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
  }).format(amount)
}

function localeForCurrency(currency: string): string {
  switch (currency.toUpperCase()) {
    case "ARS":
      return "es-AR"
    case "BRL":
      return "pt-BR"
    case "CLP":
      return "es-CL"
    case "COP":
      return "es-CO"
    case "MXN":
    default:
      return "es-MX"
  }
}
