import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getCategoryByHandle, listCategories } from "@lib/data/categories"
import { listRegions } from "@lib/data/regions"
import { normalizeHandle } from "@lib/util/normalize-handle"
import { StoreRegion } from "@medusajs/types"
import CategoryTemplate from "@modules/categories/templates"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

type Props = {
  params: Promise<{ category: string[]; countryCode: string }>
  searchParams: Promise<{
    sortBy?: SortOptions
    page?: string
  }>
}

export async function generateStaticParams() {
  const product_categories = await listCategories()

  if (!product_categories) {
    return []
  }

  const countryCodes = await listRegions().then((regions: StoreRegion[]) =>
    regions?.map((r) => r.countries?.map((c) => c.iso_2)).flat()
  )

  const categoryHandles = product_categories.map(
    (category: any) => category.handle
  )

  const staticParams = countryCodes
    ?.map((countryCode: string | undefined) =>
      categoryHandles.map((handle: any) => ({
        countryCode,
        category: [handle],
      }))
    )
    .flat()

  return staticParams
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  try {
    // Hole alle Kategorien und finde die richtige basierend auf dem normalisierten Namen
    const allCategories = await listCategories()
    const urlHandle = params.category.join("/").toLowerCase()
    
    // Finde die Kategorie, deren normalisierter Name dem URL-Handle entspricht
    const matchedCategory = allCategories?.find(
      (c: any) => normalizeHandle(c.name) === urlHandle
    )

    if (!matchedCategory) {
      notFound()
    }

    const title = matchedCategory.name + " | DAB ZONE"
    const description = matchedCategory.description ?? `${title} category.`

    return {
      title: `${title} | DAB ZONE`,
      description,
      alternates: {
        canonical: `${urlHandle}`,
      },
    }
  } catch (error) {
    notFound()
  }
}

export default async function CategoryPage(props: Props) {
  const searchParams = await props.searchParams
  const params = await props.params
  const { sortBy, page } = searchParams

  // Hole alle Kategorien und finde die richtige basierend auf dem normalisierten Namen
  const allCategories = await listCategories()
  const urlHandle = params.category.join("/").toLowerCase()
  
  // Finde die Kategorie, deren normalisierter Name dem URL-Handle entspricht
  const productCategory = allCategories?.find(
    (c: any) => normalizeHandle(c.name) === urlHandle
  )

  if (!productCategory) {
    notFound()
  }

  return (
    <CategoryTemplate
      category={productCategory}
      sortBy={sortBy}
      page={page}
      countryCode={params.countryCode}
    />
  )
}
