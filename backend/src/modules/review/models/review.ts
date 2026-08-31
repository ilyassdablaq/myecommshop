import { model } from "@medusajs/framework/utils"

const Review = model.define("review", {
  id: model.id().primaryKey(),
  product_id: model.text(),
  customer_id: model.text(),
  customer_name: model.text(),
  rating: model.number(),
  title: model.text().nullable(),
  content: model.text(),
  status: model
    .enum(["pending", "approved", "rejected"])
    .default("pending"),
  verified_purchase: model.boolean().default(false),
  moderated_by: model.text().nullable(),
  moderated_at: model.dateTime().nullable(),
})

export default Review
