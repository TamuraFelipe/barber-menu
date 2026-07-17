// app/_components/admin-barber-list-item.tsx
"use client"

import { Button } from "@/app/_components/ui/button"
import { Mail, MapPin, Power, Trash2 } from "lucide-react"
import {
  toggleBarbershopStatus,
  deleteBarbershop,
} from "@/app/_actions/create-barber-admin"
import { toast } from "sonner"
import { useState } from "react"
import { BarbershopService } from "@prisma/client"

interface AdminBarberListItemProps {
  shop: {
    id: string
    name: string
    email: string
    address: string
    status: "ACTIVE" | "PENDING"
    BarbershopServices: BarbershopService[]
  }
}

export const AdminBarberListItem = ({ shop }: AdminBarberListItemProps) => {
  const [loading, setLoading] = useState(false)

  const handleToggleStatus = async () => {
    setLoading(true)
    const res = await toggleBarbershopStatus(shop.id, shop.status)
    if (res.success) {
      toast.success(
        `Barbearia ${shop.status === "ACTIVE" ? "pausada" : "ativada"} com sucesso!`,
      )
    } else {
      toast.error("Erro ao alterar o status da barbearia.")
    }
    setLoading(false)
  }

  const handleDelete = async () => {
    if (
      !confirm("Tem certeza que deseja deletar esta barbearia permanentemente?")
    )
      return

    setLoading(true)
    const res = await deleteBarbershop(shop.id)
    if (res.success) {
      toast.success("Barbearia deletada com sucesso!")
    } else {
      toast.error("Erro ao deletar a barbearia.")
    }
    setLoading(false)
  }

  return (
    <div className="hover:bg-accent/30 flex flex-col justify-between gap-4 rounded-lg border p-4 transition-colors sm:flex-row sm:items-center">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-bold tracking-tight">{shop.name}</h3>

          {/* Badge de Status */}
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium ${
              shop.status === "ACTIVE"
                ? "border border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
                : "border border-amber-500/20 bg-amber-500/10 text-amber-500"
            }`}
          >
            {shop.status === "ACTIVE" ? "Ativa" : "Pendente"}
          </span>

          <span className="text-muted-foreground bg-accent rounded-full px-2 py-0.5 text-xs font-normal">
            {shop.BarbershopServices.length} serviços
          </span>
        </div>
        <div className="text-muted-foreground flex flex-col gap-1 text-xs">
          <span className="flex items-center gap-1.5">
            <Mail className="h-3.5 w-3.5" /> {shop.email}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5" /> {shop.address}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center">
        {/* Botão de Ativar/Desativar */}
        <Button
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={handleToggleStatus}
          className={`flex items-center gap-1.5 ${
            shop.status === "ACTIVE"
              ? "text-amber-500 hover:bg-amber-500/10 hover:text-amber-600"
              : "text-emerald-500 hover:bg-emerald-500/10 hover:text-emerald-600"
          }`}
        >
          <Power className="h-4 w-4" />
          {shop.status === "ACTIVE" ? "Desativar" : "Ativar"}
        </Button>

        {/* Botão de Deletar */}
        <Button
          variant="ghost"
          size="icon"
          disabled={loading}
          onClick={handleDelete}
          className="text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
