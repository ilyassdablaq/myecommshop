import { Heading, Text } from "@medusajs/ui"

import { retrieveCustomer } from "@lib/data/customer"
import { getProductReviews } from "@lib/data/reviews"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ReviewForm from "./review-form"
import ReviewList from "./review-list"
import StarRating from "./star-rating"

const ProductReviews = async ({ productId }: { productId: string }) => {
  const [{ reviews, count, average_rating }, customer] = await Promise.all([
    getProductReviews({ productId, limit: 20 }),
    retrieveCustomer(),
  ])

  return (
    <div className="content-container py-16 small:py-24 border-t border-ui-border-base">
      <div className="flex flex-col small:flex-row small:items-start gap-x-16 gap-y-8">
        <div className="small:max-w-[300px] w-full flex flex-col gap-y-4">
          <Heading level="h2" className="font-heading text-2xl-semi">
            Bewertungen
          </Heading>
          {count > 0 ? (
            <div className="flex items-center gap-x-2">
              <StarRating rating={average_rating} className="text-xl" />
              <Text className="text-base-regular text-grey-60">
                {average_rating.toFixed(1)} von 5 ({count}{" "}
                {count === 1 ? "Bewertung" : "Bewertungen"})
              </Text>
            </div>
          ) : (
            <Text className="text-base-regular text-grey-60">
              Noch keine Bewertungen.
            </Text>
          )}

          {customer ? (
            <ReviewForm productId={productId} />
          ) : (
            <Text className="text-base-regular text-grey-60">
              <LocalizedClientLink
                href="/account"
                className="text-brand-700 underline"
              >
                Melde dich an
              </LocalizedClientLink>
              , um eine Bewertung abzugeben.
            </Text>
          )}
        </div>

        <div className="w-full">
          <ReviewList reviews={reviews} />
        </div>
      </div>
    </div>
  )
}

export default ProductReviews
