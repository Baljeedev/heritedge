export const INR_SYMBOL = "₹"

/** Format amount in Indian Rupees (no decimals for whole rupee amounts). */
export function formatINR(amount: number): string {
  return `${INR_SYMBOL}${amount.toLocaleString("en-IN")}`
}
