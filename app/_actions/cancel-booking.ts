"use server"

import { refresh, revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"
import { BookingStatus } from "@prisma/client"

export type DeleteBookingProps = {
  id: string
}

export const cancelBooking = async (id: string) => {
  const booking = await db.booking.update({
    where: {
      id,
    },
    data: {
      status: BookingStatus.CANCELED,
    },
  })
  revalidatePath("/bookings")
  revalidatePath("/dashboard/barber-bookings")
  refresh()

  return booking
}
