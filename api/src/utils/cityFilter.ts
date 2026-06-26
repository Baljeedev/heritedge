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

/** Resolve a City document id to heritage site ids in that city */
export async function resolveCityToSiteIds(
  cityId: string
): Promise<mongoose.Types.ObjectId[]> {
  const city = await City.findById(cityId);
  if (!city) return [];

  const variants = getCityNameVariants(city.name);
  return HeritageSite.find({ city: { $in: variants } }).distinct("_id");
}

/** Check if a City record corresponds to a heritage site city name */
export function cityMatchesHeritageCity(city: { name: string }, heritageCity: string): boolean {
  const variants = getCityNameVariants(city.name);
  const heritageVariants = getCityNameVariants(heritageCity);
  return variants.some((v) => heritageVariants.includes(v));
}
