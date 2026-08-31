import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { Modules } from "@medusajs/framework/utils"
import { REVIEW_MODULE } from "../../../modules/review"
import ReviewModuleService from "../../../modules/review/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const status = (req.query.status as string) || "pending"
  const productId = req.query.product_id as string | undefined
  const limit = Number(req.query.limit) || 20
  const offset = Number(req.query.offset) || 0

  const reviewModuleService: ReviewModuleService = req.scope.resolve(
    REVIEW_MODULE
  )

  const filters: Record<string, any> = {}
  if (status !== "all") {
    filters.status = status
  }
  if (productId) {
    filters.product_id = productId
  }

  const [reviews, count] = await reviewModuleService.listAndCountReviews(
    filters,
    { order: { created_at: "DESC" }, take: limit, skip: offset }
  )

  const productModuleService = req.scope.resolve(Modules.PRODUCT)
  const productIds = [...new Set(reviews.map((review) => review.product_id))]
  const products = productIds.length
    ? await productModuleService.listProducts(
        { id: productIds },
        { select: ["id", "title"] }
      )
    : []
  const productTitleById = new Map(
    products.map((product) => [product.id, product.title])
  )

  res.json({
    reviews: reviews.map((review) => ({
      ...review,
      product_title: productTitleById.get(review.product_id) ?? null,
    })),
    count,
    limit,
    offset,
  })
}
