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

const SidebarSheet = () => {
  const { data } = useSession()
  const handleLoginWithGoogleClick = () => signIn("google")
  const handleLogoutWithGoogleClick = () => {
    signOut({
      callbackUrl: "/",
    })
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
