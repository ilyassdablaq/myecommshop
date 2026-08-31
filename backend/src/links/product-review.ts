import ProductModule from "@medusajs/product"
import ReviewModule from "../modules/review"
import { defineLink } from "@medusajs/framework/utils"

export default defineLink(
  ProductModule.linkable.product,
  ReviewModule.linkable.review
)
