import { db } from "@/app/_lib/prisma"
import { auth } from "@/auth"
import { NextResponse } from "next/server"

export async function PUT(request: Request) {
  try {
    //1. verifica se usuario logado
    const session = await auth()
    if (!session)
      NextResponse.json({ error: "Não autorizado!" }, { status: 401 })

    //2.Busca o usuário completo
    const user = await db.user.findUnique({
      where: {
        email: session?.user?.email as string,
      },
    })
    if (!user)
      NextResponse.json({ error: "Usuário nao encontrado!" }, { status: 404 })

    //3.Trava de segurança: se não tiver senha, significa que foi criado via Google
    if (!user?.password)
      NextResponse.json(
        {
          error: "Perfis vinculados ao Google não podem ser editados por aqui.",
        },
        { status: 404 },
      )

    //4.Captura os dados enviados pelo formulário de edição
    const body = await request.json()
    const { name, email, image } = body

    //5.Validação opcional: Se ele estiver mudando o e-mail, verifica se ele ja existe
    if (email && email !== user?.email) {
      const userExists = await db.user.findUnique({
        where: {
          email,
        },
      })
      if (userExists) {
        return NextResponse.json(
          {
            error: "Este e-mail já está em uso.",
          },
          {
            status: 400,
          },
        )
      }
    }

    //6.Atualiza os dados do usuário
    const updatedUser = await db.user.update({
      where: {
        id: user?.id as string,
      },
      data: {
        name: name || user?.name,
        email: email || user?.email,
        image: image || user?.image,
      },
    })

    return NextResponse.json({
      message: "Perfil atualizado com sucesso!",
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        image: updatedUser.image,
      },
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json(
      {
        error: "Ocorreu um erro ao atualizar o perfil.",
      },
      {
        status: 500,
      },
    )
  }
}
