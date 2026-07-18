import AboutItem from "@/app/_components/about-item"
import Container from "@/app/_components/container"
import Header from "@/app/_components/header"
import PhoneItem from "@/app/_components/phone-item"
import Search from "@/app/_components/search"
import ServiceItem from "@/app/_components/service-item"
import SidebarSheet from "@/app/_components/sidebar-sheet"
import { Button, buttonVariants } from "@/app/_components/ui/button"
import { Sheet, SheetTrigger } from "@/app/_components/ui/sheet"
import { db } from "@/app/_lib/prisma"
import NotFound from "@/app/not-found"
import { ChevronLeftIcon, MapPinIcon, MenuIcon, StarIcon } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface BarbershopPageProps {
  params: Promise<{ id: string }>
}
const BarbershopPage = async ({ params }: BarbershopPageProps) => {
  const { id } = await params

  const barbershopRaw = await db.barbershop.findUnique({
    where: {
      id: id,
    },
    include: {
      review: {
        select: {
          rating: true,
        },
      },
      BarbershopServices: true,
      Bookings: true,
    },
  })

  if (!barbershopRaw) {
    return NotFound()
  }

  const serializeBarbershop = (barber: NonNullable<typeof barbershopRaw>) => {
    const totalReviews = barber.review.length
    const sumRatings = barber.review.reduce(
      (acc: number, rev: { rating: number }) => acc + rev.rating,
      0,
    )
    const averageRating =
      totalReviews > 0 ? (sumRatings / totalReviews).toFixed(1) : "0.0"

    return {
      ...barber,
      averageRating: Number(averageRating),
      totalReviews,
    }
  }

  const barbershop = serializeBarbershop(barbershopRaw)

  const services = barbershop?.BarbershopServices?.map((service) => {
    return {
      ...JSON.parse(JSON.stringify(service)), // Remove qualquer instância oculta de classes como o Decimal
      price: Number(service.price), // Garante que vire um número puro JavaScript
    }
  })

  return (
    <>
      <div className="hidden lg:block">
        <Header>
          <Search />
        </Header>
      </div>
      <Container>
        <div className="items-start lg:mt-10 xl:grid xl:grid-cols-[1fr_386px] xl:gap-10">
          <div>
            <div className="relative h-62.5 xl:h-auto">
              <div className="relative h-full xl:h-114.5 xl:w-189.5">
                <Image
                  src={barbershop?.imageUrl || ""}
                  alt={barbershop?.name || ""}
                  fill
                  className="h-auto object-cover lg:rounded-lg"
                  sizes="(min-width: 1280px) 1200px, (min-width: 1024px) 900px, 600px"
                />
              </div>

              <Link
                href="/"
                className={`${buttonVariants({ variant: "secondary", size: "lg" })} absolute top-4 left-4 lg:hidden`}
              >
                <ChevronLeftIcon />
              </Link>
              <Sheet>
                <SheetTrigger
                  render={
                    <Button
                      size="lg"
                      variant="secondary"
                      className="absolute top-4 right-4 lg:hidden"
                    >
                      <MenuIcon />
                    </Button>
                  }
                ></SheetTrigger>

                <SidebarSheet />
              </Sheet>
            </div>

            <div className="border-b border-solid p-5 xl:border-none">
              <h1 className="mb-3 text-xl font-bold">{barbershop?.name}</h1>
              <div className="mb-1 flex items-center gap-1">
                <MapPinIcon className="text-primary" size={18} />
                <p className="text-sm">{barbershop?.address}</p>
              </div>
              <div className="flex items-center gap-1">
                <StarIcon className="text-primary fill-primary" size={18} />
                <p className="text-sm">
                  {barbershop.averageRating} (
                  {`${barbershop.totalReviews} avaliações`})
                </p>
              </div>
            </div>

            <div className="space-y-2 border-b border-solid p-5 lg:hidden">
              <h2 className="text-xs font-bold text-gray-400 uppercase">
                Sobre nós
              </h2>
              <p className="text-sm">{barbershop?.description}</p>
            </div>

            <div className="mt-6">
              <div className="mb-3 flex items-center gap-3">
                <h2 className="shrink-0 text-xs font-bold tracking-wider text-gray-400 uppercase">
                  Serviços
                </h2>

                <div className="bg-border h-px flex-1" />
              </div>
              <div className="space-y-3 border-b border-solid p-5 xl:border-none">
                <div className="grid grid-cols-1 gap-4 space-y-3 md:grid-cols-2 md:space-y-0 xl:grid-cols-2">
                  {services?.map((service) => (
                    <ServiceItem
                      key={service.id}
                      service={service}
                      bookingsTime={
                        barbershop.Bookings?.map((booking) => booking.date) ??
                        []
                      }
                      barbershop={{
                        id: barbershop.id as string,
                        name: barbershop.name as string,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 p-5 xl:hidden">
              {barbershop.phones?.map((phone) => (
                <PhoneItem key={phone} phone={phone} />
              ))}
            </div>
          </div>

          {/* Sobre (Desktop) */}
          <div className="hidden xl:block">
            <AboutItem barbershop={barbershop} />
          </div>
        </div>
      </Container>
    </>
  )
}

export default BarbershopPage
