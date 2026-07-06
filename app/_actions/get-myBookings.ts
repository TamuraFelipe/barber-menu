"use server"

import { db } from "../_lib/prisma"

interface GetMyBookingsProps {
  userId: string
}

export const getMyBookings = async ({ userId }: GetMyBookingsProps) => {
  const bookings = db.booking.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      date: true,
      service: {
        select: {
          name: true,
        },
      },
      barbershop: {
        select: {
          name: true,
          imageUrl: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  })

  return bookings
}
