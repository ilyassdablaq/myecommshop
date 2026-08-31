import { Text } from "@medusajs/ui"
import { StoreReview } from "@lib/data/reviews"
import ReviewCard from "./review-card"

const ReviewList = ({ reviews }: { reviews: StoreReview[] }) => {
  if (reviews.length === 0) {
    return (
      <Text className="text-base-regular text-grey-50 py-6">
        Noch keine Bewertungen für dieses Produkt. Sei die/der Erste!
      </Text>
    )
  }

  return (
    <div>
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  )
}

export default ReviewList
