import { db } from "../_lib/prisma"
import { daysOfWeek } from "../_constants/daysOfWeek"
const HourItem = async ({ barbershopId }: { barbershopId: string }) => {
  const diasOrdenados = [1, 2, 3, 4, 5, 6, 0]
  const openingHours = await db.barbershopOpeningHour.findMany({
    where: {
      barbershopId: barbershopId,
    },
    orderBy: {
      dayOfWeek: "asc",
    },
  })
  return (
    <ul className="space-y-3">
      {diasOrdenados.map((dia) => {
        const diaSemana = daysOfWeek[dia]
        const horaAbertura = openingHours.find(
          (hour) => hour.dayOfWeek === dia,
        )?.openTime
        const horaFechamento = openingHours.find(
          (hour) => hour.dayOfWeek === dia,
        )?.closeTime
        return (
          <li key={dia}>
            <div className="flex justify-between">
              <span>{diaSemana}</span>
              <span>
                {horaAbertura && horaFechamento
                  ? `${horaAbertura} - ${horaFechamento}`
                  : "Fechado"}
              </span>
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default HourItem
