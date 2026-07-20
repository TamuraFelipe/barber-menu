"use client"

import { Sheet, SheetContent, SheetHeader } from "./ui/sheet"
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card"
import { Badge } from "./ui/badge"
import { format } from "date-fns"
import { Avatar, AvatarImage } from "./ui/avatar"
import { ptBR } from "date-fns/locale"
import { Button, buttonVariants } from "./ui/button"
import PhoneItem from "./phone-item"
import { useEffect, useState } from "react"
import { cancelBooking } from "../_actions/cancel-booking"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"
import { BookingStatus, Prisma } from "@prisma/client"
import { Star } from "lucide-react"
import { reviewBooking } from "../_actions/review-booking"

// 1. Mantemos o seu tipo original gerado pelo Prisma
type BookingItemFromPrisma = Prisma.BookingGetPayload<{
  include: { barbershop: true; service: true }
}>

// 2. Criamos o tipo final substituindo o Decimal por number dentro de service e adicionando a avaliação opcional
export type BookingItem = Omit<BookingItemFromPrisma, "service"> & {
  service: Omit<BookingItemFromPrisma["service"], "price"> & {
    price: number
  }
  // 👇 Adicione o campo de review/rating aqui conforme a estrutura do seu banco
  rating?: number | null
}

// 3. Suas props agora utilizam o tipo corrigido!
interface BookingsContentProps {
  confirmados: BookingItem[]
  finalizados: BookingItem[]
  cancelados: BookingItem[]
}

