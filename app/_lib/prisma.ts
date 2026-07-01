import { PrismaPg } from "@prisma/adapter-pg"
import { PrismaClient } from "@prisma/client"
import { env } from "prisma/config"

declare global {
  var cachedPrisma: PrismaClient
}
const adapter = new PrismaPg({
  connectionString: env("DATABASE_URL"),
})
let prisma: PrismaClient
if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient({ adapter })
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient({ adapter })
  }
  prisma = global.cachedPrisma
}

export const db = prisma
