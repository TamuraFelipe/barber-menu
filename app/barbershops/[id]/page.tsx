import PhoneItem from "@/app/_components/phone-item"
import ServiceItem from "@/app/_components/service-item"
import { Button, buttonVariants } from "@/app/_components/ui/button"
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

  const services = barbershop?.BarbershopServices.map((service) => ({
    ...service,
    price: service.price,
  }))

  return (
    <div>
      <div className="relative h-62.5 w-full">
        <Image
          src={barbershop?.imageUrl}
          alt={barbershop?.name}
          fill
          className="object-cover"
          sizes="600px"
        />

        <Link
          href="/"
          className={`${buttonVariants({ variant: "secondary", size: "lg" })} absolute top-4 left-4`}
        >
          <ChevronLeftIcon />
        </Link>
        <Button
          size="lg"
          className="absolute top-4 right-4"
          variant="secondary"
        >
          <MenuIcon />
        </Button>
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

      <div className="space-y-3 border-b border-solid p-5">
        <h2 className="text-xs font-bold text-gray-400 uppercase">Serviços</h2>
        <div className="space-y-3">
          {services?.map((service) => (
            <ServiceItem key={service.id} service={service} />
          ))}
        </div>
      </div>

      <div className="space-y-3 p-5">
        {barbershop.phones.map((phone) => (
          <PhoneItem key={phone} phone={phone} />
        ))}
      </div>
    </div>
  )
}

export default BarbershopPage
