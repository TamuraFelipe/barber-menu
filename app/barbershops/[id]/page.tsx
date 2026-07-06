import Container from "@/app/_components/container"
import PhoneItem from "@/app/_components/phone-item"
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

  const barbershop = await db.barbershop.findUnique({
    where: {
      id: id,
    },
    include: {
      BarbershopServices: true,
    },
  })

  if (!barbershop) {
    return NotFound()
  }

  const services = barbershop.BarbershopServices.map((service) => {
    return {
      ...JSON.parse(JSON.stringify(service)), // Remove qualquer instância oculta de classes como o Decimal
      price: Number(service.price), // Garante que vire um número puro JavaScript
    }
  })

  return (
    <Container>
      <div className="relative h-62.5 w-full">
        <Image
          src={barbershop?.imageUrl}
          alt={barbershop?.name}
          fill
          className="object-cover"
          sizes="(min-width: 1280px) 1200px, (min-width: 1024px) 900px, 600px"
        />

        <Link
          href="/"
          className={`${buttonVariants({ variant: "secondary", size: "lg" })} absolute top-4 left-4`}
        >
          <ChevronLeftIcon />
        </Link>
        <Sheet>
          <SheetTrigger
            render={
              <Button
                size="lg"
                variant="secondary"
                className="absolute top-4 right-4"
              >
                <MenuIcon />
              </Button>
            }
          ></SheetTrigger>

          <SidebarSheet />
        </Sheet>
      </div>

      <div className="border-b border-solid p-5">
        <h1 className="mb-3 text-xl font-bold">{barbershop?.name}</h1>
        <div className="mb-1 flex items-center gap-1">
          <MapPinIcon className="text-primary" size={18} />
          <p className="text-sm">{barbershop?.address}</p>
        </div>
        <div className="flex items-center gap-1">
          <StarIcon className="text-primary fill-primary" size={18} />
          <p className="text-sm">5,0 (10 avaliações)</p>
        </div>
      </div>

      <div className="space-y-2 border-b border-solid p-5">
        <h2 className="text-xs font-bold text-gray-400 uppercase">Sobre nós</h2>
        <p className="text-sm">{barbershop?.description}</p>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-center gap-3 px-5">
          <h2 className="shrink-0 text-xs font-bold tracking-wider text-gray-400 uppercase">
            Serviços
          </h2>

          <div className="bg-border h-px flex-1" />
        </div>
        <div className="space-y-3 border-b border-solid p-5">
          <div className="grid grid-cols-1 gap-4 space-y-3 md:grid-cols-2 md:space-y-0 xl:grid-cols-3 2xl:grid-cols-4">
            {services?.map((service) => (
              <ServiceItem
                key={service.id}
                service={service}
                barbershop={{
                  id: barbershop.id,
                  name: barbershop.name,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-3 p-5">
        {barbershop.phones.map((phone) => (
          <PhoneItem key={phone} phone={phone} />
        ))}
      </div>
    </Container>
  )
}

export default BarbershopPage
