import CustomerModule from "@medusajs/customer"
import ReviewModule from "../modules/review"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
  CustomerModule.linkable.customer,
  ReviewModule.linkable.review
)
