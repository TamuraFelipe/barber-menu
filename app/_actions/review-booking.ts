"use server"

import { revalidatePath } from "next/cache"
import { db } from "../_lib/prisma"
import { auth } from "@/auth"

export const reviewBooking = async (
  id: string,
  rating: number,
  barbershopId: string,
) => {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Usuário não autenticado.")
  }

  if (rating < 1 || rating > 5) {
    throw new Error("A nota deve ser entre 1 e 5.")
  }

  const review = await db.review.create({
    data: {
      bookingId: id,
      rating,
      barbershopId,
      userId: session.user.id,
    },
  })

  revalidatePath("/bookings")
  revalidatePath("/dashboard/barber-bookings")
  revalidatePath(`/barbershops/${barbershopId}`)

  return review
}
