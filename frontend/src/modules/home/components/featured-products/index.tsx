import { HttpTypes } from "@medusajs/types"
import ProductRail from "@modules/home/components/featured-products/product-rail"

export default async function FeaturedProducts({
  collections,
  region,
}: {
  collections: HttpTypes.StoreCollection[]
  region: HttpTypes.StoreRegion
}) {
  // Nur die erste Collection mit Produkten anzeigen
  const firstCollectionWithProducts = collections.find(
    (c) => c.products && c.products.length > 0
  )

  if (!firstCollectionWithProducts) {
    return null
  }

  return (
    <li>
      <ProductRail collection={firstCollectionWithProducts} region={region} />
    </li>
  )
}
