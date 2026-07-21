"use client"

import {
  $Enums,
  Barbershop,
  BarbershopOpeningHour,
  BarbershopService,
  Booking,
} from "@prisma/client"
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
import { format, set, isToday, isSameDay, startOfDay } from "date-fns"
import { createBooking } from "../_actions/create-booking"
import { toast } from "sonner"
import { getBookings } from "../_actions/get-bookings"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"
import { generateTimeSlots } from "../_helper/generateTimeSlots"

interface ServiceItemProps {
  service: BarbershopService
  bookingsTime: Booking[]
  barbershop: Pick<Barbershop, "id" | "name">
  openingHours: BarbershopOpeningHour[]
}

const ServiceItem = ({
  service,
  barbershop,
  bookingsTime,
  openingHours,
}: ServiceItemProps) => {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined,
  )
  const [dayBookings, setDayBookings] = useState<Booking[]>([])
  const [loadingBookings, setLoadingBookings] = useState(false)
  const [loading, setLoading] = useState(false)
  const [openSheet, setOpenSheet] = useState(false)
  const [openAlert, setOpenAlert] = useState(false)

  const { data } = useSession()

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDay(date)
    setSelectedTime(undefined)
  }

  const handleTimeSelect = (time: string | undefined) => {
    setSelectedTime(time)
  }

  const handleSheetOpenChange = (isOpen: boolean) => {
    setOpenSheet(isOpen)
    if (!isOpen) {
      setSelectedDay(undefined)
      setSelectedTime(undefined)
    }
  }

  const handleCreateBooking = async () => {
    try {
      if (!selectedDay || !selectedTime) return

      setLoading(true)
      const hour = selectedTime.split(":")[0]
      const minute = selectedTime.split(":")[1]
      const newData = set(selectedDay, {
        hours: Number(hour),
        minutes: Number(minute),
      })

      const res = await createBooking({
        serviceId: service.id,
        userId: data?.user?.id as string,
        barbershopId: barbershop.id,
        date: newData,
      })

      setLoading(false)

      if (!res) {
        toast.error("Erro ao criar agendamento!")
        setOpenAlert(false)
        return
      }

      toast.success("Agendamento criado com sucesso!")

      setOpenAlert(false)
      setOpenSheet(false)
      setSelectedDay(undefined)
      setSelectedTime(undefined)
    } catch (error) {
      setLoading(false)
      console.log(error)
      toast.error("Erro ao criar agendamento!")
    }
  }

  const hoje = new Date()
  const diaDaSemanaHoje = hoje.getDay()

  const expedienteHoje = openingHours.find(
    (item) => item.dayOfWeek === diaDaSemanaHoje,
  )

  const slotsAtuaisDeHoje = generateTimeSlots({
    startTime: expedienteHoje?.openTime || "00:00",
    endTime: expedienteHoje?.closeTime || "00:00",
    intervalInMinutes: service.duration,
    lunchStartTime: expedienteHoje?.lunchStart,
    lunchEndTime: expedienteHoje?.lunchEnd,
    selectedDate: hoje,
  })

  const disponiveisHoje = slotsAtuaisDeHoje.filter((slot) => {
    const [hour, minute] = slot.split(":").map(Number)
    const slotDate = set(hoje, {
      hours: hour,
      minutes: minute,
      seconds: 0,
      milliseconds: 0,
    })

    // Descarta horários que já passaram
    if (slotDate.getTime() < hoje.getTime()) return false

    // Descarta horários agendados hoje
    const jaEstaReservado = bookingsTime?.some((booking) => {
      if (booking.status !== $Enums.BookingStatus.CONFIRMED) return false
      const dataBooking = new Date(booking.date)
      return (
        isSameDay(dataBooking, hoje) &&
        dataBooking.getHours() === hour &&
        dataBooking.getMinutes() === minute
      )
    })

    return !jaEstaReservado
  })

  // Se o dia não tem expediente ou não tem slots restantes, está esgotado
  const hojeEstaEsgotado = !expedienteHoje || disponiveisHoje.length === 0
  const hojeComHoraZerada = startOfDay(hoje)

  const disabledDays = [
    { before: hojeComHoraZerada },
    ...(hojeEstaEsgotado ? [hojeComHoraZerada] : []),
  ]

  const selectedOpeningHours = selectedDay
    ? openingHours.find(
        (openingHour) => openingHour.dayOfWeek === selectedDay.getDay(),
      )
    : undefined

  const slotsDoExpediente = selectedDay
    ? generateTimeSlots({
        startTime: selectedOpeningHours?.openTime || "00:00",
        endTime: selectedOpeningHours?.closeTime || "00:00",
        intervalInMinutes: service.duration,
        lunchStartTime: selectedOpeningHours?.lunchStart,
        lunchEndTime: selectedOpeningHours?.lunchEnd,
        selectedDate: selectedDay,
      })
    : []

  const getTimeList = () => {
    if (!selectedDay) return []

    return slotsDoExpediente.filter((time: string) => {
      const [hour, minute] = time.split(":").map(Number)

      if (isToday(selectedDay)) {
        const agora = new Date()
        const horaDoSlot = set(selectedDay, { hours: hour, minutes: minute })
        if (horaDoSlot.getTime() < agora.getTime()) return false
      }

      const jaEstaReservado = dayBookings.some((booking) => {
        if (booking.status !== $Enums.BookingStatus.CONFIRMED) return false
        const dataAgendamento = new Date(booking.date)
        return (
          dataAgendamento.getHours() === hour &&
          dataAgendamento.getMinutes() === minute
        )
      })

      return !jaEstaReservado
    })
  }

  useEffect(() => {
    const fetch = async () => {
      if (!selectedDay) return

      setLoadingBookings(true) // 1. Marca como carregando antes da requisição
      setDayBookings([]) // Limpa os horários do dia anterior para não dar flash

      try {
        const bookings = await getBookings({
          date: selectedDay,
          serviceId: service.id,
        })
        setDayBookings(bookings)
      } finally {
        setLoadingBookings(false) // 2. Termina de carregar
      }
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
                href={`/login`}
                className={`${buttonVariants({ variant: "secondary", size: "default" })}`}
              >
                Agendar
              </Link>
            ) : (
              <Sheet open={openSheet} onOpenChange={handleSheetOpenChange}>
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
                      disabled={disabledDays}
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
                        Horários disponíveis
                      </h3>
                      {loadingBookings ? (
                        <p className="text-muted-foreground text-sm">
                          Carregando horários...
                        </p>
                      ) : getTimeList().length > 0 ? (
                        <div className="flex flex-wrap items-center gap-3">
                          {getTimeList().map((time) =>
                            time !== "00:00" ? (
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
                            ) : (
                              <p key={time}>Fechado</p>
                            ),
                          )}
                        </div>
                      ) : (
                        <p className="text-muted-foreground text-sm">
                          Não há horários disponíveis para este dia.
                        </p>
                      )}
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
                        <AlertDialog
                          open={openAlert}
                          onOpenChange={setOpenAlert}
                        >
                          <AlertDialogTrigger
                            render={
                              <Button variant="default">Confirmar</Button>
                            }
                          />
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Confirmar agendamento?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Você pode ver seu agendamentos na aba
                                Agendamentos após confirmar!.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={handleCreateBooking}
                              disabled={loading}
                            >
                              Confirmar
                            </AlertDialogAction>
                          </AlertDialogContent>
                        </AlertDialog>
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
