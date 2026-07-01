import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function parseSpecializationItems(specialization: string): string[] {
  return specialization
    .split(/[,;|]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

/** Search terms derived from a heritage site name (e.g. "Red Fort (Lal Qila)" → "Red Fort"). */
export function getMonumentSearchTerms(siteName: string): string[] {
  const trimmed = siteName.trim()
  const terms = new Set<string>()
  if (trimmed) terms.add(trimmed)
  const withoutParens = trimmed.replace(/\s*\([^)]*\)/g, "").trim()
  if (withoutParens) terms.add(withoutParens)
  return Array.from(terms)
}

export function guideMatchesMonument(
  guide: {
    specialization: string
    sites?: Array<string | { _id: string }>
  },
  siteId: string | null,
  siteName: string
): boolean {
  const spec = guide.specialization.toLowerCase()
  const terms = getMonumentSearchTerms(siteName)

  if (terms.some((term) => spec.includes(term.toLowerCase()))) {
    return true
  }

  if (siteId && guide.sites?.length) {
    return guide.sites.some((site) => {
      const id = typeof site === "string" ? site : site._id
      return id === siteId
    })
  }

  return false
}
