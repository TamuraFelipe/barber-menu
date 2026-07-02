import { BarbershopService } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"
import { buttonVariants } from "./ui/button"
import { Card, CardContent } from "./ui/card"

interface ServiceItemProps {
  service: BarbershopService
}
const ServiceItem = ({ service }: ServiceItemProps) => {
  return (
    <Card>
      <CardContent key={service.id} className="flex items-center gap-3">
        <div className="relative h-27.5 max-h-27.5 w-27.5 max-w-27.5">
          <Image
            src={service.imageUrl}
            alt={service.name}
            className="rounded-xl object-cover"
            fill
            sizes="110px"
          />
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold">{service.name}</h3>
          <p className="text-muted-foreground text-sm">{service.description}</p>

          <div className="flex items-center justify-between">
            <p className="text-primary text-sm font-semibold">
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(Number(service.price))}
            </p>
            <Link
              href={`/barbershops/${service.barbershopId}/services/${service.id}`}
              className={`${buttonVariants({ variant: "secondary", size: "sm" })}`}
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
