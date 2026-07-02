import { Card, CardContent } from "@/app/_components/ui/card"
import Image from "next/image"
import { Button, buttonVariants } from "./ui/button"
import {
  CalendarIcon,
  HomeIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
} from "lucide-react"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "./ui/sheet"
import { quickSearchOptions } from "../_constants/search"
import { Avatar, AvatarImage } from "./ui/avatar"
import Link from "next/link"

const Header = () => {
  return (
    <Card className="rounded-none p-0">
      <CardContent className="flex items-center justify-between p-5">
        <Image
          src="/logo.png"
          width={120}
          height={18}
          alt="Logo Barber Menu"
          loading="eager"
          sizes="110px"
        />

        <Sheet>
          <SheetTrigger
            render={
              <Button size="lg" variant="outline">
                <MenuIcon />
              </Button>
            }
          ></SheetTrigger>
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
              <div className="flex items-center gap-3">
                <Avatar className="border-primary size-12 border-2">
                  <AvatarImage src="https://utfs.io/f/178da6b6-6f9a-424a-be9d-a2feb476eb36-16t.png" />
                </Avatar>
                <div className="flex flex-col">
                  <p className="text-base font-bold">Victor Silva</p>
                  <p className="text-muted-foreground text-xs">
                    victorsilva@gmail.com
                  </p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-lg font-bold">Olá. Faça seu login!</p>
                <Button>
                  <LogInIcon size="default" />
                </Button>
              </div>
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
              <Link
                href="/bookings"
                className={`${buttonVariants({ variant: "ghost" })} w-full justify-start`}
              >
                <CalendarIcon size={18} />
                Agendamentos
              </Link>
            </div>

            <div className="flex flex-col gap-4 border-b border-solid p-5">
              {quickSearchOptions &&
                quickSearchOptions.map((option) => (
                  <Button
                    key={option.label}
                    className="justify-start gap-2"
                    variant="ghost"
                  >
                    <Image
                      src={option.imageUrl}
                      width={18}
                      height={18}
                      alt={option.label}
                      sizes="110px"
                    />
                    {option.label}
                  </Button>
                ))}
            </div>

            <div className="flex flex-col gap-4 p-5">
              <Button className="justify-start gap-2" variant="ghost">
                <LogOutIcon size={18} />
                Sair da conta
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </CardContent>
    </Card>
  )
}

export default Header
