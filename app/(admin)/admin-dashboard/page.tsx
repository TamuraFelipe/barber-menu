// app/(admin)/dashboard/page.tsx
import Container from "@/app/_components/container"
import { db } from "@/app/_lib/prisma"
import { BarberAdminForm } from "@/app/_components/barber-admin-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card"
import { Shield, LayoutGrid } from "lucide-react"
import { AdminBarberListItem } from "@/app/_components/admin-barber-list-item"

const AdminDashboardPage = async () => {
  const barbershops = await db.barbershop.findMany({
    include: {
      BarbershopServices: true, // Ajustado para o nome do relacionamento no seu schema
    },
    orderBy: {
      name: "asc",
    },
  })

  return (
    <div className="mt-6">
      <Container>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* COLUNA ESQUERDA: Formulário de Pré-cadastro */}
          <div className="lg:col-span-4">
            <Card>
              <CardHeader>
                <div className="text-primary flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  <CardTitle className="text-xl font-bold">
                    Novo Administrador
                  </CardTitle>
                </div>
                <CardDescription>
                  Cadastre as credenciais iniciais da barbearia. O proprietário
                  completará o resto.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BarberAdminForm />
              </CardContent>
            </Card>
          </div>

          {/* COLUNA DIREITA: Listagem de Barbearias Cadastradas */}
          <div className="lg:col-span-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <LayoutGrid className="text-muted-foreground h-5 w-5" />
                  <CardTitle className="text-xl font-bold">
                    Barbearias Cadastradas ({barbershops.length})
                  </CardTitle>
                </div>
                <CardDescription>
                  Gerencie o status de ativação e visualização pública das
                  barbearias.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-150 space-y-4 overflow-y-auto pr-2">
                  {barbershops.length === 0 ? (
                    <p className="text-muted-foreground py-8 text-center text-sm">
                      Nenhuma barbearia cadastrada no momento.
                    </p>
                  ) : (
                    barbershops.map((shop) => (
                      // Usamos um componente cliente separado para conter os cliques nos botões de ativação
                      <AdminBarberListItem
                        key={shop.id}
                        shop={JSON.parse(JSON.stringify(shop))}
                      />
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </div>
  )
}

export default AdminDashboardPage
