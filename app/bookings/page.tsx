import { auth } from "@/auth"
import Container from "../_components/container"
import Header from "../_components/header"
import Search from "../_components/search"
import BookingsContent from "../_components/bookings-content"
import { db } from "../_lib/prisma"
import { BookingStatus } from "@prisma/client"

const BookingsPage = async () => {
  const session = await auth()

  const bookings = await db.booking.findMany({
    where: {
      userId: session?.user?.id as string,
    },
    include: {
      service: true,
      barbershop: true,
      review: true,
    },
  })

  const serializedBookings = bookings.map((booking) => ({
    ...booking,
    service: {
      ...booking.service,
      price: Number(booking.service.price),
    },
    rating: booking.review?.rating ?? null,
  }))

  /* const confirmados = serializedBookings.filter(
    (booking) => !compareDateTime(new Date(booking.date)),
  ) */
  const confirmados = serializedBookings.filter(
    (booking) => booking.status === BookingStatus.CONFIRMED,
  )

  /* const finalizados = serializedBookings.filter((booking) =>
    compareDateTime(new Date(booking.date)),
  ) */
  const finalizados = serializedBookings.filter(
    (booking) => booking.status === BookingStatus.FINISHED,
  )

  const cancelados = serializedBookings.filter(
    (booking) => booking.status === BookingStatus.CANCELED,
  )

  return (
    <div>
      <div>
        <Header>
          <Search />
        </Header>
      </div>
      <Container>
        <h1 className="mt-6 text-xl font-bold lg:text-2xl">Agendamentos</h1>

        <BookingsContent
          confirmados={confirmados}
          finalizados={finalizados}
          cancelados={cancelados}
        />
      </Container>
    </div>
  )
}

export default BookingsPage
