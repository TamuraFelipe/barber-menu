// app/_actions/create-barber-admin.ts
"use server"

import { db } from "@/app/_lib/prisma"
import bcrypt from "bcryptjs" // ou o método que você usa para hash de senha
import { revalidatePath } from "next/cache"

interface CreateBarberAdminInput {
  name: string
  email: string
  passwordHash: string // Senha pura vinda do formulário que vamos hashear aqui
}

export async function createBarberAdmin(data: CreateBarberAdminInput) {
  try {
    // 1. Verifica se o usuário administrador já existe
    const userExists = await db.user.findUnique({
      where: { email: data.email },
    })

    if (userExists) {
      throw new Error("Este e-mail já está cadastrado no sistema.")
    }

    // 2. Cria o hash da senha
    const hashedPassword = await bcrypt.hash(data.passwordHash, 10)

    // 3. Cria o usuário com a role adequada (ex: "BARBER_ADMIN" ou similar se você usar roles, ou apenas User comum)
    const user = await db.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword, // Ajuste para o nome do campo de senha do seu Schema
        // role: "BARBER" // se você tiver controle de roles
      },
    })

    // 4. Cria o registro base da Barbearia vinculada a esse usuário
    await db.barbershop.create({
      data: {
        name: data.name,
        email: data.email,
        address: "Endereço pendente de preenchimento", // Valor temporário
        description: "Descrição pendente de preenchimento", // Valor temporário
        imageUrl: "", // Aguardando upload do admin da barbearia
        userId: user.id, // Vínculo com o usuário recém-criado
      },
    })

    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error) {
    // Remova o ": any" aqui, o TS já infere como "unknown"
    console.error(error)

    // Verifica de forma segura se o erro é uma instância de Error
    const errorMessage =
      error instanceof Error ? error.message : "Erro desconhecido."

    return {
      success: false,
      error: errorMessage,
    }
  }
}
export async function toggleBarbershopStatus(
  id: string,
  currentStatus: "ACTIVE" | "PENDING",
) {
  try {
    const newStatus = currentStatus === "ACTIVE" ? "PENDING" : "ACTIVE"

    await db.barbershop.update({
      where: { id },
      data: { status: newStatus },
    })

    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false }
  }
}

export async function deleteBarbershop(id: string) {
  try {
    await db.barbershop.delete({
      where: { id },
    })

    revalidatePath("/admin/dashboard")
    return { success: true }
  } catch (error) {
    console.error(error)
    return { success: false }
  }
}
