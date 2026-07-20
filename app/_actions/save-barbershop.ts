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
  duration: number
}

interface SaveOpeningHourParams {
  id?: string
  dayOfWeek: number
  isClosed: boolean
  openTime?: string | null
  closeTime?: string | null
  lunchStart?: string | null
  lunchEnd?: string | null
}

interface SaveBarbershopParams {
  id?: string
  name: string
  email: string
  address: string
  description: string
  phones: string[]
  imageUrl?: string
  openingHours: SaveOpeningHourParams[]
  services: SaveServiceParams[]
}

export const saveBarbershop = async (params: SaveBarbershopParams) => {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("Não autorizado. Faça login para continuar.")
  }

  const { id, services, openingHours, ...barbershopData } = params

  let barbershop

  if (id) {
    // 1. Tratamento da imagem principal
    if (!barbershopData.imageUrl || barbershopData.imageUrl.trim() === "") {
      delete barbershopData.imageUrl
    }

    // 2. Transação atômica do Prisma
    barbershop = await db.$transaction(async (tx) => {
      // --- GERENCIAMENTO DOS SERVIÇOS ---
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

      // Upsert nos serviços restantes (atualiza se tem ID, cria se for novo)
      for (const service of services) {
        if (service.id) {
          await tx.barbershopService.update({
            where: { id: service.id },
            data: {
              name: service.name,
              description: service.description,
              imageUrl: service.imageUrl,
              price: service.price,
              duration: service.duration,
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
              duration: service.duration,
            },
          })
        }
      }

      // --- GERENCIAMENTO DOS HORÁRIOS DE FUNCIONAMENTO ---
      // 1. Apaga todos os horários antigos desta barbearia
      await tx.barbershopOpeningHour.deleteMany({
        where: { barbershopId: id },
      })

      // 2. Insere os 7 dias de funcionamento limpos
      if (openingHours && openingHours.length > 0) {
        await tx.barbershopOpeningHour.createMany({
          data: openingHours.map((hour) => ({
            barbershopId: id,
            dayOfWeek: hour.dayOfWeek,
            isClosed: hour.isClosed,
            openTime: hour.isClosed ? null : hour.openTime,
            closeTime: hour.isClosed ? null : hour.closeTime,
            lunchStart: hour.isClosed ? null : hour.lunchStart,
            lunchEnd: hour.isClosed ? null : hour.lunchEnd,
          })),
        })
      }

      const isProfileComplete =
        barbershopData.imageUrl &&
        barbershopData.imageUrl.trim() !== "" &&
        barbershopData.address !== "Endereço pendente de preenchimento"

      const updatedStatus = isProfileComplete ? "ACTIVE" : "PENDING"

      // Atualiza os dados principais da barbearia
      return await tx.barbershop.update({
        where: { id },
        data: { ...barbershopData, status: updatedStatus },
      })
    })
  } else {
    // ---- REGRA DE CADASTRO (NOVA BARBEARIA) ----
    const finalImageUrl =
      barbershopData.imageUrl && barbershopData.imageUrl.trim() !== ""
        ? barbershopData.imageUrl
        : DEFAULT_BARBERSHOP_IMAGE

    barbershop = await db.barbershop.create({
      data: {
        ...barbershopData,
        imageUrl: finalImageUrl,
        userId: session.user.id,
        // Cria os serviços da nova barbearia
        BarbershopServices: {
          createMany: {
            data: services.map((service) => ({
              name: service.name,
              description: service.description,
              imageUrl: service.imageUrl,
              price: service.price,
              duration: service.duration,
            })),
          },
        },
        // Cria os horários de funcionamento da nova barbearia usando a relação do seu schema
        openingHours: {
          createMany: {
            data: openingHours.map((hour) => ({
              dayOfWeek: hour.dayOfWeek,
              isClosed: hour.isClosed,
              openTime: hour.isClosed ? null : hour.openTime,
              closeTime: hour.isClosed ? null : hour.closeTime,
              lunchStart: hour.isClosed ? null : hour.lunchStart,
              lunchEnd: hour.isClosed ? null : hour.lunchEnd,
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
