export type BarbershopWithReviews = {
  review?: Array<{ rating: number }>
}

export const barbershopRating = <T extends BarbershopWithReviews>(
  barber: T,
) => {
  const reviews = barber.review ?? []
  const totalReviews = reviews.length

  const sumRatings = reviews.reduce((acc, rev) => acc + rev.rating, 0)

  const averageRating =
    totalReviews > 0 ? (sumRatings / totalReviews).toFixed(1) : "0.0"

  return {
    ...barber,
    averageRating: Number(averageRating),
    totalReviews,
  }
}
