"use client"

import { addToCart } from "@lib/data/cart"
import { useIntersection } from "@lib/hooks/use-in-view"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import Divider from "@modules/common/components/divider"
import OptionSelect from "@modules/products/components/product-actions/option-select"
import { isEqual } from "lodash"
import { useParams, usePathname, useSearchParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import ProductPrice from "../product-price"
import MobileActions from "./mobile-actions"

type ProductActionsProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  disabled?: boolean
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductActions({
  product,
  disabled,
}: ProductActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const countryCode = useParams().countryCode as string

  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [quantity, setQuantity] = useState<number>(1)
  const [isAdding, setIsAdding] = useState(false)

  // ⭐ Auto-select ONLY if no option has been chosen yet
  useEffect(() => {
    const variants = product.variants ?? []

    // Nur beim ersten Laden ausführen
    if (variants.length > 0 && Object.keys(options).length === 0) {
      const firstVariant = variants[0]
      const variantOptions = optionsAsKeymap(firstVariant.options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  // ⭐ Determine selected variant based on chosen options
  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return undefined

    return (
      product.variants.find((v) => {
        const variantOptions = optionsAsKeymap(v.options)
        return isEqual(variantOptions, options)
      }) || undefined
    )
  }, [product.variants, options])

  // ⭐ Check if variant is valid
  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  // Update URL ONLY on first auto-selection, not after user changes options
  // Wenn der Kunde bereits etwas ausgewählt hat → NICHT überschreiben
   useEffect(() => {
  if (Object.keys(options).length > 0 && selectedVariant) {
    return
  }

  const params = new URLSearchParams(searchParams.toString())
  const value = isValidVariant ? selectedVariant?.id : null

  if (params.get("v_id") === value) return

  if (value) params.set("v_id", value)
  else params.delete("v_id")

  router.replace(pathname + "?" + params.toString())
}, [selectedVariant])
  

  // ⭐ Customer manually selects an option → DO NOT override
  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  // ⭐ Stock logic simplified
  const inStock = useMemo(() => {
    if (!selectedVariant) return false
    if (!selectedVariant.manage_inventory) return true
    if (selectedVariant.allow_backorder) return true
    if ((selectedVariant.inventory_quantity || 0) > 0) return true
    return false
  }, [selectedVariant])

  const actionsRef = useRef<HTMLDivElement>(null)
  const inView = useIntersection(actionsRef, "0px")

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return null

    setIsAdding(true)

    await addToCart({
      variantId: selectedVariant.id,
      quantity: quantity,
      countryCode,
    })

    setIsAdding(false)
    setQuantity(1)
  }

  return (
    <>
      <div className="flex flex-col gap-y-2" ref={actionsRef}>
        <div>
          {(product.variants?.length ?? 0) > 1 && (
            <div className="flex flex-col gap-y-4">
              {(product.options || []).map((option) => (
                <div key={option.id}>
                  <OptionSelect
                    option={option}
                    current={options[option.id]}
                    updateOption={setOptionValue}
                    title={option.title ?? ""}
                    data-testid="product-options"
                    disabled={!!disabled || isAdding}
                  />
                </div>
              ))}
              <Divider />
            </div>
          )}
        </div>

        <ProductPrice product={product} variant={selectedVariant} />

        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <label className="text-sm font-medium text-ui-fg-base mb-2 block">
              Menge
            </label>
            <div className="flex items-center border border-ui-border-base rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1 || isAdding || !!disabled}
                className="px-3 py-2 text-ui-fg-muted hover:text-ui-fg-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                −
              </button>
              <input
                type="number"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1
                  setQuantity(Math.max(1, val))
                }}
                min="1"
                disabled={isAdding || !!disabled}
                className="flex-1 text-center py-2 border-l border-r border-ui-border-base outline-none disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <button
                onClick={() => setQuantity(quantity + 1)}
                disabled={isAdding || !!disabled}
                className="px-3 py-2 text-ui-fg-muted hover:text-ui-fg-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
          </div>
        </div>

        <Button
          onClick={handleAddToCart}
          disabled={
            !inStock ||
            !selectedVariant ||
            !!disabled ||
            isAdding ||
            !isValidVariant
          }
          variant="primary"
          className="w-full h-10"
          isLoading={isAdding}
          data-testid="add-product-button"
        >
          {!selectedVariant
            ? "Add to cart"
            : !inStock || !isValidVariant
            ? "Out of stock"
            : "Add to cart"}
        </Button>

        <MobileActions
          product={product}
          variant={selectedVariant}
          options={options}
          updateOptions={setOptionValue}
          inStock={inStock}
          handleAddToCart={handleAddToCart}
          isAdding={isAdding}
          show={!inView}
          optionsDisabled={!!disabled || isAdding}
        />
      </div>
    </>
  )
}