"use server"

import { db } from "../_lib/prisma"

interface GetMyBookingsProps {
  userId: string
}

export const getMyBookings = async ({ userId }: GetMyBookingsProps) => {
  // 1. Adicionado o await para esperar a resposta do banco
  const bookings = await db.booking.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      date: true,
      service: {
        select: {
          name: true,
          price: true,
        },
      },
      barbershop: {
        select: {
          name: true,
          imageUrl: true,
          address: true,
          description: true,
          phones: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  })

  // 2. Mapeamos os agendamentos para transformar o Decimal do service em number
  return bookings.map((booking) => ({
    ...booking,
    service: {
      ...booking.service,
      // O método .toNumber() converte o Decimal do Prisma em número puro do JS
      price: booking.service.price.toNumber(),
    },
  }))
}
