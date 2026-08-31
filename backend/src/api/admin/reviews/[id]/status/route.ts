import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import updateReviewStatusWorkflow from "../../../../../workflows/review/update-review-status"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params
  const body = (req.body ?? {}) as { status?: string }

  if (body.status !== "approved" && body.status !== "rejected") {
    res
      .status(400)
      .json({ message: "status must be 'approved' or 'rejected'" })
    return
  }

  const moderatedBy = req.auth_context?.actor_id ?? "admin"

  const { result: review } = await updateReviewStatusWorkflow(req.scope).run({
    input: {
      id,
      status: body.status,
      moderated_by: moderatedBy,
    },
  })

  res.json({ review })
}
