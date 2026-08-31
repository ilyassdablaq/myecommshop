import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { REVIEW_MODULE } from "../../../../modules/review"
import ReviewModuleService from "../../../../modules/review/service"

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params

  const reviewModuleService: ReviewModuleService = req.scope.resolve(
    REVIEW_MODULE
  )

  await reviewModuleService.deleteReviews([id])

  res.status(200).json({ id, object: "review", deleted: true })
}
