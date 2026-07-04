import { CircleAlertIcon } from "lucide-react"
import BarbershopItem from "../_components/barbershop-item"
import { db } from "../_lib/prisma"
import Container from "../_components/container"
import Search from "../_components/search"
import Header from "../_components/header"

interface BarbershopsPageProps {
  searchParams: {
    title: string
    service: string
  }
}
const BarbershopsPage = async ({ searchParams }: BarbershopsPageProps) => {
  const { title, service } = await searchParams

  const barbershop = await db.barbershop.findMany({
    where: {
      OR: [
        title
          ? {
              name: {
                contains: title,
                mode: "insensitive",
              },
            }
          : {},
        service
          ? {
              BarbershopServices: {
                some: {
                  name: {
                    contains: service,
                    mode: "insensitive",
                  },
                },
              },
            }
          : {},
      ],
    },
  })
  return (
    <>
      <Header />
      <Container>
        <div className="mt-6">
          <Search />
        </div>
        <div className="mt-6">
          <div className="mb-3 flex items-center gap-3">
            <h2 className="shrink-0 text-xs font-bold tracking-wider text-gray-400 uppercase">
              {`Resultado para "${title || service}"`}
            </h2>
          </div>
          {barbershop.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {barbershop.map((barbershop) => (
                <BarbershopItem key={barbershop.id} barbershop={barbershop} />
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <CircleAlertIcon width={16} height={16} />
              <p className="text-center text-sm text-gray-400">
                {`Nenhum resultado "${title || service}" encontrado!`}
              </p>
            </div>
          )}
        </div>
      </Container>
    </>
  )
}

export default BarbershopsPage
