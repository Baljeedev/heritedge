const DEFAULT_MESSAGE =
  "Hi, I found your profile on HeritEdge and would like to connect."

export function formatWhatsAppUrl(number: string, message = DEFAULT_MESSAGE): string {
  const digits = number.replace(/\D/g, "")
  if (!digits) return ""
  const base = `https://wa.me/${digits}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}
