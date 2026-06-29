import type { City } from "@/lib/api/cities"
import type { HeritageSite } from "@/lib/api/heritageSites"

const CITY_ALIASES: Record<string, string[]> = {
  Delhi: ["Delhi", "New Delhi"],
  "New Delhi": ["Delhi", "New Delhi"],
}

export function getCityNameVariants(cityName: string): string[] {
  const aliases = CITY_ALIASES[cityName]
  if (aliases) return [...new Set(aliases)]
  return [cityName]
}

export function cityMatchesHeritageCity(cityName: string, heritageCity: string): boolean {
  const cityVariants = getCityNameVariants(cityName)
  const heritageVariants = getCityNameVariants(heritageCity)
  return cityVariants.some((v) => heritageVariants.includes(v))
}

export function getHeritageCitiesFromSites(sites: HeritageSite[]): string[] {
  return [...new Set(sites.map((s) => s.city).filter(Boolean) as string[])]
}

export function filterCitiesWithHeritage(cities: City[], heritageSites: HeritageSite[]): City[] {
  const heritageCities = getHeritageCitiesFromSites(heritageSites)
  if (heritageCities.length === 0) return cities
  return cities.filter((c) => heritageCities.some((hc) => cityMatchesHeritageCity(c.name, hc)))
}

export function getSiteIdsForCity(
  cityId: string,
  cities: City[],
  heritageSites: HeritageSite[]
): string[] {
  const city = cities.find((c) => c._id === cityId)
  if (!city) return []
  return heritageSites
    .filter((s) => s.city && cityMatchesHeritageCity(city.name, s.city))
    .map((s) => s._id)
}

export function getSiteNamesForCity(
  cityId: string,
  cities: City[],
  heritageSites: HeritageSite[]
): string[] {
  const city = cities.find((c) => c._id === cityId)
  if (!city) return []
  return heritageSites
    .filter((s) => s.city && cityMatchesHeritageCity(city.name, s.city))
    .map((s) => s.name)
    .filter(Boolean)
}

type SiteRef = string | { _id: string }

export function matchesAnySite(sites: SiteRef[] | undefined, siteIds: string[]): boolean {
  if (!sites?.length || !siteIds.length) return false
  const idSet = new Set(siteIds)
  return sites.some((site) => idSet.has(typeof site === "string" ? site : site._id))
}

export function filterByCitySites<T extends { sites?: SiteRef[] }>(
  items: T[],
  cityId: string | null,
  cities: City[],
  heritageSites: HeritageSite[]
): T[] {
  if (!cityId) return items
  const siteIds = getSiteIdsForCity(cityId, cities, heritageSites)
  if (siteIds.length === 0) return []
  return items.filter((item) => matchesAnySite(item.sites, siteIds))
}

function specializationMatchesSiteNames(specialization: string, siteNames: string[]): boolean {
  const normalized = specialization.toLowerCase()
  return siteNames.some((name) => normalized.includes(name.toLowerCase()))
}

export function filterGuidesByCity<T extends { sites?: SiteRef[]; specialization?: string }>(
  guides: T[],
  cityId: string | null,
  cities: City[],
  heritageSites: HeritageSite[]
): T[] {
  if (!cityId) return guides

  const siteIds = getSiteIdsForCity(cityId, cities, heritageSites)
  const siteNames = getSiteNamesForCity(cityId, cities, heritageSites)
  if (siteIds.length === 0 && siteNames.length === 0) return []

  return guides.filter((guide) => {
    if (matchesAnySite(guide.sites, siteIds)) return true
    if (guide.specialization && siteNames.length > 0) {
      return specializationMatchesSiteNames(guide.specialization, siteNames)
    }
    return false
  })
}
