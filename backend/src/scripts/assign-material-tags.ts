import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

/**
 * One-off backfill: turns each product's plain `material` string field into
 * a Product Tag, so the storefront material filter (which filters via the
 * natively supported `tag_id` param) has something to filter on.
 * Run with: npx medusa exec ./src/scripts/assign-material-tags.ts
 */
export default async function assignMaterialTags({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productModuleService = container.resolve(Modules.PRODUCT)

  const products = await productModuleService.listProducts(
    {},
    { select: ["id", "material"], relations: ["tags"] }
  )

  const productsWithMaterial = products.filter(
    (product) => !!product.material?.trim()
  )

  if (productsWithMaterial.length === 0) {
    logger.info(
      "assign-material-tags: no products with a material set - nothing to backfill."
    )
    return
  }

  const existingTags = await productModuleService.listProductTags({})
  const tagByValue = new Map(
    existingTags.map((tag) => [tag.value.toLowerCase(), tag])
  )

  let createdTags = 0
  let linkedProducts = 0

  for (const product of productsWithMaterial) {
    const materialValue = product.material!.trim()
    const key = materialValue.toLowerCase()

    let tag = tagByValue.get(key)
    if (!tag) {
      tag = await productModuleService.createProductTags({
        value: materialValue,
      })
      tagByValue.set(key, tag)
      createdTags++
    }

    const currentTags = product.tags ?? []
    const alreadyTagged = currentTags.some(
      (existing: any) => existing.id === tag!.id
    )

    if (alreadyTagged) {
      continue
    }

    await productModuleService.updateProducts(product.id, {
      tags: [
        ...currentTags.map((existing: any) => ({ id: existing.id })),
        { id: tag.id },
      ],
    })
    linkedProducts++
  }

  logger.info(
    `assign-material-tags: ${createdTags} tag(s) created, ${linkedProducts} product(s) linked.`
  )
}
