import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { REVIEW_MODULE } from "../modules/review"
import ReviewModuleService from "../modules/review/service"

export default async function productDeletedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const reviewModuleService: ReviewModuleService =
    container.resolve(REVIEW_MODULE)

  const reviews = await reviewModuleService.listReviews({
    product_id: data.id,
  })

  if (reviews.length > 0) {
    await reviewModuleService.deleteReviews(reviews.map((review) => review.id))
  }
}

export const config: SubscriberConfig = {
  event: "product.deleted",
}
