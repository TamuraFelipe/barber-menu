// app/_components/barber-admin-form.tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useState } from "react"
import { toast } from "sonner"

import { Input } from "@/app/_components/ui/input"
import { Label } from "@/app/_components/ui/label"
import { Button } from "@/app/_components/ui/button"
import { createBarberAdmin } from "../_actions/create-barber-admin"

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

const adminFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O nome deve ter pelo menos 3 caracteres." }),
  email: z.string().email({ message: "Insira um e-mail válido." }),
  password: z.string().min(6, {
    message: "A senha de acesso provisório deve ter pelo menos 6 caracteres.",
  }),
})

type AdminFormValues = z.infer<typeof adminFormSchema>

export const BarberAdminForm = () => {
  const [isOpen, setIsOpen] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminFormValues>({
    resolver: zodResolver(adminFormSchema),
    defaultValues: { name: "", email: "", password: "" },
  })

  const onSubmitForm = async (data: AdminFormValues) => {
    setIsOpen(false)
    const toastId = toast.loading("Cadastrando barbearia no sistema...")

    try {
      const response = await createBarberAdmin({
        name: data.name,
        email: data.email,
        passwordHash: data.password,
      })

      if (response.success) {
        toast.success("Barbearia pré-cadastrada com sucesso!", {
          id: toastId,
          description:
            "O administrador já pode fazer login e configurar o painel.",
        })
        reset()
      } else {
        toast.error(response.error || "Erro ao processar o cadastro.", {
          id: toastId,
        })
      }
    } catch (error) {
      console.error(error)
      toast.error("Ocorreu um erro inesperado.", { id: toastId })
    }
  }

  return (
    <>
      <form
        onSubmit={handleSubmit(() => setIsOpen(true))}
        className="space-y-4"
      >
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">Nome da Barbearia</Label>
          <Input
            id="name"
            placeholder="Ex: Barbearia Elite"
            {...register("name")}
          />
          {errors.name && (
            <p className="text-destructive text-xs">{errors.name.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">E-mail do Administrador</Label>
          <Input
            id="email"
            type="email"
            placeholder="Ex: admin@elite.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-destructive text-xs">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Senha de Acesso Provisória</Label>
          <Input
            id="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-destructive text-xs">
              {errors.password.message}
            </p>
          )}
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Cadastrando..." : "Pré-cadastrar Barbearia"}
        </Button>
      </form>

      <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Pré-Cadastro?</AlertDialogTitle>
            <AlertDialogDescription>
              Isso criará uma conta de login e um rascunho de barbearia para o
              e-mail informado.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit(onSubmitForm)}>
              Confirmar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
