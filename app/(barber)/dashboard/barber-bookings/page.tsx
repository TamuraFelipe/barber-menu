import Container from "@/app/_components/container"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/_components/ui/card"
import { db } from "@/app/_lib/prisma"
import { auth } from "@/auth"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"

// 1. Definição estrita das interfaces de tipagem
interface BookingUser {
  name: string
  email: string
}

interface BookingService {
  name: string
  price: number
}

interface SerializedBooking {
  id: string
  date: string
  user: BookingUser
  service: BookingService
}

const BarberBookingsPage = async () => {
  // 2. Obtém a sessão do usuário de forma assíncrona
  const session = await auth()

  if (!session?.user?.id) {
    return (
      <div className="text-muted-foreground p-6 text-center">
        Acesso negado. Por favor, faça login.
      </div>
    )
  }

  // 3. Busca os agendamentos filtrando pelo dono da barbearia
  const bookings = await db.booking.findMany({
    where: {
      barbershop: {
        userId: session.user.id,
      },
    },
    include: {
      user: true,
      service: true,
    },
    orderBy: {
      date: "asc",
    },
  })

  // 4. Converte e tipa o resultado como um array de SerializedBooking
  const serializedBookings: SerializedBooking[] = JSON.parse(
    JSON.stringify(bookings),
  )

  return (
    <div className="mt-6">
      <Container>
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center justify-between">
                <h1 className="flex items-center gap-4 text-2xl font-bold">
                  Agendamentos
                </h1>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 text-sm"
                >
                  <ArrowLeftIcon />
                  Voltar
                </Link>
              </div>
            </CardTitle>
            <CardDescription>
              Confira abaixo todos os horários agendados na sua barbearia.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {serializedBookings.length === 0 ? (
                <p className="text-muted-foreground py-4 text-center text-sm">
                  Nenhum agendamento encontrado para a sua barbearia.
                </p>
              ) : (
                serializedBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="hover:bg-accent/30 flex items-center justify-between rounded-lg border p-4 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-bold">
                        {booking.service.name}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        Cliente: {booking.user.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">
                        {new Date(booking.date).toLocaleDateString("pt-BR")}
                      </p>
                      <p className="text-muted-foreground text-xs">
                        {new Date(booking.date).toLocaleTimeString("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  )
}

export default BarberBookingsPage
