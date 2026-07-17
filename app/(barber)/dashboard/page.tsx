import Link from "next/link"
import Container from "@/app/_components/container"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card"
import { auth, signOut } from "@/auth"
import { Button } from "@/app/_components/ui/button"
import {
  CalendarIcon,
  HouseIcon,
  LayoutDashboardIcon,
  PowerIcon,
} from "lucide-react"
import { revalidatePath } from "next/cache"

const BarberDashboardPage = async () => {
  const session = await auth()
  return (
    <div className="mt-6">
      <Container>
        <Card className="h-full">
          <CardContent className="p-0">
            <CardHeader>
              <CardTitle>
                <div className="flex items-center justify-between">
                  <h1 className="text-2xl font-bold">
                    Dashboard
                    <br /> Olá {session?.user.name}
                  </h1>
                  <form
                    action={async () => {
                      "use server"
                      await signOut({ redirectTo: "/" })
                      revalidatePath("/")
                    }}
                  >
                    <Button type="submit">
                      <PowerIcon size={60} />
                    </Button>
                  </form>
                </div>
              </CardTitle>
              <CardDescription>
                <h2>Gerencie e atualize os dados da sua Barbearia aqui.</h2>
              </CardDescription>

              <div className="mt-6 flex items-center justify-between gap-6">
                <Link
                  href="/dashboard/barbershop"
                  className="flex flex-col items-center gap-2 text-xs"
                >
                  <LayoutDashboardIcon size={60} />
                  Editar/Cadastrar
                </Link>
                <Link
                  href="/dashboard/barber-bookings"
                  className="flex flex-col items-center gap-2 text-xs"
                >
                  <CalendarIcon size={60} />
                  Agendamentos
                </Link>
                <Link
                  href="/"
                  className="flex flex-col items-center gap-2 text-xs"
                >
                  <HouseIcon size={60} />
                  Pública
                </Link>
              </div>
            </CardHeader>
          </CardContent>
        </Card>
      </Container>
    </div>
  )
}

export default BarberDashboardPage
