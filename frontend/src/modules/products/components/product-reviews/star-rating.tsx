const StarRating = ({
  rating,
  className,
}: {
  rating: number
  className?: string
}) => {
  const rounded = Math.round(rating)

  return (
    <span
      className={`text-brand-600 tracking-tight ${className ?? ""}`}
      aria-label={`${rating} von 5 Sternen`}
    >
      {"★".repeat(rounded)}
      <span className="text-grey-30">{"★".repeat(5 - rounded)}</span>
    </span>
  )
}

export default StarRating
