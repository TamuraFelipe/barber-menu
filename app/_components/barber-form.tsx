"use client"

import { useForm, useFieldArray, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"

import { Input } from "@/app/_components/ui/input"
import { Label } from "@/app/_components/ui/label"
import { Button } from "@/app/_components/ui/button"
import { Textarea } from "@/app/_components/ui/textarea"
import { Switch } from "@/app/_components/ui/switch"
import { Barbershop, BarbershopService } from "@prisma/client"
import { Plus, Trash2, Image as ImageIcon, Scissors, Clock } from "lucide-react"
import { saveBarbershop } from "../_actions/save-barbershop"
import Image from "next/image"

// Importar o toast do Sonner
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
} from "@/app/_components/ui/alert-dialog"

// Uploadthing Imports
import { generateUploadButton } from "@uploadthing/react"
import type { ourFileRouter } from "@/app/api/uploadthing/core"

type OurFileRouter = typeof ourFileRouter
const BarbershopUploadButton = generateUploadButton<OurFileRouter>()

const DAYS_OF_WEEK = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
]

type BarbershopOpeningHour = {
  id?: string
  dayOfWeek: number
  isClosed: boolean
  openTime?: string | null
  closeTime?: string | null
  lunchStart?: string | null
  lunchEnd?: string | null
}

type BarbershopWithRelations = Barbershop & {
  services?: BarbershopService[]
  openingHours?: BarbershopOpeningHour[]
}

const openingHourSchema = z.object({
  id: z.string().optional(),
  dayOfWeek: z.number(),
  isClosed: z.boolean(),
  openTime: z.string().optional(),
  closeTime: z.string().optional(),
  lunchStart: z.string().optional(),
  lunchEnd: z.string().optional(),
})

const barbershopFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres." })
    .max(50, { message: "O nome deve ter no máximo 50 caracteres." }),
  email: z
    .string()
    .email({ message: "Por favor, insira um email válido." })
    .min(3, { message: "O email deve ter pelo menos 3 caracteres." }),
  address: z
    .string()
    .min(3, { message: "O endereço deve ter pelo menos 3 caracteres." })
    .max(100, { message: "O endereço deve ter no máximo 100 caracteres." }),
  phones: z.array(
    z.object({
      value: z.string().min(8, { message: "Telefone inválido." }),
    }),
  ),
  description: z
    .string()
    .max(2000, { message: "A descrição deve ter no máximo 2000 caracteres." }),
  imageUrl: z.string().optional(),
  openingHours: z.array(openingHourSchema),
  services: z
    .array(
      z.object({
        id: z.string().optional(),
        name: z.string().min(3, {
          message: "O nome do serviço deve ter pelo menos 3 caracteres.",
        }),
        description: z
          .string()
          .min(5, { message: "A descrição deve ter pelo menos 5 caracteres." }),
        price: z.string().min(1, { message: "Digite um preço válido." }),
        imageUrl: z
          .string()
          .url({ message: "Faça o upload de uma imagem para o serviço." }),
        duration: z.string().min(1, { message: "Digite uma duração valida." }),
      }),
    )
    .min(1, { message: "Adicione pelo menos um serviço à sua barbearia." }),
})

type BarbershopFormValues = z.infer<typeof barbershopFormSchema>

interface BarberFormProps {
  initialData?: BarbershopWithRelations | null
}

