import { startOfDay, subDays } from "date-fns"

export const filterRecentBookings = <T extends { date: Date | string }>(
  bookings: T[],
): T[] => {
  const yesterdayStart = startOfDay(subDays(new Date(), 1))

  return bookings.filter((booking) => new Date(booking.date) >= yesterdayStart)
}
