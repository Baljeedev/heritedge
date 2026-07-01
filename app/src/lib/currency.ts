export const INR_SYMBOL = "₹"

/** Format amount in Indian Rupees (no decimals for whole rupee amounts). */
export function formatINR(amount: number): string {
  return `${INR_SYMBOL}${amount.toLocaleString("en-IN")}`
}

/** Guide price filter thresholds (per day, INR). */
export const GUIDE_PRICE_FILTERS = {
  budgetMax: 5000,
  midMin: 5000,
  midMax: 10000,
  premiumMin: 10000,
} as const
