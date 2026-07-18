import BarberBookingItem from "@/app/_components/barber-booking-item"
import { BarberCalendarBookings } from "@/app/_components/barber-calendar-bookings"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/app/_components/ui/card"
import { db } from "@/app/_lib/prisma"
import { auth } from "@/auth"
import { $Enums } from "@prisma/client"
import { CalendarDaysIcon, ClipboardListIcon } from "lucide-react"

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
  status: $Enums.BookingStatus
}

interface SearchParams {
  searchParams: {
    date?: string
  }
}

const BarberBookingsPage = async ({ searchParams }: SearchParams) => {
  const { date } = await searchParams
  const session = await auth()

  if (!session?.user?.id) {
    return (
      <div className="flex min-h-100 flex-col items-center justify-center p-6 text-center">
        <p className="text-muted-foreground text-sm font-medium">
          Acesso negado. Por favor, faça login para acessar a agenda.
        </p>
      </div>
    )
  }

  const [year, month, day] = (date ?? "").split("-").map(Number)
  const selectedDate = date ? new Date(year, month - 1, day) : new Date()

  const start = new Date(selectedDate)
  start.setHours(0, 0, 0, 0)

  const end = new Date(selectedDate)
  end.setHours(23, 59, 59, 999)

  const bookings = await db.booking.findMany({
    where: {
      barbershop: {
        userId: session.user.id,
      },
      date: {
        gte: start,
        lte: end,
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

  const serializedBookings: SerializedBooking[] = JSON.parse(
    JSON.stringify(bookings),
  )

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8 lg:px-8">
      {/* Cabeçalho da Página */}
      <div className="mb-8 border-b pb-6">
        <h1 className="text-2xl font-bold tracking-tight lg:text-3xl">
          Painel do Barbeiro
        </h1>
        <p className="text-muted-foreground mt-1 text-sm lg:text-base">
          Gerencie os horários e o fluxo de atendimentos do seu estabelecimento.
        </p>
      </div>

      {/* Grid Responsivo de Layout */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
        {/* Coluna da Esquerda: Calendário (Ocupa 4 de 12 colunas no desktop) */}
        <aside className="lg:sticky lg:top-6 lg:col-span-4">
          <Card className="overflow-hidden border-none bg-neutral-900/40 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center space-y-0 space-x-3 pb-4">
              <CalendarDaysIcon className="text-primary h-5 w-5" />
              <div>
                <CardTitle className="text-base font-semibold">
                  Filtrar Data
                </CardTitle>
                <CardDescription className="text-xs">
                  Selecione o dia desejado
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="border-t border-neutral-800/60 p-0">
              <BarberCalendarBookings selectedDate={selectedDate} />
            </CardContent>
          </Card>
        </aside>

        {/* Coluna da Direita: Lista de Agendamentos (Ocupa 8 de 12 colunas no desktop) */}
        <main className="lg:col-span-8">
          <Card className="border-none bg-neutral-900/40 backdrop-blur-md">
            <CardHeader className="flex flex-row items-center space-y-0 space-x-3 border-b border-neutral-800/60 pb-6">
              <ClipboardListIcon className="text-primary h-5 w-5" />
              <div>
                <CardTitle className="text-lg font-bold">
                  Agendamentos do Dia
                </CardTitle>
                <CardDescription className="text-xs">
                  Acompanhe a fila de clientes e serviços solicitados.
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {serializedBookings.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <p className="text-muted-foreground text-sm font-medium">
                      Nenhum agendamento encontrado para esta data.
                    </p>
                  </div>
                ) : (
                  serializedBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="transition-all duration-200 hover:translate-x-1"
                    >
                      <BarberBookingItem booking={booking} />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}

export default BarberBookingsPage
