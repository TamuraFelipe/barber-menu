import { db } from "./_lib/prisma"
import Image from "next/image"
import { CircleAlertIcon } from "lucide-react"
import { buttonVariants } from "./_components/ui/button"
import { quickSearchOptions } from "./_constants/search"
import Header from "./_components/header"
import BarbershopItem from "./_components/barbershop-item"
import BookingItem from "./_components/booking-item"
import { auth } from "@/auth"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./_components/ui/carousel"
import Container from "./_components/container"
import Search from "./_components/search"
import Link from "next/link"
import { getMyBookings } from "./_actions/get-myBookings"

const Home = async () => {
  const barbershops = await db.barbershop.findMany({})
  const popularBarbershops = await db.barbershop.findMany({
    orderBy: {
      name: "desc",
    },
  })

  const session = await auth()
  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date())

  const bookings = await getMyBookings({
    userId: session?.user?.id as string,
  })

  return (
    <div>
      <Header />

      <Container>
        <div>
          {/*Texto*/}
          <div className="mt-6">
            <h2 className="text-xl font-bold">
              Olá, {session?.user?.name || "visitante"}
            </h2>
            <p>{formattedDate}</p>
          </div>
          {/*Busca*/}
          <div className="mt-6">
            <Search />
          </div>
          {/*Busca Rápida*/}
          <div className="mt-6 flex gap-3 overflow-x-scroll [&::-webkit-scrollbar]:hidden">
            {quickSearchOptions.map((option) => (
              <Link
                key={option.label}
                className={`${buttonVariants({ variant: "secondary" })} gap-2`}
                href={`/barbershops?service=${option.label}`}
              >
                <Image
                  src={option.imageUrl}
                  width={16}
                  height={16}
                  alt={option.label}
                />
                {option.label}
              </Link>
            ))}
          </div>
          {/*Banner*/}
          <div className="relative mt-6 h-40 w-full lg:h-112 xl:h-136">
            <Image
              src="/banner-01.png"
              alt="Agende com os melhores barbeiros da cidade"
              fill
              className="rounded-xl object-cover"
              sizes="(min-width: 1280px) 1200px, (min-width: 1024px) 900px, 100vw"
              priority
            />
          </div>

          {/*Agendamentos*/}
          {session?.user && (
            <div className="mt-6">
              <div className="mb-3 flex items-center gap-3 px-5">
                <h2 className="shrink-0 text-xs font-bold tracking-wider text-gray-400 uppercase">
                  Agendamentos
                </h2>

                <div className="bg-border h-px flex-1" />
              </div>
              {bookings.length > 0 ? (
                <div className="flex gap-4 overflow-x-auto px-6 py-0.5 [&::-webkit-scrollbar]:hidden">
                  <Carousel opts={{ align: "start" }} className="w-full">
                    <CarouselContent className="ml-0">
                      {bookings.map((agendamento) => (
                        <CarouselItem
                          key={agendamento.id}
                          className="px-1 md:basis-1/2 lg:basis-1/3 xl:basis-1/4 2xl:basis-1/4"
                        >
                          <div className="p-1">
                            <BookingItem agendamento={agendamento} />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="-left-6" />
                    <CarouselNext className="-right-6" />
                  </Carousel>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <CircleAlertIcon width={16} height={16} />
                  <p className="text-center text-sm text-gray-400">
                    Nenhum agendamento encontrado!
                  </p>
                </div>
              )}
            </div>
          )}

          {/*Recomendados*/}
          <div className="mt-6">
            <div className="mb-3 flex items-center gap-3 px-5">
              <h2 className="shrink-0 text-xs font-bold tracking-wider text-gray-400 uppercase">
                Recomendados
              </h2>

              <div className="bg-border h-px flex-1" />
            </div>
            <div className="flex gap-4 overflow-x-auto px-6 py-0.5 [&::-webkit-scrollbar]:hidden">
              <Carousel opts={{ align: "start" }} className="w-full">
                <CarouselContent className="ml-0">
                  {barbershops.map((barbershop) => (
                    <CarouselItem
                      key={barbershop.id}
                      className="basis-1/2 px-1 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 2xl:basis-1/8"
                    >
                      <div className="p-1">
                        <BarbershopItem
                          key={barbershop.id}
                          barbershop={barbershop}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-6" />
                <CarouselNext className="-right-6" />
              </Carousel>
            </div>
          </div>

          {/*Populares*/}
          <div className="mt-6">
            <div className="mb-3 flex items-center gap-3 px-5">
              <h2 className="shrink-0 text-xs font-bold tracking-wider text-gray-400 uppercase">
                Populares
              </h2>

              <div className="bg-border h-px flex-1" />
            </div>
            <div className="flex gap-4 overflow-x-auto px-6 py-0.5 [&::-webkit-scrollbar]:hidden">
              <Carousel opts={{ align: "start" }} className="w-full">
                <CarouselContent className="ml-0">
                  {popularBarbershops.map((barbershop) => (
                    <CarouselItem
                      key={barbershop.id}
                      className="basis-1/2 px-1 md:basis-1/4 lg:basis-1/5 xl:basis-1/6 2xl:basis-1/8"
                    >
                      <div className="p-1">
                        <BarbershopItem
                          key={barbershop.id}
                          barbershop={barbershop}
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="-left-6" />
                <CarouselNext className="-right-6" />
              </Carousel>
            </div>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default Home
