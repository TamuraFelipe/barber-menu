import { SearchIcon } from "lucide-react"
import { Button } from "./_components/ui/button"
import { Input } from "./_components/ui/input"
import Image from "next/image"
import { Card, CardContent } from "./_components/ui/card"
import { Badge } from "./_components/ui/badge"
import { Avatar, AvatarImage } from "./_components/ui/avatar"
import Header from "./_components/header"
import { db } from "./_lib/prisma"
import BarbershopItem from "./_components/barbershop-item"

const Home = async () => {
  const barbershops = await db.barbershop.findMany({})

  return (
    <div>
      <Header />
      <div className="p-5">
        {/*Texto*/}
        <h2 className="text-xl font-bold">Olá, Felipe</h2>
        <p>Quarta-feira, 30 de março</p>
        {/*Busca*/}
        <div className="mt-6 flex items-center gap-2">
          <Input placeholder="Faça sua busca..." />
          <Button>
            <SearchIcon />
          </Button>
        </div>
        {/*Banner*/}
        <div className="relative mt-6 h-37.5 w-full">
          <Image
            src="/banner-01.png"
            alt="Agende com os melhores barbeiros da cidade"
            fill
            className="rounded-xl object-cover"
          />
        </div>
        {/*Agendamentos*/}
        <div className="mt-6">
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
        </div>
        {/*Recomendados*/}
        <div className="mt-6">
          <h2 className="mb-3 px-5 text-xs font-bold text-gray-400 uppercase">
            Recomendados
          </h2>
          <div className="flex gap-4 overflow-x-auto px-5 py-0.5 [&::-webkit-scrollbar]:hidden">
            {barbershops.map((barbershop) => (
              <div key={barbershop.id} className="max-w-[167px] min-w-[167px]">
                <BarbershopItem key={barbershop.id} barbershop={barbershop} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
