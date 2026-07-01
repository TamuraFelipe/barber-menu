import { Avatar, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { Card, CardContent } from "./ui/card"

const BookingItem = () => {
  return (
    <>
      <h2 className="mb-3 pl-5 text-xs font-bold text-gray-400 uppercase">
        Agendamentos
      </h2>
      <Card className="p-0">
        <CardContent className="flex justify-between p-0">
          <div className="flex flex-col gap-2 py-5 pl-5">
            <Badge>Confirmado</Badge>
            <h3 className="font-semibold">Corte de Cabelo</h3>
            <div className="flex items-center gap-2">
              <Avatar className="h-6 w-6">
                <AvatarImage src="https://utfs.io/f/178da6b6-6f9a-424a-be9d-a2feb476eb36-16t.png" />
              </Avatar>
              <p className="text-sm">Vintage Barber</p>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center border-l-2 border-solid px-5">
            <p className="tex-sm">Agosto</p>
            <p className="text-3xl">30</p>
            <p className="text-sm">16:00</p>
          </div>
        </CardContent>
      </Card>
    </>
  )
}

export default BookingItem
