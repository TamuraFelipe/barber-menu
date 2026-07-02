import { db } from "./_lib/prisma"
import Image from "next/image"
import { SearchIcon } from "lucide-react"
import { Button } from "./_components/ui/button"
import { Input } from "./_components/ui/input"
import { quickSearchOptions } from "./_constants/search"
import Header from "./_components/header"
import BarbershopItem from "./_components/barbershop-item"
import BookingItem from "./_components/booking-item"

const Home = async () => {
  const barbershops = await db.barbershop.findMany({})
  const popularBarbershops = await db.barbershop.findMany({
    orderBy: {
      name: "desc",
    },
  })

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
        {/*Busca Rápida*/}
        <div className="mt-6 flex gap-3 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
          {quickSearchOptions.map((option) => (
            <Button key={option.label} className="gap-2" variant="secondary">
              <Image
                src={option.imageUrl}
                width={16}
                height={16}
                alt={option.label}
              />
              {option.label}
            </Button>
          ))}
        </div>
        {/*Banner*/}
        <div className="relative mt-6 h-37.5 w-full">
          <Image
            src="/banner-01.png"
            alt="Agende com os melhores barbeiros da cidade"
            fill
            className="rounded-xl object-cover"
            sizes="600px"
            priority
          />
        </div>
        {/*Agendamentos*/}
        <div className="mt-6">
          <BookingItem />
        </div>
        {/*Recomendados*/}
        <div className="mt-6">
          <h2 className="mb-3 px-5 text-xs font-bold text-gray-400 uppercase">
            Recomendados
          </h2>
          <div className="flex gap-4 overflow-x-auto px-5 py-0.5 [&::-webkit-scrollbar]:hidden">
            {barbershops.map((barbershop) => (
              <div key={barbershop.id} className="max-w-41.75 min-w-41.75">
                <BarbershopItem key={barbershop.id} barbershop={barbershop} />
              </div>
            ))}
          </div>
        </div>
        {/*Populares*/}
        <div className="mt-6">
          <h2 className="mb-3 px-5 text-xs font-bold text-gray-400 uppercase">
            Populares
          </h2>
          <div className="flex gap-4 overflow-x-auto px-5 py-0.5 [&::-webkit-scrollbar]:hidden">
            {popularBarbershops.map((barbershop) => (
              <div key={barbershop.id} className="max-w-41.75 min-w-41.75">
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
