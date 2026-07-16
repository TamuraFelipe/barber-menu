import { addHours, isPast } from "date-fns"

export const compareDateTime = (date: Date) => {
  const endDate = addHours(date, 1)

  return isPast(endDate)
}
