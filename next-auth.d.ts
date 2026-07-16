import { DefaultSession, DefaultUser } from "next-auth"
import { JWT as DefaultJWT } from "next-auth/jwt"

// Estende as tipagens padrão do NextAuth
declare module "next-auth" {
  interface User extends DefaultUser {
    role?: string // ou o seu enum 'ADMIN' | 'BARBER' | 'USER' se preferir expor o enum aqui
  }

  interface Session {
    user: {
      id: string
      role?: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id?: string
    role?: string
  }
}
