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
  const [loading, setLoading] = useState(false)

  // 👇 Estados de alerta separados para não conflitar mobile e desktop
  const [openMobileAlert, setOpenMobileAlert] = useState(false)
  const [openDesktopAlert, setOpenDesktopAlert] = useState(false)

  const handleOpenDetailClick = (booking: Booking) => {
    if (!isDesktop) {
      setOpen(true)
      setBooking(booking)
    } else {
      setBooking(booking)
      setOpenDetail(true)
    }
  }

  const handleCancelBooking = async (id: string, isFromDesktop: boolean) => {
    try {
      setLoading(true)
      await deleteBooking(id)

      toast.warning("Agendamento cancelado com sucesso!")

      // 👇 Fecha exatamente o que o usuário estava usando e limpa a tela
      if (isFromDesktop) {
        setOpenDesktopAlert(false)
        setOpenDetail(false)
      } else {
        setOpenMobileAlert(false)
        setOpen(false)
      }

      setBooking(undefined)
    } catch (error) {
      console.error(error)
      toast.error("Erro ao cancelar o agendamento.")
    } finally {
      setLoading(false)
    }
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
                {confirmados.map((bookingItem, index) => (
                  <button
                    key={index}
                    onClick={() => handleOpenDetailClick(bookingItem)}
                  >
                    <Card className="p-0">
                      <CardContent className="p-0">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col items-start gap-2 py-5 pl-5">
                            <Badge>Confirmado</Badge>
                            <h3 className="font-semibold">
                              {bookingItem.service.name}
                            </h3>
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarImage
                                  src={bookingItem.barbershop.imageUrl}
                                />
                              </Avatar>
                              <p className="text-sm">
                                {bookingItem.barbershop.name}
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-col items-center justify-center border-l-2 border-solid px-5">
                            <p className="tex-sm capitalize">
                              {format(bookingItem.date, "MMMM", {
                                locale: ptBR,
                              })}
                            </p>
                            <p className="text-3xl">
                              {format(bookingItem.date, "dd")}
                            </p>
                            <p className="text-sm">
                              {format(bookingItem.date, "HH:mm")}
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

            {/* 📱 VERSÃO MOBILE (Abre em Sheet) */}
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
                        <div className="flex h-45 w-83.75 items-end justify-center rounded-lg bg-[url('/mapa.webp')] bg-cover bg-center px-5 py-5">
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
                        <div className="space-y-3">
                          {booking?.barbershop.phones?.map((phone) => (
                            <PhoneItem key={phone} phone={phone} />
                          ))}
                        </div>
                      </div>

                      {/* Alerta controlado pelo estado Mobile */}
                      <AlertDialog
                        open={openMobileAlert}
                        onOpenChange={setOpenMobileAlert}
                      >
                        <AlertDialogTrigger
                          render={
                            <Button variant="destructive" className="w-full">
                              Cancelar Reserva
                            </Button>
                          }
                        />
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Deseja cancelar sua reserva?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita e a sua vaga será
                              liberada no sistema.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogCancel>Voltar</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-destructive hover:bg-destructive/90"
                            onClick={() =>
                              handleCancelBooking(booking.id, false)
                            }
                            disabled={loading}
                          >
                            Confirmar Cancelamento
                          </AlertDialogAction>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </>
                )}
              </SheetContent>
            </Sheet>

            {/* 🖥️ VERSÃO DESKTOP (Seção Lateral de Detalhes) */}
            {booking && openDetail && (
              <Card>
                <CardContent className="p-5">
                  <CardHeader className="p-0">
                    <div className="flex h-45 w-86.5 items-end justify-center rounded-lg bg-[url('/mapa.webp')] bg-cover bg-center px-5 py-5">
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
                          {/* Alerta controlado pelo estado Desktop */}
                          <AlertDialog
                            open={openDesktopAlert}
                            onOpenChange={setOpenDesktopAlert}
                          >
                            <AlertDialogTrigger
                              render={
                                <Button
                                  variant="destructive"
                                  className="w-full"
                                >
                                  Cancelar Reserva
                                </Button>
                              }
                            />
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Deseja cancelar sua reserva?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Esta ação não pode ser desfeita e a sua vaga
                                  será liberada no sistema.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogCancel>Voltar</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-destructive hover:bg-destructive/90"
                                onClick={() =>
                                  handleCancelBooking(booking.id, true)
                                }
                                disabled={loading}
                              >
                                Confirmar Cancelamento
                              </AlertDialogAction>
                            </AlertDialogContent>
                          </AlertDialog>
                        </CardFooter>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingsContent
