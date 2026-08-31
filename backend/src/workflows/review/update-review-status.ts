import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { REVIEW_MODULE } from "../../modules/review"
import ReviewModuleService from "../../modules/review/service"

type UpdateReviewStatusInput = {
  id: string
  status: "approved" | "rejected"
  moderated_by: string
}

const updateReviewStatusStep = createStep(
  "update-review-status",
  async (input: UpdateReviewStatusInput, { container }) => {
    const reviewModuleService: ReviewModuleService =
      container.resolve(REVIEW_MODULE)

    const previousReview = await reviewModuleService.retrieveReview(input.id)

    const review = await reviewModuleService.updateReviews({
      id: input.id,
      status: input.status,
      moderated_by: input.moderated_by,
      moderated_at: new Date(),
    })

    return new StepResponse(review, previousReview)
  },
  async (previousReview, { container }) => {
    if (!previousReview) {
      return
    }

    const reviewModuleService: ReviewModuleService =
      container.resolve(REVIEW_MODULE)

    await reviewModuleService.updateReviews({
      id: previousReview.id,
      status: previousReview.status,
      moderated_by: previousReview.moderated_by,
      moderated_at: previousReview.moderated_at,
    })
  }
)

const updateReviewStatusWorkflow = createWorkflow(
  "update-review-status",
  (input: UpdateReviewStatusInput) => {
    const review = updateReviewStatusStep(input)
    return new WorkflowResponse(review)
  }
)

export default updateReviewStatusWorkflow
