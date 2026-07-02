import { Barbershop } from "@prisma/client"
import { Card, CardContent } from "./ui/card"
import Image from "next/image"
import { buttonVariants } from "./ui/button"
import { Badge } from "./ui/badge"
import { StarIcon } from "lucide-react"
import Link from "next/link"

interface BarbershopItemProps {
  barbershop: Barbershop
}
const BarbershopItem = ({ barbershop }: BarbershopItemProps) => {
  return (
    <Card className="max-w-full min-w-full rounded-2xl p-0">
      <CardContent className="px-1 py-0 pt-1">
        <div className="relative h-39.75 w-full">
          <div className="absolute top-2 left-2 z-50">
            <Badge
              variant="secondary"
              className="top-3 left-3 flex items-center gap-1 opacity-90"
            >
              <StarIcon size={12} className="fill-primary text-primary" />
              <span className="text-xs">5,0</span>
            </Badge>
          </div>
          <Image
            alt={barbershop.name}
            src={barbershop.imageUrl}
            style={{
              objectFit: "cover",
            }}
            fill
            className="rounded-2xl"
          />
        </div>

        <div className="px-2 pb-3">
          <h2 className="mt-2 overflow-hidden font-bold text-nowrap text-ellipsis">
            {barbershop.name}
          </h2>
          <p className="overflow-hidden text-sm text-nowrap text-ellipsis text-gray-400">
            {barbershop.address}
          </p>

          <Link
            href={`/barbershops/${barbershop.id}`}
            className={`${buttonVariants({ variant: "secondary" })} mt-3 w-full`}
          >
            Agendar
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default BarbershopItem
