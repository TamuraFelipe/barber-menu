import "dotenv/config"

import cron from "node-cron"
import { db } from "../app/_lib/prisma"

cron.schedule("0,15,30,45 * * * *", async () => {
  console.log("Executando cron...")

  await db.booking.updateMany({
    where: {
      status: "CONFIRMED",
      date: {
        lt: new Date(),
      },
    },
    data: {
      status: "FINISHED",
    },
  })

  console.log(
    "Concluído!",
    new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    }),
  )
})