export const BarberForm = ({ initialData }: BarberFormProps) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)

  const defaultOpeningHours = DAYS_OF_WEEK.map((_, index) => {
    const existing = initialData?.openingHours?.find(
      (h) => h.dayOfWeek === index,
    )
    return {
      id: existing?.id,
      dayOfWeek: index,
      isClosed: existing ? existing.isClosed : index === 0, // Domingo padrão fechado
      openTime: existing?.openTime ?? "08:00",
      closeTime: existing?.closeTime ?? "18:00",
      lunchStart: existing?.lunchStart ?? "12:00",
      lunchEnd: existing?.lunchEnd ?? "13:00",
    }
  })

  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<BarbershopFormValues>({
    resolver: zodResolver(barbershopFormSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      email: initialData?.email ?? "",
      address: initialData?.address ?? "",
      description: initialData?.description ?? "",
      imageUrl: initialData?.imageUrl ?? "",
      phones: initialData?.phones?.map((phone) => ({ value: phone })) ?? [
        { value: "" },
      ],
      openingHours: defaultOpeningHours,
      services: initialData?.services?.map((service) => ({
        id: service.id,
        name: service.name,
        description: service.description,
        price: service.price.toString(),
        imageUrl: service.imageUrl,
        duration: service.duration.toString(),
      })) ?? [
        { name: "", description: "", price: "", imageUrl: "", duration: "" },
      ],
    },
  })

  // useWatch para subscriptions reativas de listas/campos específicos
  const watchedImageUrl = useWatch({ control, name: "imageUrl" })
  const watchedServices = useWatch({ control, name: "services" })
  const watchedOpeningHours = useWatch({ control, name: "openingHours" })

  const {
    fields: phoneFields,
    append: appendPhone,
    remove: removePhone,
  } = useFieldArray({
    control,
    name: "phones",
  })

  const { fields: openingHourFields } = useFieldArray({
    control,
    name: "openingHours",
  })

  const {
    fields: serviceFields,
    append: appendService,
    remove: removeService,
  } = useFieldArray({
    control,
    name: "services",
  })

  const handleSaveData = async (data: BarbershopFormValues) => {
    setIsConfirmOpen(false)

    const toastId = toast.loading("Salvando alterações...")

    try {
      const payload = {
        id: initialData?.id,
        name: data.name,
        email: data.email,
        address: data.address,
        description: data.description,
        phones: data.phones.map((phone) => phone.value),
        imageUrl: data.imageUrl,
        openingHours: data.openingHours.map((hour) => ({
          id: hour.id,
          dayOfWeek: hour.dayOfWeek,
          isClosed: hour.isClosed,
          openTime: hour.isClosed ? null : hour.openTime,
          closeTime: hour.isClosed ? null : hour.closeTime,
          lunchStart: hour.isClosed ? null : hour.lunchStart,
          lunchEnd: hour.isClosed ? null : hour.lunchEnd,
        })),
        services: data.services.map((service) => ({
          id: service.id,
          name: service.name,
          description: service.description,
          price: Number(service.price),
          imageUrl: service.imageUrl,
          duration: Number(service.duration),
        })),
      }

      await saveBarbershop(payload)

      toast.success("Barbearia salva com sucesso!", {
        id: toastId,
        description: "As informações já estão atualizadas.",
      })
    } catch (error) {
      console.error(error)
      toast.error("Erro ao salvar as alterações.", {
        id: toastId,
        description: "Por favor, tente novamente mais tarde.",
      })
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(() => setIsConfirmOpen(true))}
        className="mx-auto max-w-4xl space-y-8 pb-12"
      >
        {/* SEÇÃO: Imagem da Barbearia com UploadThing */}
        <div className="flex flex-col gap-3">
          <Label>Imagem da Barbearia</Label>

          {watchedImageUrl ? (
            <div className="bg-muted group relative flex aspect-video max-w-md items-center justify-center overflow-hidden rounded-lg border">
              <Image
                src={watchedImageUrl}
                alt="Preview da barbearia"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <BarbershopUploadButton
                  endpoint="barbershopUploader"
                  onClientUploadComplete={(res) => {
                    if (res?.[0]) {
                      setValue("imageUrl", res[0].ufsUrl)
                      toast.success("Imagem enviada!")
                    }
                  }}
                  onUploadError={(err: Error) => {
                    toast.error(`Erro no upload: ${err.message}`)
                  }}
                  content={{
                    button: ({ isUploading }) =>
                      isUploading ? "Enviando..." : "Alterar Imagem",
                    allowedContent: "Imagens até 4MB",
                  }}
                  appearance={{
                    button:
                      "bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold px-3 py-2 h-auto rounded-md cursor-pointer",
                    allowedContent: "hidden",
                  }}
                />
              </div>
            </div>
          ) : (
            <div className="hover:bg-accent/50 flex max-w-md flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed p-8 transition-colors">
              <div className="bg-accent rounded-full p-3">
                <ImageIcon className="text-muted-foreground h-6 w-6" />
              </div>
              <div className="flex flex-col items-center">
                <BarbershopUploadButton
                  endpoint="barbershopUploader"
                  onClientUploadComplete={(res) => {
                    if (res?.[0]) {
                      setValue("imageUrl", res[0].ufsUrl)
                      toast.success("Imagem enviada!")
                    }
                  }}
                  onUploadError={(err: Error) => {
                    toast.error(`Erro no upload: ${err.message}`)
                  }}
                  content={{
                    button: ({ isUploading }) =>
                      isUploading ? "Enviando..." : "Escolher Imagem",
                    allowedContent: "Imagens até 4MB",
                  }}
                  appearance={{
                    button:
                      "bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-bold px-3 py-2 h-auto rounded-md cursor-pointer",
                    allowedContent: "text-[10px] text-muted-foreground mt-1",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Informações Básicas */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Nome da Barbearia</Label>
            <Input
              id="name"
              placeholder="Ex: Barbearia do João"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-destructive text-sm font-medium">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email de contato</Label>
            <Input
              id="email"
              disabled
              placeholder="Ex: contato@barbearia.com"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-destructive text-sm font-medium">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="address">Endereço Completo</Label>
          <Input
            id="address"
            placeholder="Ex: Rua das Flores, 123 - Centro"
            {...register("address")}
          />
          {errors.address && (
            <p className="text-destructive text-sm font-medium">
              {errors.address.message}
            </p>
          )}
        </div>

        {/* Telefones */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <Label>Telefones de Contato</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => appendPhone({ value: "" })}
              className="flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> Adicionar Telefone
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {phoneFields.map((field, index) => (
              <div key={field.id} className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Ex: (11) 99999-9999"
                    {...register(`phones.${index}.value` as const)}
                  />
                  {phoneFields.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => removePhone(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {errors.phones?.[index]?.value && (
                  <p className="text-destructive text-sm font-medium">
                    {errors.phones[index]?.value?.message}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Descrição */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Descrição / Biografia</Label>
          <Textarea
            id="description"
            placeholder="Sobre a sua barbearia..."
            {...register("description")}
          />
          {errors.description && (
            <p className="text-destructive text-sm font-medium">
              {errors.description.message}
            </p>
          )}
        </div>

        <hr className="border-border my-6" />

        {/* ================= SEÇÃO: HORÁRIOS DE FUNCIONAMENTO ================= */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="text-primary h-5 w-5" />
            <h2 className="text-xl font-bold tracking-tight">
              Horários de Funcionamento
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {openingHourFields.map((field, index) => {
              const isClosed = watchedOpeningHours?.[index]?.isClosed

              return (
                <div
                  key={field.id}
                  className="bg-card flex flex-col gap-4 rounded-xl border p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between"
                >
                  {/* Dia da semana e Switch para indicar se abre ou fecha */}
                  <div className="flex items-center justify-between gap-4 lg:w-48">
                    <span className="text-sm font-semibold">
                      {DAYS_OF_WEEK[field.dayOfWeek]}
                    </span>
                    <div className="flex items-center gap-2">
                      <Switch
                        id={`closed-switch-${index}`}
                        checked={isClosed}
                        onCheckedChange={(checked) =>
                          setValue(`openingHours.${index}.isClosed`, checked)
                        }
                      />
                      <Label
                        htmlFor={`closed-switch-${index}`}
                        className="text-muted-foreground cursor-pointer text-xs font-medium"
                      >
                        {isClosed ? "Fechado" : "Aberto"}
                      </Label>
                    </div>
                  </div>

                  {/* Campos de horários de funcionamento e almoço */}
                  {!isClosed ? (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:flex-1">
                      <div className="flex flex-col gap-1">
                        <Label className="text-xs">Abertura</Label>
                        <Input
                          type="time"
                          {...register(`openingHours.${index}.openTime`)}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <Label className="text-xs">Início Almoço</Label>
                        <Input
                          type="time"
                          {...register(`openingHours.${index}.lunchStart`)}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <Label className="text-xs">Fim Almoço</Label>
                        <Input
                          type="time"
                          {...register(`openingHours.${index}.lunchEnd`)}
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <Label className="text-xs">Fechamento</Label>
                        <Input
                          type="time"
                          {...register(`openingHours.${index}.closeTime`)}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-muted/40 text-muted-foreground flex-1 rounded-lg py-2.5 text-center text-xs font-medium">
                      Barbearia não abre neste dia
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        <hr className="border-border my-6" />

        {/* ================= SEÇÃO DINÂMICA DE SERVIÇOS ================= */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scissors className="text-primary h-5 w-5" />
              <h2 className="text-xl font-bold tracking-tight">
                Serviços Oferecidos
              </h2>
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                appendService({
                  name: "",
                  description: "",
                  price: "",
                  imageUrl: "",
                  duration: "",
                })
              }
              className="flex items-center gap-1.5"
            >
              <Plus className="h-4 w-4" /> Adicionar Serviço
            </Button>
          </div>

          {errors.services && (
            <p className="text-destructive text-sm font-medium">
              {errors.services.message}
            </p>
          )}

          <div className="grid grid-cols-1 gap-4">
            {serviceFields.map((field, index) => {
              const currentServiceImageUrl = watchedServices?.[index]?.imageUrl

              return (
                <div
                  key={field.id}
                  className="bg-card space-y-4 rounded-xl border p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground bg-accent rounded-md px-2 py-0.5 text-sm font-semibold">
                      Serviço #{index + 1}
                    </span>
                    {serviceFields.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeService(index)}
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
                    {/* Preview e Upload da Imagem do Serviço */}
                    <div className="flex flex-col items-center justify-center gap-2 md:col-span-4">
                      <Label className="self-start">Imagem do Serviço</Label>

                      {currentServiceImageUrl ? (
                        <div className="bg-muted group relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-lg border">
                          <Image
                            src={currentServiceImageUrl}
                            alt="Imagem do serviço"
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-black/60 opacity-0 transition-opacity group-hover:opacity-100">
                            <BarbershopUploadButton
                              endpoint="serviceUploader"
                              onClientUploadComplete={(res) => {
                                if (res?.[0]) {
                                  setValue(
                                    `services.${index}.imageUrl`,
                                    res[0].ufsUrl,
                                  )
                                  toast.success("Imagem do serviço enviada!")
                                }
                              }}
                              onUploadError={(err: Error) => {
                                toast.error(`Erro no upload: ${err.message}`)
                              }}
                              content={{
                                button: ({ isUploading }) =>
                                  isUploading ? "Enviando..." : "Alterar",
                                allowedContent: "Até 2MB",
                              }}
                              appearance={{
                                button:
                                  "bg-primary text-primary-foreground hover:bg-primary/90 text-xs px-2.5 py-1.5 h-auto rounded-md cursor-pointer",
                                allowedContent: "hidden",
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="bg-muted/20 flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-4">
                          <ImageIcon className="text-muted-foreground h-5 w-5" />
                          <BarbershopUploadButton
                            endpoint="serviceUploader"
                            onClientUploadComplete={(res) => {
                              if (res?.[0]) {
                                setValue(
                                  `services.${index}.imageUrl`,
                                  res[0].ufsUrl,
                                )
                                toast.success("Imagem do serviço enviada!")
                              }
                            }}
                            onUploadError={(err: Error) => {
                              toast.error(`Erro no upload: ${err.message}`)
                            }}
                            content={{
                              button: ({ isUploading }) =>
                                isUploading ? "Enviando..." : "Enviar Foto",
                              allowedContent: "Até 2MB",
                            }}
                            appearance={{
                              button:
                                "bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs px-2.5 py-1.5 h-auto rounded-md border border-solid border-input cursor-pointer",
                              allowedContent:
                                "text-[9px] text-muted-foreground mt-0.5",
                            }}
                          />
                        </div>
                      )}

                      {errors.services?.[index]?.imageUrl && (
                        <p className="text-destructive mt-1 text-xs">
                          {errors.services[index]?.imageUrl?.message}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:col-span-8">
                      {/* Nome do Serviço */}
                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <Label>Nome do Serviço</Label>
                        <Input
                          placeholder="Ex: Corte Degradê"
                          {...register(`services.${index}.name` as const)}
                        />
                        {errors.services?.[index]?.name && (
                          <p className="text-destructive text-sm">
                            {errors.services[index]?.name?.message}
                          </p>
                        )}
                      </div>

                      {/* Preço */}
                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <Label>Preço (R$)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="Ex: 45.00"
                          {...register(`services.${index}.price` as const)}
                        />
                        {errors.services?.[index]?.price && (
                          <p className="text-destructive text-sm">
                            {errors.services[index]?.price?.message}
                          </p>
                        )}
                      </div>

                      {/* Duração do serviço */}
                      <div className="flex flex-col gap-1.5 sm:col-span-2">
                        <Label>Duração do Serviço</Label>
                        <Input
                          type="number"
                          step="15"
                          placeholder="Ex: 30"
                          {...register(`services.${index}.duration` as const)}
                        />
                        {errors.services?.[index]?.duration && (
                          <p className="text-destructive text-sm">
                            {errors.services[index]?.duration?.message}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Descrição do Serviço */}
                    <div className="flex flex-col gap-1.5 md:col-span-12">
                      <Label>Descrição do Serviço</Label>
                      <Textarea
                        placeholder="Ex: Corte moderno focado em degradê navalhado..."
                        rows={2}
                        {...register(`services.${index}.description` as const)}
                      />
                      {errors.services?.[index]?.description && (
                        <p className="text-destructive text-sm">
                          {errors.services[index]?.description?.message}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <hr className="border-border my-6" />

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          {isSubmitting
            ? "Salvando..."
            : initialData
              ? "Salvar Alterações"
              : "Cadastrar Barbearia"}
        </Button>
      </form>

      {/* AlertDialog */}
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deseja salvar as alterações?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação enviará as informações atualizadas, incluindo os
              horários e as novas imagens enviadas para o servidor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmit(handleSaveData)}
              className="bg-primary hover:bg-primary/90"
            >
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
