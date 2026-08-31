"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"

import SortProducts, { SortOptions } from "./sort-products"
import CategoryFilter from "./category-filter"
import MaterialFilter from "./material-filter"
import PriceFilter from "./price-filter"

type RefinementListProps = {
  sortBy: SortOptions
  search?: boolean
  categories?: { id: string; name: string }[]
  tags?: { id: string; value: string }[]
  "data-testid"?: string
}

const RefinementList = ({
  sortBy,
  categories,
  tags,
  "data-testid": dataTestId,
}: RefinementListProps) => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const setQueryParams = (name: string, value: string) => {
    const query = createQueryString(name, value)
    router.push(`${pathname}?${query}`)
  }

  const setOrDeleteParam = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set(name, value)
    } else {
      params.delete(name)
    }
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`)
  }

  const toggleListParam = (name: string, value: string) => {
    const current = searchParams.get(name)?.split(",").filter(Boolean) ?? []
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value]

    const params = new URLSearchParams(searchParams)
    if (next.length > 0) {
      params.set(name, next.join(","))
    } else {
      params.delete(name)
    }
    params.delete("page")

    router.push(`${pathname}?${params.toString()}`)
  }

  const selectedCategoryIds =
    searchParams.get("category_id")?.split(",").filter(Boolean) ?? []
  const selectedTagIds =
    searchParams.get("tag_id")?.split(",").filter(Boolean) ?? []

  return (
    <div className="flex small:flex-col gap-y-8 gap-x-12 flex-wrap py-4 mb-8 small:px-0 pl-6 small:min-w-[250px] small:ml-[1.675rem]">
      <SortProducts
        sortBy={sortBy}
        setQueryParams={setQueryParams}
        data-testid={dataTestId}
      />
      {categories && categories.length > 0 && (
        <CategoryFilter
          categories={categories}
          selectedIds={selectedCategoryIds}
          toggle={(id) => toggleListParam("category_id", id)}
        />
      )}
      {tags && tags.length > 0 && (
        <MaterialFilter
          tags={tags}
          selectedIds={selectedTagIds}
          toggle={(id) => toggleListParam("tag_id", id)}
        />
      )}
      <PriceFilter
        min={searchParams.get("price_min") ?? ""}
        max={searchParams.get("price_max") ?? ""}
        setMin={(value) => setOrDeleteParam("price_min", value)}
        setMax={(value) => setOrDeleteParam("price_max", value)}
      />
    </div>
  )
}

export default RefinementList
