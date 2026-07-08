const HOUR_WORK: Record<
  string,
  { fechado: boolean; abertura?: string; fechamento?: string }
> = {
  "1": { fechado: true },
  "2": { fechado: false, abertura: "08:00", fechamento: "20:00" },
  "3": { fechado: false, abertura: "08:00", fechamento: "20:00" },
  "4": { fechado: false, abertura: "08:00", fechamento: "20:00" },
  "5": { fechado: false, abertura: "08:00", fechamento: "20:00" },
  "6": { fechado: false, abertura: "08:00", fechamento: "17:00" },
  "0": { fechado: true },
}
const diasSemana: Record<string, string> = {
  "1": "Segunda-feira",
  "2": "Terça-feira",
  "3": "Quarta-feira",
  "4": "Quinta-feira",
  "5": "Sexta-feira",
  "6": "Sábado",
  "0": "Domingo",
}
const HourItem = () => {
  const diasOrdenados = ["1", "2", "3", "4", "5", "6", "0"]
  return (
    <ul className="space-y-3">
      {diasOrdenados &&
        diasOrdenados.map((dia) => {
          const dadosDoDia = HOUR_WORK[dia]
          const nomeDoDia = diasSemana[dia]

          return (
            <li key={dia} className="flex items-center justify-between">
              <p className="text-sm text-gray-300">{nomeDoDia}</p>
              {dadosDoDia.fechado ? (
                <p className="text-sm text-gray-300">Fechado</p>
              ) : (
                <p className="text-sm text-gray-300">
                  {dadosDoDia.abertura} - {dadosDoDia.fechamento}
                </p>
              )}
            </li>
          )
        })}
    </ul>
  )
}

export default HourItem
