import { auth } from "@/auth"
import { db } from "../_lib/prisma"

const AgendamentosPage = async () => {
  const session = await auth()

  const bookings = await db.booking.findMany({
    where: {
      userId: session?.user?.id as string,
    },
  })

  return (
    <div>
      <h1>Agendamentos</h1>
      {bookings.length > 0 ? (
        <ul>
          {bookings.map((booking) => (
            <li key={booking.id}>Teste</li>
          ))}
        </ul>
      ) : (
        <p>Voce ainda nao possui agendamentos</p>
      )}
    </div>
  )
}

export default AgendamentosPage
