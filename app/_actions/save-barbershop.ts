"use server"

import { db } from "../_lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/auth"

const DEFAULT_BARBERSHOP_IMAGE =
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1000&auto=format&fit=crop"

interface SaveServiceParams {
  id?: string
  name: string
  description: string
  imageUrl: string
  price: number
}

interface SaveBarbershopParams {
  id?: string
  name: string
  email: string
  address: string
  description: string
  phones: string[]
  imageUrl?: string
  services: SaveServiceParams[]
}

export const saveBarbershop = async (params: SaveBarbershopParams) => {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Não autorizado. Faça login para continuar.")
  }

  const { id, services, ...barbershopData } = params

  let barbershop

  if (id) {
    // 1. Tratamento da imagem principal
    if (!barbershopData.imageUrl || barbershopData.imageUrl.trim() === "") {
      delete barbershopData.imageUrl
    }

    // 2. Transação atômica do Prisma (deleta os removidos e atualiza os persistentes/novos)
    barbershop = await db.$transaction(async (tx) => {
      // Deleta do banco os serviços que não constam mais no array vindo do formulário
      const updatedServiceIds = services
        .map((s) => s.id)
        .filter(Boolean) as string[]

      await tx.barbershopService.deleteMany({
        where: {
          barbershopId: id,
          id: {
            notIn: updatedServiceIds,
          },
        },
      })

      // Upsert nos serviços restantes (atualiza se já tem ID, cria se for novo)
      for (const service of services) {
        if (service.id) {
          await tx.barbershopService.update({
            where: { id: service.id },
            data: {
              name: service.name,
              description: service.description,
              imageUrl: service.imageUrl,
              price: service.price,
            },
          })
        } else {
          await tx.barbershopService.create({
            data: {
              name: service.name,
              description: service.description,
              imageUrl: service.imageUrl,
              price: service.price,
              barbershopId: id,
            },
          })
        }
      }

      const isProfileComplete =
        barbershopData.imageUrl &&
        barbershopData.imageUrl.trim() !== "" &&
        barbershopData.address !== "Endereço pendente de preenchimento"

      const updatedStatus = isProfileComplete ? "ACTIVE" : "PENDING"

      // Atualiza a barbearia em si
      return await tx.barbershop.update({
        where: { id },
        data: { ...barbershopData, status: updatedStatus },
      })
    })
  } else {
    // ---- REGRA DE CADASTRO ----
    const finalImageUrl =
      barbershopData.imageUrl && barbershopData.imageUrl.trim() !== ""
        ? barbershopData.imageUrl
        : DEFAULT_BARBERSHOP_IMAGE

    barbershop = await db.barbershop.create({
      data: {
        ...barbershopData,
        imageUrl: finalImageUrl,
        userId: session.user.id,
        // Cria a barbearia e insere todos os serviços informados de uma vez só
        services: {
          createMany: {
            data: services.map((service) => ({
              name: service.name,
              description: service.description,
              imageUrl: service.imageUrl,
              price: service.price,
            })),
          },
        },
      },
    })
  }

  revalidatePath("/dashboard")
  if (id) {
    revalidatePath(`/barbershops/${id}`)
  }

  return barbershop
}
