import { Text } from "@medusajs/ui"
import { StoreReview } from "@lib/data/reviews"
import StarRating from "./star-rating"

const ReviewCard = ({ review }: { review: StoreReview }) => {
  const date = new Date(review.created_at).toLocaleDateString("de-DE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <div className="border-b border-ui-border-base py-6 last:border-none">
      <div className="flex items-center justify-between gap-x-4">
        <StarRating rating={review.rating} />
        <Text className="text-small-regular text-grey-50">{date}</Text>
      </div>
      {review.title && (
        <Text className="text-base-semi mt-2 text-grey-90">
          {review.title}
        </Text>
      )}
      <Text className="text-base-regular mt-2 text-grey-70">
        {review.content}
      </Text>
      <Text className="text-small-regular mt-2 text-grey-50">
        {review.customer_name}
      </Text>
    </div>
  )
}

export default ReviewCard
