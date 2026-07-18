"use client"

import { toast } from "sonner"
import { cancelBooking } from "../_actions/cancel-booking"
import { finishBooking } from "../_actions/finished-booking"
import { Button } from "./ui/button"
import { $Enums } from "@prisma/client"

interface BarberBookingItemProps {
  booking: {
    id: string
    service: { name: string }
    user: { name: string }
    date: string
    status: $Enums.BookingStatus
  }
}

const BarberBookingItem = ({ booking }: BarberBookingItemProps) => {
  const handleCancelBooking = async (id: string) => {
    try {
      const result = await cancelBooking(id)

      if (result) {
        toast.success("Agendamento cancelado com sucesso!")
      }
    } catch (error) {
      console.error(error)
      toast.error("Erro ao cancelar o agendamento.")
    }
  }
  const handleFinishBooking = async (id: string) => {
    try {
      const result = await finishBooking(id)

      if (result) {
        toast.success("Agendamento finalizado com sucesso!")
      }
    } catch (error) {
      console.error(error)
      toast.error("Erro ao finalizar o agendamento.")
    }
  }
  enum BookingStatus {
    CONFIRM = "Confirmado",
    CANCELED = "Cancelado",
    FINISHED = "Finalizado",
  }
  const bookingStatus = (status: $Enums.BookingStatus) => {
    switch (status) {
      case $Enums.BookingStatus.CONFIRMED:
        return BookingStatus.CONFIRM
      case $Enums.BookingStatus.CANCELED:
        return BookingStatus.CANCELED
      case $Enums.BookingStatus.FINISHED:
        return BookingStatus.FINISHED
    }
  }
  const statusColor = (status: $Enums.BookingStatus) => {
    switch (status) {
      case $Enums.BookingStatus.CONFIRMED:
        return "border border-amber-500/20 bg-amber-500/10 text-amber-500"
      case $Enums.BookingStatus.CANCELED:
        return "border border-red-500/20 bg-red-500/10 text-red-500"
      case $Enums.BookingStatus.FINISHED:
        return "border border-emerald-500/20 bg-emerald-500/10 text-emerald-500"
    }
  }

  return (
    <div>
      <div className="hover:bg-accent/30 flex flex-col items-end justify-end rounded-lg border p-4 transition-colors">
        <div className="flex w-full items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-4">
              <p className="text-sm font-bold">{booking.service.name}</p>
              <span
                className={`${statusColor(booking.status)} rounded-full px-2 py-0.5 text-xs font-medium`}
              >
                {bookingStatus(booking.status)}
              </span>
            </div>
            <p className="text-muted-foreground text-xs">
              Cliente: {booking.user.name}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">
              {new Date(booking.date).toLocaleDateString("pt-BR")}
            </p>
            <p className="text-muted-foreground text-xs">
              {new Date(booking.date).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>
        <div className="mt-2 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => handleCancelBooking(booking.id)}
            disabled={
              booking.status === $Enums.BookingStatus.CANCELED ||
              booking.status === $Enums.BookingStatus.FINISHED
            }
          >
            Cancelar agendamento
          </Button>
          <Button
            variant="default"
            onClick={() => handleFinishBooking(booking.id)}
            disabled={
              booking.status === $Enums.BookingStatus.FINISHED ||
              booking.status === $Enums.BookingStatus.CANCELED ||
              new Date(booking.date) > new Date()
            }
          >
            Finalizar agendamento
          </Button>
        </div>
      </div>
    </div>
  )
}

export default BarberBookingItem
