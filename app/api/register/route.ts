import { db } from "@/app/_lib/prisma"
import bcrypt from "bcryptjs"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, password, image } = body

    console.log(body)
    //1.Validação básica de campos
    if (!name || !email || !password) {
      return NextResponse.json(
        {
          error: "Preencha todos os campos",
        },
        {
          status: 400,
        },
      )
    }

    //2.Verifica se o usuário ja existe
    const userExists = await db.user.findUnique({
      where: {
        email,
      },
    })
    if (userExists) {
      return NextResponse.json(
        {
          error: "Usuário ja cadastrado",
        },
        {
          status: 400,
        },
      )
    }

    //3.Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 12)

    //4.Cria o usuário
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        image,
      },
    })

    //5.Retorna o usuário criado
    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      {
        error: "Erro ao cadastrar usuário",
      },
      {
        status: 500,
      },
    )
  }
}
