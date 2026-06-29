import mongoose from "mongoose";
import City from "../models/City";
import HeritageSite from "../models/HeritageSite";

const CITY_ALIASES: Record<string, string[]> = {
  Delhi: ["Delhi", "New Delhi"],
  "New Delhi": ["Delhi", "New Delhi"],
};

/** Heritage site city strings that map to the same filter bucket */
export function getCityNameVariants(cityName: string): string[] {
  const aliases = CITY_ALIASES[cityName];
  if (aliases) return [...new Set(aliases)];
  return [cityName];
}

export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Resolve a City document id to heritage site ids and names in that city */
export async function resolveCityToSiteInfo(cityId: string): Promise<{
  siteIds: mongoose.Types.ObjectId[];
  siteNames: string[];
}> {
  const city = await City.findById(cityId);
  if (!city) return { siteIds: [], siteNames: [] };

  const variants = getCityNameVariants(city.name);
  const sites = await HeritageSite.find({ city: { $in: variants } })
    .select("name")
    .lean();

  return {
    siteIds: sites.map((site) => site._id as mongoose.Types.ObjectId),
    siteNames: sites.map((site) => site.name).filter(Boolean),
  };
}

/** Resolve a City document id to heritage site ids in that city */
export async function resolveCityToSiteIds(
  cityId: string
): Promise<mongoose.Types.ObjectId[]> {
  const { siteIds } = await resolveCityToSiteInfo(cityId);
  return siteIds;
}

/** Check if a City record corresponds to a heritage site city name */
export function cityMatchesHeritageCity(city: { name: string }, heritageCity: string): boolean {
  const variants = getCityNameVariants(city.name);
  const heritageVariants = getCityNameVariants(heritageCity);
  return variants.some((v) => heritageVariants.includes(v));
}
