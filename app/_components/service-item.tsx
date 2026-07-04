import { BarbershopService } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"
import { buttonVariants } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { auth } from "@/auth"

interface ServiceItemProps {
  service: BarbershopService
}
const ServiceItem = async ({ service }: ServiceItemProps) => {
  const session = await auth()

  return (
    <Card className="p-3">
      <CardContent key={service.id} className="flex items-center gap-3 p-0">
        <div className="relative h-27.5 max-h-27.5 w-27.5 max-w-27.5">
          <Image
            src={service.imageUrl}
            alt={service.name}
            className="rounded-xl object-cover"
            fill
            sizes="167px"
          />
        </div>

        <div className="w-full space-y-2">
          <h3 className="text-sm font-semibold">{service.name}</h3>
          <p className="text-muted-foreground text-sm">{service.description}</p>

          <div className="flex items-center justify-between">
            <p className="text-primary text-sm font-bold">
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(Number(service.price))}
            </p>
            <Link
              href={
                session?.user
                  ? `/barbershops/${service.barbershopId}/services/${service.id}`
                  : "/register"
              }
              className={`${buttonVariants({ variant: "secondary", size: "default" })}`}
            >
              Agendar
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ServiceItem
