import { Avatar, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"

interface Booking {
  completed: boolean
  service: string
  imageUrl: string
  barbershop: string
  month: string
  day: string
  time: string
}

interface BookingItemProps {
  agendamento: Booking
}
const BookingItem = ({ agendamento }: BookingItemProps) => {
  return (
    <>
      <Card className="p-0">
        <CardContent className="flex justify-between p-0">
          <div className="flex flex-col gap-2 py-5 pl-5">
            <Badge className={`${agendamento.completed ? "bg-green-500" : ""}`}>
              {agendamento.completed ? "Concluído" : "Confirmado"}
            </Badge>
            <h3 className="font-semibold">{agendamento.service}</h3>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src={agendamento.imageUrl} />
              </Avatar>
              <p className="text-sm">{agendamento.barbershop}</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center border-l-2 border-solid px-5">
            <p className="tex-sm">{agendamento.month}</p>
            <p className="text-3xl">{agendamento.day}</p>
            <p className="text-sm">{agendamento.time}</p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default BookingItem
