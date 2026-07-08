"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"

export type DeleteBookingProps = {
  id: string
}

export const deleteBooking = async (id: string) => {
  await db.booking.delete({
    where: {
      id,
    },
  })
  revalidatePath("/bookings")
}
