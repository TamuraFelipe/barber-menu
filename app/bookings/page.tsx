import { auth } from "@/auth"
import Container from "../_components/container"
import Header from "../_components/header"
import Search from "../_components/search"
import { getMyBookings } from "../_actions/get-myBookings"
import BookingsContent from "../_components/bookings-content"

const BookingsPage = async () => {
  const session = await auth()

  const bookings = await getMyBookings({
    userId: session?.user?.id as string,
  })

  const agora = new Date()

  const confirmados = bookings.filter(
    (booking) => new Date(booking.date) >= agora,
  )
  const finalizados = bookings.filter(
    (booking) => new Date(booking.date) < agora,
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

        <BookingsContent confirmados={confirmados} finalizados={finalizados} />
      </Container>
    </div>
  )
}

export default BookingsPage
