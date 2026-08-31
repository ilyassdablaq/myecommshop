import { Suspense } from "react"

import { listCategories } from "@lib/data/categories"
import { listProductTags } from "@lib/data/product-tags"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"

const StoreTemplate = async ({
  sortBy,
  page,
  countryCode,
  categoryId,
  tagId,
  priceMin,
  priceMax,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
  categoryId?: string
  tagId?: string
  priceMin?: string
  priceMax?: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const sort = sortBy || "created_at"

  const [categories, tags] = await Promise.all([
    listCategories({ limit: 50 }),
    listProductTags(),
  ])

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      <RefinementList
        sortBy={sort}
        categories={(categories ?? []).map((c: any) => ({
          id: c.id,
          name: c.name,
        }))}
        tags={(tags ?? []).map((t) => ({ id: t.id, value: t.value }))}
      />
      <div className="w-full">
        <div className="mb-8 text-2xl-semi">
          <h1 data-testid="store-page-title">Alle Produkte</h1>
        </div>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sort}
            page={pageNumber}
            countryCode={countryCode}
            categoryIds={categoryId ? categoryId.split(",") : undefined}
            materialTagIds={tagId ? tagId.split(",") : undefined}
            priceMin={priceMin ? Number(priceMin) : undefined}
            priceMax={priceMax ? Number(priceMax) : undefined}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