const BookingsContent = ({
  confirmados,
  finalizados,
  cancelados,
}: BookingsContentProps) => {
  const [open, setOpen] = useState(false)
  const [openDetail, setOpenDetail] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [booking, setBooking] = useState<BookingItem | null>(null)
  const [loading, setLoading] = useState(false)
  const [currentRating, setCurrentRating] = useState(0)
  const [openMobileAlert, setOpenMobileAlert] = useState(false)
  const [openDesktopAlert, setOpenDesktopAlert] = useState(false)

  const handleOpenDetailClick = (booking: BookingItem) => {
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
      await cancelBooking(id)

      toast.warning("Agendamento cancelado com sucesso!")

      if (isFromDesktop) {
        setOpenDesktopAlert(false)
        setOpenDetail(false)
      } else {
        setOpenMobileAlert(false)
        setOpen(false)
      }

      setBooking(null)
    } catch (error) {
      console.error(error)
      toast.error("Erro ao cancelar o agendamento.")
    } finally {
      setLoading(false)
    }
  }
  const handleReviewBarbershop = async (
    id: string,
    isFromDesktop: boolean,
    rating: number,
    barbershopId: string,
  ) => {
    try {
      setLoading(true)
      await reviewBooking(id, rating, barbershopId)

      toast.warning("Obrigado pela avaliação!")

      if (isFromDesktop) {
        setOpenDesktopAlert(false)
        setOpenDetail(false)
      } else {
        setOpenMobileAlert(false)
        setOpen(false)
      }

      setBooking(null)
      setCurrentRating(0) // Reseta a nota selecionada
    } catch (error) {
      console.error(error)
      toast.error("Erro ao avaliar.")
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
    <div className="mt-6 items-start xl:grid xl:grid-cols-[1fr_386px] xl:gap-10">
      <div className="space-y-9">
        <div>
          <h2 className="mb-3 text-sm font-bold tracking-wider text-gray-400 uppercase">
            Confirmados
          </h2>
          <div>
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
                            <p className="text-sm capitalize">
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
                        {booking?.status === BookingStatus.CONFIRMED ? (
                          <Badge>Confirmado</Badge>
                        ) : (
                          <Badge className="bg-green-400">Finalizado</Badge>
                        )}
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

                      {/* 👇 CONTROLE DE BOTÕES BASEADO NO STATUS E SE JÁ FOI AVALIADO */}
                      {booking.status === BookingStatus.CONFIRMED ? (
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
                                Esta ação não pode ser desfeita e a sua vaga
                                será liberada no sistema.
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
                      ) : booking.rating ? (
                        /* 👇 CASO JÁ TENHA SIDO AVALIADO: Mostra um feedback estático em vez do botão */
                        <div className="bg-muted/40 flex flex-col items-center gap-2 rounded-lg p-4">
                          <p className="text-sm font-medium text-gray-400">
                            Você já avaliou este serviço
                          </p>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={18}
                                className={
                                  star <= booking.rating!
                                    ? "fill-amber-400 text-amber-400"
                                    : "text-muted-foreground opacity-20"
                                }
                              />
                            ))}
                          </div>
                        </div>
                      ) : (
                        /* 👇 CASO NÃO TENHA SIDO AVALIADO: Mostra o fluxo normal do botão e Alert */
                        <AlertDialog
                          open={openMobileAlert}
                          onOpenChange={setOpenMobileAlert}
                        >
                          <AlertDialogTrigger
                            render={
                              <Button variant="default" className="w-full">
                                Avaliar Barbearia
                              </Button>
                            }
                          />
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Avalie a Barbearia
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Escolha uma nota para avaliar a Barbearia (entre
                                1 e 5)
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="flex items-center justify-center gap-2 py-6">
                              {[1, 2, 3, 4, 5].map((starValue) => {
                                const isFilled = starValue <= currentRating

                                return (
                                  <button
                                    key={starValue}
                                    type="button"
                                    onClick={() => setCurrentRating(starValue)}
                                    className="transition-transform focus:outline-none active:scale-95"
                                  >
                                    <Star
                                      size={36}
                                      className={
                                        isFilled
                                          ? "fill-amber-400 text-amber-400"
                                          : "text-muted-foreground opacity-40"
                                      }
                                    />
                                  </button>
                                )
                              })}
                            </div>
                            <AlertDialogFooter className="flex-row items-center justify-end gap-3">
                              <AlertDialogCancel
                                onClick={() => setCurrentRating(0)}
                              >
                                Voltar
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className={`${buttonVariants({
                                  variant: "default",
                                })}`}
                                onClick={() =>
                                  handleReviewBarbershop(
                                    booking.id,
                                    false,
                                    currentRating,
                                    booking.barbershop.id,
                                  )
                                }
                                disabled={loading || currentRating === 0}
                              >
                                {loading ? "Enviando..." : "Enviar Avaliação"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </>
                )}
              </SheetContent>
            </Sheet>
          </div>

          <h2 className="my-3 text-sm font-bold tracking-wider text-gray-400 uppercase">
            Finalizados
          </h2>
          <div>
            {finalizados.length > 0 ? (
              <div className="flex flex-col gap-3 space-y-3">
                {finalizados.map((bookingItem, index) => (
                  <button
                    key={index}
                    onClick={() => handleOpenDetailClick(bookingItem)}
                  >
                    <Card className="p-0">
                      <CardContent className="p-0">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col items-start gap-2 py-5 pl-5">
                            <Badge className="bg-green-400">Finalizado</Badge>
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
                            <p className="text-sm capitalize">
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
                Nenhuma reserva finalizada
              </p>
            )}
          </div>

          <h2 className="my-3 text-sm font-bold tracking-wider text-gray-400 uppercase">
            Cancelados
          </h2>
          <div>
            {cancelados.length > 0 ? (
              <div className="flex flex-col gap-3 space-y-3">
                {cancelados.map((bookingItem, index) => (
                  <Card
                    className="bg-muted/20 p-0 opacity-60 grayscale-30"
                    key={index}
                  >
                    <CardContent className="p-0">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col items-start gap-2 py-5 pl-5">
                          <Badge className="bg-red-400">Cancelado</Badge>
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
                          <p className="text-sm capitalize">
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
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Nenhuma reserva cancelada</p>
            )}
          </div>
        </div>
      </div>
      {/* 🖥️ VERSÃO DESKTOP (Seção Lateral de Detalhes) */}
      {booking && openDetail && (
        <Card className="mt-7.5">
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
                    <p className="text-sm">{booking?.barbershop?.address}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <div>
              <div className="mt-5 border-b border-solid pb-5">
                <p className="mb-2.5 text-sm font-bold">Sobre nós</p>
                <p className="text-sm">{booking?.barbershop?.description}</p>
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
                      <h2 className="font-bold">{booking?.service.name}</h2>
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
                      <p className="text-sm">{format(booking.date, "HH:mm")}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <h2 className="text-sm text-gray-400">Barbearia</h2>
                      <p className="text-sm">{booking?.barbershop.name}</p>
                    </div>
                  </CardContent>

                  {/* 👇 Se o agendamento for CONFIRMADO, o botão de cancelar aparece no desktop */}
                  {booking.status === BookingStatus.CONFIRMED && (
                    <CardFooter>
                      <AlertDialog
                        open={openDesktopAlert}
                        onOpenChange={setOpenDesktopAlert}
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
                              handleCancelBooking(booking.id, true)
                            }
                            disabled={loading}
                          >
                            Confirmar Cancelamento
                          </AlertDialogAction>
                        </AlertDialogContent>
                      </AlertDialog>
                    </CardFooter>
                  )}

                  {booking.status === BookingStatus.FINISHED &&
                    !booking.rating && (
                      <CardFooter>
                        <AlertDialog
                          open={openMobileAlert}
                          onOpenChange={setOpenMobileAlert}
                        >
                          <AlertDialogTrigger
                            render={
                              <Button variant="default" className="w-full">
                                Avaliar Barbearia
                              </Button>
                            }
                          />
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Avalie a Barbearia
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Escolha uma nota para avaliar a Barbearia (entre
                                1 e 5)
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="flex items-center justify-center gap-2 py-6">
                              {[1, 2, 3, 4, 5].map((starValue) => {
                                const isFilled = starValue <= currentRating

                                return (
                                  <button
                                    key={starValue}
                                    type="button"
                                    onClick={() => setCurrentRating(starValue)}
                                    className="transition-transform focus:outline-none active:scale-95"
                                  >
                                    <Star
                                      size={36}
                                      className={
                                        isFilled
                                          ? "fill-amber-400 text-amber-400"
                                          : "text-muted-foreground opacity-40"
                                      }
                                    />
                                  </button>
                                )
                              })}
                            </div>
                            <AlertDialogFooter className="flex-row items-center justify-end gap-3">
                              <AlertDialogCancel
                                onClick={() => setCurrentRating(0)}
                              >
                                Voltar
                              </AlertDialogCancel>
                              <AlertDialogAction
                                className={`${buttonVariants({
                                  variant: "default",
                                })}`}
                                onClick={() =>
                                  handleReviewBarbershop(
                                    booking.id,
                                    false,
                                    currentRating,
                                    booking.barbershop.id,
                                  )
                                }
                                disabled={loading || currentRating === 0}
                              >
                                {loading ? "Enviando..." : "Enviar Avaliação"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </CardFooter>
                    )}

                  {/* 👇 Exibe feedback de estrelas no Desktop também se já houver avaliação */}
                  {booking.status !== BookingStatus.CONFIRMED &&
                    booking.rating && (
                      <div className="bg-muted/20 flex items-center justify-between rounded-b-lg border-t p-4 text-sm">
                        <span className="text-gray-400">Sua avaliação:</span>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={14}
                              className={
                                star <= booking.rating!
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-muted-foreground opacity-20"
                              }
                            />
                          ))}
                        </div>
                      </div>
                    )}
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default BookingsContent
