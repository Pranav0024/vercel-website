import type { PublicProduct } from "./catalogue-types";

export const productUrl = (product: Pick<PublicProduct, "id">) => `/shop/${encodeURIComponent(product.id)}`;
export function formatPrice(value: string) {
  const amount = value.trim();
  if (/^\d[\d,]*(?:\.\d+)?$/.test(amount)) return "₹" + Number(amount.replaceAll(",", "")).toLocaleString("en-IN", { maximumFractionDigits: 20 });
  return amount || "Price on enquiry";
}
export function displayPrice(product: PublicProduct) {
  const variations = product.variations ?? [];
  const prices = [...new Set(variations.map(v => v.price.trim() || product.price.trim()))];
  if (prices.length > 1) {
    const amounts = prices.map(value => /^₹?\s*([\d,]+(?:\.\d+)?)$/.exec(value));
    if (amounts.every(Boolean)) {
      const numbers = amounts.map(value => Number(value![1].replaceAll(",", "")));
      return `₹${Math.min(...numbers).toLocaleString("en-IN")} – ₹${Math.max(...numbers).toLocaleString("en-IN")}`;
    }
    return `${prices.find(Boolean) || "Price on enquiry"} · varies by option`;
  }
  return formatPrice(prices[0] || product.price);
}
