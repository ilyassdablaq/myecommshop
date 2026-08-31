import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { REVIEW_MODULE } from "../../../../../modules/review"
import ReviewModuleService from "../../../../../modules/review/service"
import createReviewWorkflow from "../../../../../workflows/review/create-review"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const limit = Number(req.query.limit) || 10
  const offset = Number(req.query.offset) || 0

  const reviewModuleService: ReviewModuleService = req.scope.resolve(
    REVIEW_MODULE
  )

  const [reviews, count] = await reviewModuleService.listAndCountReviews(
    { product_id: id, status: "approved" },
    { order: { created_at: "DESC" }, take: limit, skip: offset }
  )

  const allApproved = await reviewModuleService.listReviews({
    product_id: id,
    status: "approved",
  })

  const ratingCount = allApproved.length
  const averageRating =
    ratingCount > 0
      ? allApproved.reduce((sum, review) => sum + review.rating, 0) /
        ratingCount
      : 0

  const ratingCounts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  for (const review of allApproved) {
    ratingCounts[review.rating] = (ratingCounts[review.rating] ?? 0) + 1
  }

  res.json({
    reviews,
    count,
    average_rating: Math.round(averageRating * 10) / 10,
    rating_counts: ratingCounts,
    limit,
    offset,
  })
}

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const body = (req.body ?? {}) as {
    rating?: number
    title?: string
    content?: string
  }

  const customerId = req.auth_context?.actor_id

  if (!customerId) {
    res
      .status(401)
      .json({ message: "Bitte melde dich an, um eine Bewertung abzugeben." })
    return
  }

  const rating = Number(body.rating)
  const content = (body.content ?? "").trim()
  const title = body.title?.trim() || undefined

  if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
    res
      .status(400)
      .json({ message: "Die Bewertung muss zwischen 1 und 5 Sternen liegen." })
    return
  }

  if (content.length < 10 || content.length > 2000) {
    res.status(400).json({
      message: "Der Bewertungstext muss zwischen 10 und 2000 Zeichen lang sein.",
    })
    return
  }

  if (title && title.length > 120) {
    res
      .status(400)
      .json({ message: "Der Titel darf höchstens 120 Zeichen lang sein." })
    return
  }

  const customerModuleService = req.scope.resolve(Modules.CUSTOMER)
  const customer = await customerModuleService.retrieveCustomer(customerId)
  const customerName =
    [customer.first_name, customer.last_name].filter(Boolean).join(" ") ||
    customer.email

  try {
    const { result: review } = await createReviewWorkflow(req.scope).run({
      input: {
        product_id: id,
        customer_id: customerId,
        customer_name: customerName,
        rating,
        title,
        content,
      },
    })

    res.status(201).json({
      review,
      message:
        "Danke für deine Bewertung! Sie wird nach Prüfung veröffentlicht.",
    })
  } catch (error: any) {
    if (error?.type === MedusaError.Types.CONFLICT) {
      res.status(409).json({ message: error.message })
      return
    }
    if (error?.type === MedusaError.Types.NOT_FOUND) {
      res.status(404).json({ message: error.message })
      return
    }
    throw error
  }
}
