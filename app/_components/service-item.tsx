"use client"

import { Barbershop, BarbershopService, Booking } from "@prisma/client"
import Image from "next/image"
import Link from "next/link"
import { Button, buttonVariants } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "./ui/sheet"
import { Calendar } from "./ui/calendar"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { ptBR } from "date-fns/locale"
import { format, set } from "date-fns"
import { createBooking } from "../_actions/create-booking"
import { toast } from "sonner"
import { getBookings } from "../_actions/get-bookings"

interface ServiceItemProps {
  service: BarbershopService
  barbershop: Pick<Barbershop, "id" | "name">
}
interface GenerateTimeSlotsProps {
  startTime: string // ex: "08:00"
  endTime: string // ex: "18:00"
  intervalInMinutes: number // ex: 45
  lunchStartTime?: string // ex: "12:00" (Opcional)
  lunchEndTime?: string // ex: "13:00" (Opcional)
}
const ServiceItem = ({ service, barbershop }: ServiceItemProps) => {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined,
  )
  const [dayBookings, setDayBookings] = useState<Booking[]>([])

  const { data } = useSession()

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDay(date)
    setSelectedTime(undefined)
  }
  const handleTimeSelect = (time: string | undefined) => {
    setSelectedTime(time)
  }
  const generateTimeSlots = ({
    startTime,
    endTime,
    intervalInMinutes,
    lunchStartTime,
    lunchEndTime,
  }: GenerateTimeSlotsProps): string[] => {
    const slots: string[] = []

    // 1. Converter horários principais para minutos totais
    const [startHours, startMinutes] = startTime.split(":").map(Number)
    const [endHours, endMinutes] = endTime.split(":").map(Number)
    let currentMinutes = startHours * 60 + startMinutes
    const finalMinutes = endHours * 60 + endMinutes

    // 2. Converter horários de almoço (se existirem) para minutos totais
    let lunchStartMinutes = null
    let lunchEndMinutes = null

    if (lunchStartTime && lunchEndTime) {
      const [lStartH, lStartM] = lunchStartTime.split(":").map(Number)
      const [lEndH, lEndM] = lunchEndTime.split(":").map(Number)
      lunchStartMinutes = lStartH * 60 + lStartM
      lunchEndMinutes = lEndH * 60 + lEndM
    }

    // 3. Loop de geração
    while (currentMinutes <= finalMinutes) {
      // Verificação: O horário atual está dentro do intervalo de almoço?
      if (
        lunchStartMinutes !== null &&
        lunchEndMinutes !== null &&
        currentMinutes >= lunchStartMinutes &&
        currentMinutes < lunchEndMinutes
      ) {
        // Pula direto para o final do almoço para continuar gerando dali
        currentMinutes = lunchEndMinutes
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
  const handleCreateBooking = async () => {
    try {
      if (!selectedDay || !selectedTime) return

      const hour = selectedTime?.split(":")[0]
      const minute = selectedTime?.split(":")[1]
      const newData = set(selectedDay, {
        hours: Number(hour),
        minutes: Number(minute),
      })

      await createBooking({
        serviceId: service.id,
        userId: data?.user?.id as string,
        barbershopId: barbershop.id,
        date: newData,
      })

      toast.success("Agendamento criado com sucesso!")
    } catch (error) {
      console.log(error)
      toast.error("Erro ao criar agendamento!")
    }
  }
  const getTimeList = (bookings: Booking[]) => {
    const timeList = slotsTime.filter((time) => {
      const hour = Number(time.split(":")[0])
      const minute = Number(time.split(":")[1])
      if (
        bookings.some(
          (booking) =>
            booking.date.getHours() === hour &&
            booking.date.getMinutes() === minute,
        )
      ) {
        return false
      }
      return true
    })

    return timeList
  }
  const slotsTime = generateTimeSlots({
    startTime: "08:00",
    endTime: "20:00",
    intervalInMinutes: 60,
    lunchStartTime: "12:00",
    lunchEndTime: "14:00",
  })

  useEffect(() => {
    const fetch = async () => {
      if (!selectedDay) return
      const bookings = await getBookings({
        date: selectedDay,
        serviceId: service.id,
      })
      setDayBookings(bookings)
    }

    fetch()
  }, [selectedDay, service.id])

  return (
    <Card className="p-3">
      <CardContent key={service.id} className="flex items-center gap-3 p-0">
        <div className="relative h-27.5 max-h-27.5 w-27.5 max-w-27.5">
          <Image
            src={service.imageUrl}
            alt={service.name}
            className="rounded-xl object-cover"
            fill
            sizes="167px"
          />
        </div>

        <div className="w-full space-y-2">
          <h3 className="text-sm font-semibold">{service.name}</h3>
          <p className="text-muted-foreground text-sm">{service.description}</p>

          <div className="flex items-center justify-between">
            <p className="text-primary text-sm font-bold">
              {Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(Number(service.price))}
            </p>
            {!data?.user ? (
              <Link
                href={`/register`}
                className={`${buttonVariants({ variant: "secondary", size: "default" })}`}
              >
                Agendar
              </Link>
            ) : (
              <Sheet>
                <SheetTrigger
                  className={`${buttonVariants({ variant: "secondary", size: "default" })}`}
                >
                  Agendar
                </SheetTrigger>
                <SheetContent className="overflow-y-auto">
                  <SheetHeader>
                    <div>
                      <Image
                        src="/logo.png"
                        width={60}
                        height={4}
                        alt="Logo Barber Menu"
                        sizes="110px"
                      />
                    </div>
                  </SheetHeader>

                  <div className="border-b border-solid py-5">
                    <Calendar
                      mode="single"
                      locale={ptBR}
                      className="relative w-full bg-transparent"
                      selected={selectedDay}
                      onSelect={handleDateSelect}
                      startMonth={new Date()}
                      disabled={{ before: new Date() }}
                      classNames={{
                        months: "w-full",
                        month: "w-full space-y-4",
                        month_grid: "w-full border-collapse",
                        week: "flex w-full mt-2 justify-between",
                        day: "h-10 w-full p-0 font-normal aria-selected:opacity-100 flex items-center justify-center rounded-md",
                        day_button: [
                          "w-full h-full flex items-center justify-center rounded-md transition-colors",

                          "data-[selected]:bg-primary data-[selected]:text-primary-foreground data-[selected]:opacity-100",

                          "hover:!bg-primary hover:!text-primary-foreground hover:opacity-100",
                        ].join(" "),

                        button_previous:
                          "w-8 h-8 p-0 opacity-50 hover:opacity-100 flex items-center justify-center z-50 absolute left-0 top-0",
                        button_next:
                          "w-8 h-8 p-0 opacity-50 hover:opacity-100 flex items-center justify-center z-50 absolute right-0 top-0",
                        month_caption:
                          "text-sm font-medium capitalize flex justify-center py-2 relative items-center",
                        nav: "relative flex justify-center items-center justify-between gap-2 text-sm font-medium width-full",
                      }}
                    />
                  </div>

                  {selectedDay && (
                    <div className="border-b border-solid px-5 py-5">
                      <h3 className="mb-5 text-sm font-semibold">
                        Horários disponíveis
                      </h3>
                      <div className="flex flex-wrap items-center gap-3">
                        {getTimeList(dayBookings).map((time) => (
                          <Button
                            variant={
                              selectedTime === time ? "default" : "outline"
                            }
                            size="default"
                            key={time}
                            className="hover:bg-primary!"
                            onClick={() => handleTimeSelect(time)}
                          >
                            {time}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedDay && selectedTime && (
                    <div className="px-5">
                      <Card>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h2 className="font-bold">{service.name}</h2>
                            <p className="text-sm font-bold">
                              {Number(service.price).toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                              })}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <h2 className="text-sm text-gray-400">Data</h2>
                            <p className="text-sm">
                              {format(selectedDay, "dd 'de' MMMM", {
                                locale: ptBR,
                              })}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <h2 className="text-sm text-gray-400">Horário</h2>
                            <p className="text-sm">{selectedTime}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <h2 className="text-sm text-gray-400">Barbearia</h2>
                            <p className="text-sm">{barbershop.name}</p>
                          </div>
                        </CardContent>
                      </Card>

                      <SheetFooter className="px-0 py-5">
                        <Button onClick={handleCreateBooking}>Confirmar</Button>
                      </SheetFooter>
                    </div>
                  )}
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default ServiceItem
