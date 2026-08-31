import { HttpTypes } from "@medusajs/types"

export type PriceRange = {
  min?: number
  max?: number
}

/**
 * Client-side price filter, applied on top of the already-fetched (max 100)
 * product batch — Medusa has no server-side price-range query param since
 * prices are computed dynamically. Mirrors the existing sortProducts() limitation.
 */
export function filterProductsByPrice(
  products: HttpTypes.StoreProduct[],
  priceRange?: PriceRange
): HttpTypes.StoreProduct[] {
  if (!priceRange || (priceRange.min === undefined && priceRange.max === undefined)) {
    return products
  }

  return products.filter((product) => {
    const prices = (product.variants ?? [])
      .map((variant) => variant?.calculated_price?.calculated_amount)
      .filter((amount): amount is number => typeof amount === "number")

    if (prices.length === 0) {
      return false
    }

    const minPrice = Math.min(...prices)

    if (priceRange.min !== undefined && minPrice < priceRange.min) {
      return false
    }

    if (priceRange.max !== undefined && minPrice > priceRange.max) {
      return false
    }

    return true
  })
}
