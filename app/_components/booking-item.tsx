import { format } from "date-fns"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"
import { ptBR } from "date-fns/locale"
import { Prisma } from "@prisma/client"
import { compareDateTime } from "../_helper/compareDateTime"

interface BookingItemProps {
  agendamento: Prisma.BookingGetPayload<{
    include: { barbershop: true; service: true }
  }>
}

const BookingItem = ({ agendamento }: BookingItemProps) => {
  return (
    <>
      <Card className="p-0">
        <CardContent className="flex justify-between p-0">
          <div className="flex flex-col gap-2 py-5 pl-5">
            <Badge
              className={`${compareDateTime(agendamento.date) ? "bg-green-400" : ""}`}
            >
              {compareDateTime(agendamento.date) ? "Finalizado" : "Agendado"}
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
