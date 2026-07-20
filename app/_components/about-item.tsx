import Image from "next/image"
import HourItem from "./hour-item"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import PhoneItem from "./phone-item"
import { Barbershop } from "@prisma/client"

interface AboutItemProps {
  barbershop: Barbershop
}

const AboutItem = ({ barbershop }: AboutItemProps) => {
  return (
    <Card>
      <CardContent className="p-5">
        <CardHeader className="p-0">
          <div className="bg-no-repeat] flex h-45 w-86.5 items-end justify-center rounded-lg bg-[url('/mapa.webp')] bg-cover bg-center px-5 py-5">
            <div className="bg-secondary flex w-full items-center gap-3 rounded-lg px-5 py-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={barbershop?.imageUrl} />
              </Avatar>
              <div>
                <p className="text-base font-bold">{barbershop?.name}</p>
                <p className="text-sm">{barbershop?.address}</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <div>
          <div className="mt-5 border-b border-solid pb-5">
            <p className="mb-2.5 text-sm font-bold">Sobre nós</p>
            <p className="text-sm">{barbershop?.description}</p>
          </div>
          <div className="space-y-3 border-b border-solid py-5">
            {barbershop.phones.map((phone) => (
              <PhoneItem key={phone} phone={phone} />
            ))}
          </div>
          <div className="mt-5 border-b border-solid pb-5">
            <HourItem barbershopId={barbershop.id} />
          </div>
        </div>
        <CardFooter>
          <div className="flex w-full items-center justify-between">
            <p>Em parceria com</p>
            <Image src="/logo.png" alt="Logo" width={100} height={100} />
          </div>
        </CardFooter>
      </CardContent>
    </Card>
  )
}

export default AboutItem
