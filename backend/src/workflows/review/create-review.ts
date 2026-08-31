import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import { REVIEW_MODULE } from "../../modules/review"
import ReviewModuleService from "../../modules/review/service"

type CreateReviewStepInput = {
  product_id: string
  customer_id: string
  customer_name: string
  rating: number
  title?: string
  content: string
}

const validateProductExistsStep = createStep(
  "validate-product-exists",
  async (input: CreateReviewStepInput, { container }) => {
    const productModuleService = container.resolve(Modules.PRODUCT)
    await productModuleService.retrieveProduct(input.product_id)
  }
)

const assertNoDuplicateReviewStep = createStep(
  "assert-no-duplicate-review",
  async (input: CreateReviewStepInput, { container }) => {
    const reviewModuleService: ReviewModuleService =
      container.resolve(REVIEW_MODULE)

    const existing = await reviewModuleService.listReviews({
      product_id: input.product_id,
      customer_id: input.customer_id,
    })

    if (existing.length > 0) {
      throw new MedusaError(
        MedusaError.Types.CONFLICT,
        "Du hast dieses Produkt bereits bewertet."
      )
    }
  }
)

const createReviewStep = createStep(
  "create-review",
  async (input: CreateReviewStepInput, { container }) => {
    if (
      !Number.isInteger(input.rating) ||
      input.rating < 1 ||
      input.rating > 5
    ) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Die Bewertung muss zwischen 1 und 5 Sternen liegen."
      )
    }

    const reviewModuleService: ReviewModuleService =
      container.resolve(REVIEW_MODULE)

    const review = await reviewModuleService.createReviews({
      ...input,
      status: "pending",
    })

    return new StepResponse(review, review.id)
  },
  async (reviewId: string | undefined, { container }) => {
    if (!reviewId) {
      return
    }

    const reviewModuleService: ReviewModuleService =
      container.resolve(REVIEW_MODULE)

    await reviewModuleService.deleteReviews([reviewId])
  }
)

const createReviewWorkflow = createWorkflow(
  "create-review",
  (input: CreateReviewStepInput) => {
    validateProductExistsStep(input)
    assertNoDuplicateReviewStep(input)
    const review = createReviewStep(input)

    return new WorkflowResponse(review)
  }
)

export default createReviewWorkflow
