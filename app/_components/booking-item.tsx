import { addHours, format, isPast } from "date-fns"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"
import { ptBR } from "date-fns/locale"

interface Booking {
  date: Date
  barbershop: {
    name: string
    imageUrl: string
  }
  service: {
    name: string
  }
}

interface BookingItemProps {
  agendamento: Booking
}
const BookingItem = ({ agendamento }: BookingItemProps) => {
  const compareDate = (date: Date) => {
    const endDate = addHours(date, 1)

    return isPast(endDate)
  }
  return (
    <>
      <Card className="p-0">
        <CardContent className="flex justify-between p-0">
          <div className="flex flex-col gap-2 py-5 pl-5">
            <Badge
              className={`${compareDate(agendamento.date) ? "bg-green-400" : ""}`}
            >
              {compareDate(agendamento.date) ? "Finalizado" : "Agendado"}
            </Badge>
            <h3 className="font-semibold">{agendamento.service.name}</h3>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={agendamento.barbershop.imageUrl} />
              </Avatar>
              <p className="text-sm">{agendamento.barbershop.name}</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center border-l-2 border-solid px-5">
            <p className="tex-sm capitalize">
              {format(agendamento.date, "MMMM", { locale: ptBR })}
            </p>
            <p className="text-3xl">{format(agendamento.date, "dd")}</p>
            <p className="text-sm">{format(agendamento.date, "HH:mm")}</p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default BookingItem
