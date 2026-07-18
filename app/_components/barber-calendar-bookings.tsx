"use client"

import { format } from "date-fns"
import { useRouter, useSearchParams } from "next/navigation"
import { Calendar } from "./ui/calendar"

export function BarberCalendarBookings({
  selectedDate,
}: {
  selectedDate: Date
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function onSelect(date?: Date) {
    if (!date) return

    const params = new URLSearchParams(searchParams)

    params.set("date", format(date, "yyyy-MM-dd"))

    router.push(`?${params.toString()}`)
  }

  return (
    <Calendar
      className="w-full"
      mode="single"
      selected={selectedDate}
      onSelect={onSelect}
    />
  )
}
