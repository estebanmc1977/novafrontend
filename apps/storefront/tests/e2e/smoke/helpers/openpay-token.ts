// novafrontend/apps/storefront/tests/e2e/smoke/helpers/openpay-token.ts
//
// Creates a one-time Openpay token from the founder's card data.
// The card data lives in GHA secrets and is loaded from env vars by the
// smoke runner. We tokenize on every run rather than storing a vault
// token because Medusa's /complete route expects a one-time token.
//
// Docs: https://www.openpay.mx/docs/api/#crear-un-nuevo-token

export type OpenpayTokenInput = {
  merchantId: string
  privateKey: string  // sk_XXX, base64 user:password style auth
  card: {
    cardNumber: string
    cvv: string
    expirationMonth: string
    expirationYear: string
    holderName: string
  }
  /** "https://sandbox-api.openpay.mx/v1" or "https://api.openpay.mx/v1" */
  apiBaseUrl: string
}

export async function createOpenpayToken(input: OpenpayTokenInput): Promise<string> {
  const { merchantId, privateKey, card, apiBaseUrl } = input

  const auth = Buffer.from(`${privateKey}:`).toString("base64")

  const res = await fetch(`${apiBaseUrl}/${merchantId}/tokens`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify({
      card_number: card.cardNumber,
      holder_name: card.holderName,
      expiration_year: card.expirationYear,
      expiration_month: card.expirationMonth,
      cvv2: card.cvv,
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Openpay tokenization failed (${res.status}): ${errText}`)
  }

  const body = (await res.json()) as { id?: string }
  if (!body.id) {
    throw new Error(`Openpay tokenization returned no id: ${JSON.stringify(body)}`)
  }
  return body.id
}
