"use client"

import { Sheet, SheetContent, SheetHeader } from "./ui/sheet"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Badge } from "./ui/badge"
import { format } from "date-fns"
import { Avatar, AvatarImage } from "./ui/avatar"
import { ptBR } from "date-fns/locale"
import { Button } from "./ui/button"
import PhoneItem from "./phone-item"
import { useEffect, useState } from "react"
import { deleteBooking } from "../_actions/delete-booking"
import { toast } from "sonner"

interface Booking {
  id: string
  date: Date
  barbershop: {
    name: string
    imageUrl: string
    address?: string
    description?: string
    phones?: string[]
  }
  service: {
    name: string
    price: number
  }
}

interface BookingsContentProps {
  confirmados: Booking[]
  finalizados: Booking[]
}

const BookingsContent = ({ confirmados }: BookingsContentProps) => {
  const [open, setOpen] = useState(false)
  const [openDetail, setOpenDetail] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [booking, setBooking] = useState<Booking | undefined>(undefined)

  const handleOpenDetailClick = (booking: Booking) => {
    if (!isDesktop) {
      setOpen(true)
      setBooking(booking)
    } else {
      setBooking(booking)
      setOpenDetail(true)
    }
  }
  const handleCancelBooking = (id: string) => {
    toast.warning("Agendamento cancelado com sucesso!")
    deleteBooking(id)
  }

  useEffect(() => {
    const handleSize = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }

    handleSize()

    window.addEventListener("resize", handleSize)

    return () => {
      window.removeEventListener("resize", handleSize)
    }
  }, [])

  return (
    <div className="mt-6 xl:grid xl:grid-cols-[1fr_386px] xl:gap-10">
      <div className="space-y-9 lg:col-span-2">
        <div>
          <h2 className="mb-3 text-sm font-bold tracking-wider text-gray-400 uppercase">
            Confirmados
          </h2>
          <div className="gap-3 lg:grid lg:grid-cols-[1fr_386px] lg:gap-10">
            {confirmados.length > 0 ? (
              <div className="flex flex-col gap-3 space-y-3">
                {confirmados.map((booking, index) => (
                  <button
                    key={index}
                    onClick={() => handleOpenDetailClick(booking)}
                  >
                    <Card className="p-0">
                      <CardContent className="p-0">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col items-start gap-2 py-5 pl-5">
                            <Badge>Confirmado</Badge>
                            <h3 className="font-semibold">
                              {booking.service.name}
                            </h3>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage
                                  src={booking.barbershop.imageUrl}
                                />
                              </Avatar>
                              <p className="text-sm">
                                {booking.barbershop.name}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-center justify-center border-l-2 border-solid px-5">
                            <p className="tex-sm capitalize">
                              {format(booking.date, "MMMM", {
                                locale: ptBR,
                              })}
                            </p>
                            <p className="text-3xl">
                              {format(booking.date, "dd")}
                            </p>
                            <p className="text-sm">
                              {format(booking.date, "HH:mm")}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">
                Você não tem agendamentos futuros.
              </p>
            )}

            <Sheet open={open} onOpenChange={setOpen}>
              <SheetContent>
                {booking && (
                  <>
                    <SheetHeader>
                      <h2 className="text-lg font-bold">
                        Informações da Reserva
                      </h2>
                    </SheetHeader>

                    <div className="flex h-full flex-col justify-between gap-6 px-6 py-6">
                      <div className="space-y-6">
                        <div className="bg-no-repeat] flex h-45 w-83.75 items-end justify-center rounded-lg bg-[url('/mapa.webp')] bg-cover bg-center px-5 py-5">
                          <div className="bg-secondary flex w-full items-center gap-3 rounded-lg px-5 py-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage
                                src={booking?.barbershop?.imageUrl}
                              />
                            </Avatar>
                            <div>
                              <p className="text-base font-bold">
                                {booking?.barbershop?.name}
                              </p>
                              <p className="text-sm">
                                {booking?.barbershop?.address}
                              </p>
                            </div>
                          </div>
                        </div>
                        <Badge>Confirmado</Badge>
                        <div>
                          <Card>
                            <CardContent className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h2 className="font-bold">
                                  {booking?.service.name}
                                </h2>
                                <p className="text-sm font-bold">
                                  {booking?.service.price.toLocaleString(
                                    "pt-BR",
                                    {
                                      style: "currency",
                                      currency: "BRL",
                                    },
                                  )}
                                </p>
                              </div>
                              <div className="flex items-center justify-between">
                                <h2 className="text-sm text-gray-400">Data</h2>
                                <p className="text-sm">
                                  {format(booking.date, "dd 'de' MMMM", {
                                    locale: ptBR,
                                  })}
                                </p>
                              </div>
                              <div className="flex items-center justify-between">
                                <h2 className="text-sm text-gray-400">
                                  Horário
                                </h2>
                                <p className="text-sm">
                                  {format(booking.date, "HH:mm")}
                                </p>
                              </div>
                              <div className="flex items-center justify-between">
                                <h2 className="text-sm text-gray-400">
                                  Barbearia
                                </h2>
                                <p className="text-sm">
                                  {booking?.barbershop.name}
                                </p>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                        <div>
                          <div className="mt-5"></div>
                          {/* <div className="space-y-3 border-b border-solid py-5">
                            {booking.barbershop.phones?.map((phone) => (
                              <PhoneItem key={phone} phone={phone} />
                            ))}
                          </div> */}
                        </div>
                        <div className="space-y-3">
                          {booking?.barbershop.phones?.map((phone) => (
                            <PhoneItem key={phone} phone={phone} />
                          ))}
                        </div>
                      </div>
                      <Button variant="destructive" className="w-full">
                        Cancelar Reserva
                      </Button>
                    </div>
                  </>
                )}
              </SheetContent>
            </Sheet>

            {booking && openDetail && (
              <Card>
                <CardContent className="p-5">
                  <CardHeader className="p-0">
                    <div className="bg-no-repeat] flex h-45 w-86.5 items-end justify-center rounded-lg bg-[url('/mapa.webp')] bg-cover bg-center px-5 py-5">
                      <div className="bg-secondary flex w-full items-center gap-3 rounded-lg px-5 py-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={booking?.barbershop?.imageUrl} />
                        </Avatar>
                        <div>
                          <p className="text-base font-bold">
                            {booking?.barbershop?.name}
                          </p>
                          <p className="text-sm">
                            {booking?.barbershop?.address}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <div>
                    <div className="mt-5 border-b border-solid pb-5">
                      <p className="mb-2.5 text-sm font-bold">Sobre nós</p>
                      <p className="text-sm">
                        {booking?.barbershop?.description}
                      </p>
                    </div>
                    <div className="space-y-3 border-b border-solid py-5">
                      {booking?.barbershop.phones?.map((phone) => (
                        <PhoneItem key={phone} phone={phone} />
                      ))}
                    </div>
                    <div className="mt-5 border-b border-solid pb-5">
                      <Card>
                        <CardContent className="space-y-3">
                          <div className="flex items-center justify-between">
                            <h2 className="font-bold">
                              {booking?.service.name}
                            </h2>
                            <p className="text-sm font-bold">
                              {Number(booking?.service.price).toLocaleString(
                                "pt-BR",
                                {
                                  style: "currency",
                                  currency: "BRL",
                                },
                              )}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <h2 className="text-sm text-gray-400">Data</h2>
                            <p className="text-sm">
                              {format(booking.date, "dd 'de' MMMM", {
                                locale: ptBR,
                              })}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <h2 className="text-sm text-gray-400">Horário</h2>
                            <p className="text-sm">
                              {format(booking.date, "HH:mm")}
                            </p>
                          </div>
                          <div className="flex items-center justify-between">
                            <h2 className="text-sm text-gray-400">Barbearia</h2>
                            <p className="text-sm">
                              {booking?.barbershop.name}
                            </p>
                          </div>
                        </CardContent>
                        <CardFooter>
                          <Button
                            variant="destructive"
                            className="w-full"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            Cancelar Reserva
                          </Button>
                        </CardFooter>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Finalizados */}
        {/* <div>
          <h2 className="mb-3 text-sm font-bold tracking-wider text-gray-400 uppercase">
            Finalizados
          </h2>
          {finalizados.length > 0 ? (
            <div className="space-y-3 opacity-70">
              {finalizados.map((booking) => (
                <BookingItem
                  key={booking.id}
                  agendamento={booking}
                  onClick={() => handleSelectBooking(booking, true)}
                  isActive={selectedBooking?.id === booking.id}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400">
              Nenhum agendamento antigo encontrado.
            </p>
          )}
        </div> */}
      </div>
    </div>
  )
}

export default BookingsContent
