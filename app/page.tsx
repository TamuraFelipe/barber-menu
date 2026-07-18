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
import { $Enums } from "@prisma/client"

const Home = async () => {
  // 1. Buscamos as barbearias incluindo o agregado de avaliações (Média e Quantidade)
  const barbershopsRaw = await db.barbershop.findMany({
    where: { status: "ACTIVE" },
    include: {
      review: {
        select: {
          rating: true,
        },
      },
    },
  })

  const popularBarbershopsRaw = await db.barbershop.findMany({
    where: { status: "ACTIVE" },
    orderBy: { name: "desc" },
    include: {
      review: {
        select: {
          rating: true,
        },
      },
    },
  })

  // 2. Formatamos os dados calculando a média aritmética de estrelas
  const serializeBarbershop = (barber: (typeof barbershopsRaw)[number]) => {
    const totalReviews = barber.review?.length || 0
    const sumRatings =
      barber.review?.reduce(
        (acc: number, rev: { rating: number }) => acc + rev.rating,
        0,
      ) || 0
    const averageRating =
      totalReviews > 0 ? (sumRatings / totalReviews).toFixed(1) : "0.0"

    return {
      ...barber,
      averageRating: Number(averageRating),
      totalReviews,
    }
  }

  const barbershops = barbershopsRaw.map(serializeBarbershop)
  const popularBarbershops = popularBarbershopsRaw.map(serializeBarbershop)
  // Reutiliza os mesmos dados ordenando os mais visitados/melhores avaliados por nota decrescente
  const maisVisitadosBarbershop = [...barbershops].sort(
    (a, b) => b.averageRating - a.averageRating,
  )

  const session = await auth()
  const formattedDate = new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  }).format(new Date())

  // Buscamos os agendamentos incluindo a review do agendamento para a página inicial também
  const bookings = await db.booking.findMany({
    where: {
      userId: session?.user?.id,
    },
    include: {
      barbershop: true,
      service: true,
      review: true,
    },
  })

  const serializedBookings = bookings
    .map((booking) => ({
      ...booking,
      rating: booking.review?.rating ?? null,
    }))
    .filter((booking) => booking.status === $Enums.BookingStatus.CONFIRMED)
  /* const bookingsFiltrados = filterRecentBookings(serializedBookings) */

  return (
    <div>
      <Header />

      <Container>
        <div>
          <div className="lg:grid lg:grid-cols-2 lg:gap-8">
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
              {/*Agendamentos*/}
              {session?.user && (
                <div className="mt-6">
                  <div className="mb-3 flex items-center gap-3 px-5">
                    <h2 className="shrink-0 text-xs font-bold tracking-wider text-gray-400 uppercase">
                      Agendamentos
                    </h2>
                    <div className="bg-border h-px flex-1" />
                  </div>
                  {serializedBookings.length > 0 ? (
                    <div className="flex gap-4 overflow-x-auto px-6 py-0.5 [&::-webkit-scrollbar]:hidden">
                      <Carousel opts={{ align: "start" }} className="w-full">
                        <CarouselContent className="ml-0">
                          {serializedBookings.map((agendamento) => (
                            <CarouselItem
                              key={agendamento.id}
                              className="px-1 md:basis-1/2 lg:basis-1/1 xl:basis-1/2 2xl:basis-1/2"
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
            </div>

            {/*Banner*/}
            <div className="mt-6 lg:hidden">
              <div className="relative mt-6 h-40 w-full xl:h-90">
                <Image
                  src="/banner-01.png"
                  alt="Agende com os melhores barbeiros da cidade"
                  fill
                  className="rounded-xl object-cover"
                  sizes="(min-width: 1280px) 1200px, (min-width: 1024px) 900px, 100vw"
                  priority
                />
              </div>
            </div>
            {/*Mais Visitados (Melhores avaliados)*/}
            <div className="mt-6 hidden lg:block">
              <div className="mb-3 flex items-center gap-3 px-5">
                <h2 className="shrink-0 text-xs font-bold tracking-wider text-gray-400 uppercase">
                  Mais visitados
                </h2>
                <div className="bg-border h-px flex-1" />
              </div>
              <div className="flex gap-4 overflow-x-auto px-6 py-0.5 [&::-webkit-scrollbar]:hidden">
                <Carousel opts={{ align: "start" }} className="w-full">
                  <CarouselContent className="ml-0">
                    {maisVisitadosBarbershop.map((barbershop) => (
                      <CarouselItem
                        key={barbershop.id}
                        className="basis-1/2 px-1 xl:basis-1/3"
                      >
                        <div className="p-1">
                          <BarbershopItem barbershop={barbershop} />
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
                      className="basis-1/2 px-1 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
                    >
                      <div className="p-1">
                        <BarbershopItem barbershop={barbershop} />
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
                      className="basis-1/2 px-1 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
                    >
                      <div className="p-1">
                        <BarbershopItem barbershop={barbershop} />
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
