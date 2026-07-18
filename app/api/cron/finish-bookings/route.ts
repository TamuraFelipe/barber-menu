import { NextResponse } from "next/server"
import { db } from "@/app/_lib/prisma"

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization")

  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse("Unauthorized", { status: 401 })
  }

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

  return NextResponse.json({
    success: true,
    executedAt: new Date(),
  })
}
