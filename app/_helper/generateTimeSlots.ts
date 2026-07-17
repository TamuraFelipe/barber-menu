import { isToday } from "date-fns"

interface GenerateTimeSlotsProps {
  startTime: string
  endTime: string
  intervalInMinutes: number
  lunchStartTime?: string | null
  lunchEndTime?: string | null
  selectedDate: Date // <-- Adicionamos a data selecionada como obrigatória
}
export const generateTimeSlots = ({
  startTime,
  endTime,
  intervalInMinutes,
  lunchStartTime,
  lunchEndTime,
  selectedDate, // <-- Recebemos aqui
}: GenerateTimeSlotsProps): string[] => {
  const slots: string[] = []
  const [startHours, startMinutes] = startTime.split(":").map(Number)
  const [endHours, endMinutes] = endTime.split(":").map(Number)
  let currentMinutes = startHours * 60 + startMinutes
  const finalMinutes = endHours * 60 + endMinutes

  let lunchStartMinutes = null
  let lunchEndMinutes = null

  if (lunchStartTime && lunchEndTime) {
    const [lStartH, lStartM] = lunchStartTime.split(":").map(Number)
    const [lEndH, lEndM] = lunchEndTime.split(":").map(Number)
    lunchStartMinutes = lStartH * 60 + lStartM
    lunchEndMinutes = lEndH * 60 + lEndM
  }

  // 1. Pegamos a hora e minuto atual apenas se a data selecionada for HOJE
  const isSelectedDateToday = isToday(selectedDate)
  let nowMinutes = 0
  if (isSelectedDateToday) {
    const now = new Date()
    nowMinutes = now.getHours() * 60 + now.getMinutes()
  }

  while (currentMinutes <= finalMinutes) {
    // Pula o horário de almoço
    if (
      lunchStartMinutes !== null &&
      lunchEndMinutes !== null &&
      currentMinutes >= lunchStartMinutes &&
      currentMinutes < lunchEndMinutes
    ) {
      currentMinutes = lunchEndMinutes
      continue
    }

    // 2. Nova validação: Se for hoje e o horário do slot já passou ou é IGUAL ao minuto atual, pula ele
    if (isSelectedDateToday && currentMinutes <= nowMinutes) {
      currentMinutes += intervalInMinutes
      continue
    }

    const hours = Math.floor(currentMinutes / 60)
    const minutes = currentMinutes % 60
    const formattedTime = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
    slots.push(formattedTime)

    currentMinutes += intervalInMinutes
  }

  return slots
}
