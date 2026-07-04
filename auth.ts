import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"

import { db } from "@/app/_lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  adapter: PrismaAdapter(db),

  //Ativa a estratégia de JWT necessária para login com credentials
  session: {
    strategy: "jwt",
  },

  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        //1.Busca o usuário
        const user = await db.user.findUnique({
          where: {
            email: credentials.email as string,
          },
        })
        //2.Se o o usuário não existir ou não tiver senha cadastrada
        if (!user || !user.password) {
          return null
        }
        //3.Compara a senha digitada com a senha cadastrada
        const passwordMatch = await bcrypt.compare(
          credentials.password as string,
          user.password,
        )

        if (!passwordMatch) {
          return null
        }

        //4.Retorna o usuário
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        }
      },
    }),
  ],
  callbacks: {
    // 1. Salva a imagem do usuário que veio do banco de dados dentro do Token JWT
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.image = user.image
      }
      if (trigger === "update" && session) {
        if (session.name) token.name = session.name
        if (session.image) token.image = session.image
      }
      return token
    },

    // 2. Repassa a imagem armazenada no JWT diretamente para a Sessão que o front-end lê
    async session({ session, token }) {
      if (session.user) {
        session.user.name = token.name as string
        session.user.image = token.image as string
      }
      return session
    },
  },
})
