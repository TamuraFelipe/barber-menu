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
import { format, set, isToday } from "date-fns"
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
  bookingsTime: Date[]
  barbershop: Pick<Barbershop, "id" | "name">
}

const ServiceItem = ({
  service,
  barbershop,
  bookingsTime,
}: ServiceItemProps) => {
  const [selectedDay, setSelectedDay] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | undefined>(
    undefined,
  )
  const [dayBookings, setDayBookings] = useState<Booking[]>([])
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

  // --- NOVA LÓGICA DE FILTRAGEM DE HORÁRIOS ---

  // Gerador padrão de slots do seu expediente
  const slotsDoExpediente = generateTimeSlots({
    startTime: "08:00",
    endTime: "20:00",
    intervalInMinutes: 60,
    lunchStartTime: "12:00",
    lunchEndTime: "14:00",
    selectedDate: selectedDay || new Date(),
  })

  const getTimeList = (): string[] => {
    if (!selectedDay) return []

    return slotsDoExpediente.filter((time: string) => {
      const hour = Number(time.split(":")[0])
      const minute = Number(time.split(":")[1])

      // 1. Filtrar horários que já passaram no relógio (APENAS se o dia selecionado for hoje)
      if (isToday(selectedDay)) {
        const agora = new Date()
        const horaDoSlot = set(selectedDay, { hours: hour, minutes: minute })
        if (horaDoSlot < agora) {
          return false // Descarta horários do passado
        }
      }

      // 2. Filtrar horários que já estão reservados no banco de dados para este dia específico
      const jaEstaReservado = dayBookings.some((booking) => {
        const dataAgendamento = new Date(booking.date)
        return (
          dataAgendamento.getHours() === hour &&
          dataAgendamento.getMinutes() === minute
        )
      })

      return !jaEstaReservado
    })
  }

  // --- CONTROLE DE ESGOTAMENTO DE HOJE PARA DESABILITAR NO CALENDÁRIO ---

  const slotsDeHojeDisponiveis = slotsDoExpediente.filter((slot) => {
    const hour = Number(slot.split(":")[0])
    const minute = Number(slot.split(":")[1])

    // Se o slot já passou do horário de agora, não está disponível
    const agora = new Date()
    const slotDate = set(agora, { hours: hour, minutes: minute })
    if (slotDate < agora) return false

    // Se o slot já está reservado no banco para o dia de hoje
    const jaEstaReservadoNoBanco = bookingsTime.some((booking) => {
      const dataBooking = new Date(booking)
      const mesmoDia =
        dataBooking.getDate() === agora.getDate() &&
        dataBooking.getMonth() === agora.getMonth() &&
        dataBooking.getFullYear() === agora.getFullYear()

      return mesmoDia && format(dataBooking, "HH:mm") === slot
    })

    return !jaEstaReservadoNoBanco
  })

  const hojeEstaEsgotado = slotsDeHojeDisponiveis.length === 0

  const today = new Date()
  const disabledDays = [{ before: today }, ...(hojeEstaEsgotado ? [today] : [])]

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
                      <div className="flex flex-wrap items-center gap-3">
                        {getTimeList().map((time) => (
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
