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

/** True when query matches the start of any specialization segment (e.g. "ta" → "Taj Mahal"). */
export function specializationStartsWith(specialization: string, query: string): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const items = parseSpecializationItems(specialization)
  if (items.length > 0) {
    return items.some((item) => item.toLowerCase().startsWith(q))
  }
  return specialization.trim().toLowerCase().startsWith(q)
}

export function guideMatchesSpecialization(guide: { specialization: string }, query: string): boolean {
  return specializationStartsWith(guide.specialization, query)
}

/** Unique specialization labels from guides matching a search query. */
export function getSpecializationSuggestions(
  guides: Array<{ specialization: string }>,
  query: string,
  limit = 8
): string[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const items = new Set<string>()
  for (const guide of guides) {
    for (const item of parseSpecializationItems(guide.specialization)) {
      if (item.toLowerCase().includes(q)) items.add(item)
    }
    if (guide.specialization.toLowerCase().includes(q)) {
      items.add(guide.specialization)
    }
  }
  return Array.from(items).slice(0, limit)
}

export function guideMatchesMonument(
  guide: {
    specialization: string
    sites?: Array<string | { _id: string }>
  },
  siteId: string | null,
  siteName: string
): boolean {
  if (siteId && guide.sites?.length) {
    const hasSiteId = guide.sites.some((site) => {
      const id = typeof site === "string" ? site : site._id
      return id === siteId
    })
    if (hasSiteId) return true
  }

  const spec = guide.specialization.toLowerCase()
  const terms = getMonumentSearchTerms(siteName)
  return terms.some((term) => spec.includes(term.toLowerCase()))
}
