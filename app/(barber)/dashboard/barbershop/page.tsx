import Link from "next/link"
import Container from "@/app/_components/container"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card"
import { db } from "@/app/_lib/prisma"
import { auth } from "@/auth"
import { BarberForm } from "@/app/_components/barber-form"
import { ArrowLeftIcon } from "lucide-react"

const BarbershopPage = async () => {
  const session = await auth()

  // 1. Busca os dados brutos no banco
  const barbershopDb = await db.barbershop.findFirst({
    where: {
      userId: session?.user?.id,
    },
    include: {
      BarbershopServices: true,
      openingHours: true,
    },
  })

  // 2. Transforma o Decimal em número simples E força a serialização via JSON
  // Isso remove qualquer classe ou protótipo complexo (como Decimal) do objeto,
  // restando apenas um "plain object" (objeto simples) que o Next.js aceita sem reclamar.
  const barbershop = barbershopDb
    ? JSON.parse(
        JSON.stringify({
          ...barbershopDb,
          services: barbershopDb.BarbershopServices.map((service) => ({
            ...service,
            price: service.price.toNumber(), // Converte Decimal para Number
          })),
        }),
      )
    : null

  return (
    <div className="mt-6">
      <Container>
        <Card>
          <CardContent className="p-0">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center justify-between">
                  <h1 className="flex items-center gap-4 text-2xl font-bold">
                    Editar/Cadastrar
                  </h1>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-2 text-sm"
                  >
                    <ArrowLeftIcon />
                    Voltar
                  </Link>
                </div>
              </CardTitle>
              <CardDescription>
                {barbershop
                  ? "Gerencie e atualize os dados da sua Barbearia aqui."
                  : "Complete o cadastro para criar a sua Barbearia."}
              </CardDescription>

              <div className="mt-6">
                {/* 3. Agora passamos o objeto 100% serializado e livre de Decimals */}
                <BarberForm initialData={barbershop} />
              </div>
            </CardHeader>
          </CardContent>
        </Card>
      </Container>
    </div>
  )
}

export default BarbershopPage
