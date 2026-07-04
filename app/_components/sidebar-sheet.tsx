"use client"

import Image from "next/image"
import { SheetClose, SheetContent, SheetHeader } from "./ui/sheet"
import { Avatar, AvatarImage } from "./ui/avatar"
import { Button, buttonVariants } from "./ui/button"
import { CalendarIcon, HomeIcon, LogInIcon, LogOutIcon } from "lucide-react"
import Link from "next/link"
import { quickSearchOptions } from "../_constants/search"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog"
import { signIn, signOut, useSession } from "next-auth/react"
import { useState } from "react"
import { useRouter } from "next/navigation"

const SidebarSheet = () => {
  const { data } = useSession()
  // 1. Estados para capturar os dados do formulário e erros
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  const handleLoginWithGoogleClick = () => signIn("google")
  const handleLogoutWithGoogleClick = () => {
    signOut({
      callbackUrl: "/",
    })
  }
  // 2. Função para lidar com o login de e-mail e senha
  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError("Preencha todos os campos.")
      return
    }

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false, // Evita recarregar a página bruscamente
    })

    if (res?.error) {
      setError("E-mail ou senha inválidos.")
    }

    router.refresh()
    router.push("/")
  }
  return (
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

      <div className="border-b border-solid p-5">
        {data?.user ? (
          <div className="flex items-center gap-3">
            <Avatar className="border-primary size-12 border-2">
              <AvatarImage
                src={data?.user?.image || "/avatar-placeholder.png"}
              />
            </Avatar>

            <div className="flex flex-col">
              <p className="text-base font-bold">{data?.user?.name}</p>
              <p className="text-muted-foreground text-xs">
                {data?.user?.email}
              </p>
              <Link href="/user/update">Editar perfil</Link>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold">Olá, Faça seu login!</p>

            <Dialog>
              <DialogTrigger
                render={
                  <Button>
                    <LogInIcon size="default" />
                  </Button>
                }
              ></DialogTrigger>
              <DialogContent className="w-[90%]">
                <DialogHeader className="text-center">
                  <DialogTitle>Faça login na plataforma!</DialogTitle>
                  <DialogDescription>
                    Conecte-se usando sua conta do Google
                  </DialogDescription>
                </DialogHeader>

                <Button
                  variant="outline"
                  className="gap-2 font-bold"
                  onClick={handleLoginWithGoogleClick}
                >
                  <Image
                    src="/logo-google.svg"
                    width={18}
                    height={18}
                    alt="Logo Google"
                  />
                  Google
                </Button>
                <div className="relative flex items-center py-2">
                  <div className="border-muted grow border-t"></div>
                  <span className="text-muted-foreground mx-4 shrink text-xs uppercase">
                    Ou
                  </span>
                  <div className="border-muted grow border-t"></div>
                </div>

                {/* 3. Formulário estruturado com os estados do React */}
                <form
                  onSubmit={handleCredentialsSubmit}
                  className="flex flex-col gap-4"
                >
                  <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="text-sm font-semibold">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      placeholder="seuemail@exemplo.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label htmlFor="password" className="text-sm font-semibold">
                      Senha
                    </label>
                    <input
                      type="password"
                      name="password"
                      id="password"
                      placeholder="Sua senha"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    />
                  </div>

                  {/* Exibição de mensagem de erro caso falhe */}
                  {error && (
                    <p className="text-destructive bg-destructive/10 rounded-md p-2 text-center text-xs font-medium">
                      {error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    variant="default"
                    className="mt-2 w-full gap-2 font-bold"
                  >
                    <LogInIcon size={16} />
                    Entrar
                  </Button>
                </form>
                <div className="mt-2 border-t border-solid pt-2 text-center">
                  <p className="text-muted-foreground text-sm">
                    Ainda não tem conta?{" "}
                    <Link
                      href="/register"
                      className="text-primary font-semibold transition-all hover:underline"
                    >
                      Clique aqui
                    </Link>{" "}
                    para se cadastrar.
                  </p>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4 border-b border-solid p-5">
        <SheetClose
          nativeButton={false}
          render={
            <Link
              href="/"
              className={`${buttonVariants({ variant: "default" })} mt-3 w-full justify-start`}
            />
          }
        >
          <HomeIcon size={18} />
          Início
        </SheetClose>
        {data?.user && (
          <Link
            href="/bookings"
            className={`${buttonVariants({ variant: "ghost" })} w-full justify-start`}
          >
            <CalendarIcon size={18} />
            Agendamentos
          </Link>
        )}
      </div>

      <div className="flex flex-col gap-4 border-b border-solid p-5">
        {quickSearchOptions &&
          quickSearchOptions.map((option) => (
            <SheetClose
              nativeButton={false}
              key={option.label}
              className={`${buttonVariants({ variant: "ghost" })} justify-start gap-2`}
              render={
                <Link
                  href={`/barbershops?service=${option.label}`}
                  className="flex items-center gap-2"
                />
              }
            >
              <Image
                src={option.imageUrl}
                width={18}
                height={18}
                alt={option.label}
                sizes="110px"
              />
              {option.label}
            </SheetClose>
          ))}
      </div>

      {data?.user && (
        <div className="flex flex-col gap-4 p-5">
          <Button
            className="justify-start gap-2"
            variant="ghost"
            onClick={handleLogoutWithGoogleClick}
          >
            <LogOutIcon size={18} />
            Sair da conta
          </Button>
        </div>
      )}
    </SheetContent>
  )
}

export default SidebarSheet
