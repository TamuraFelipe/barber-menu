"use client"
import { Card, CardContent } from "@/app/_components/ui/card"
import Image from "next/image"
import { Button, buttonVariants } from "./ui/button"
import {
  CalendarIcon,
  LayoutDashboardIcon,
  LogInIcon,
  LogOutIcon,
  MenuIcon,
  UserIcon,
} from "lucide-react"
import { Sheet, SheetTrigger } from "./ui/sheet"
import SidebarSheet from "./sidebar-sheet"
import Container from "./container"
import Link from "next/link"
import { Avatar, AvatarImage } from "./ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { signOut, useSession } from "next-auth/react"

interface HeaderProps {
  children?: React.ReactNode
}

const Header = ({ children }: HeaderProps) => {
  const { data } = useSession()
  const pathAdm =
    data?.user?.role === "ADMIN" ? "/admin-dashboard" : "/dashboard"
  return (
    <Card className="rounded-none p-0">
      <CardContent className="px-0">
        <Container className="flex items-center justify-between py-5 lg:gap-10">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/logo.png"
              width={120}
              height={18}
              alt="Logo Barber Menu"
              loading="eager"
              sizes="110px"
            />
          </Link>

          {/* Menu */}
          <div className="hidden w-full lg:block">{children}</div>
          {data?.user?.role === "USER" || data?.user?.role === undefined ? (
            <>
              <div className="hidden items-center gap-6 lg:flex">
                {data?.user ? (
                  <>
                    <Link
                      href="/bookings"
                      className={`${buttonVariants({ variant: "ghost" })} hidden justify-start lg:flex`}
                    >
                      <CalendarIcon size={18} />
                      Agendamentos
                    </Link>
                    <div className="flex items-center gap-6">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              size="icon"
                              className="flex w-full items-center gap-2 rounded-full"
                            >
                              <Avatar className="border-primary border-2">
                                <AvatarImage
                                  src={
                                    data?.user?.image ||
                                    "/avatar-placeholder.png"
                                  }
                                />
                              </Avatar>
                              <div>
                                <p className="text-base font-bold whitespace-nowrap">
                                  {data?.user?.name}
                                </p>
                              </div>
                            </Button>
                          }
                        />
                        <DropdownMenuContent align="end">
                          <DropdownMenuGroup>
                            <DropdownMenuItem>
                              <Link
                                href="/user/update"
                                className="flex items-center gap-1.5"
                              >
                                <UserIcon />
                                Perfil
                              </Link>
                            </DropdownMenuItem>
                          </DropdownMenuGroup>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <button
                              onClick={() => signOut()}
                              className="flex w-full items-center gap-1.5"
                            >
                              <LogOutIcon />
                              Sair
                            </button>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className={`${buttonVariants({ variant: "default" })} hidden justify-start lg:flex`}
                  >
                    <LogInIcon size={18} />
                    Entrar
                  </Link>
                )}
              </div>

              <div className="lg:hidden">
                <Sheet>
                  <SheetTrigger
                    render={
                      <Button size="lg" variant="outline">
                        <MenuIcon />
                      </Button>
                    }
                  ></SheetTrigger>

                  <SidebarSheet />
                </Sheet>
              </div>
            </>
          ) : (
            <Link href={pathAdm} className="flex items-center gap-2">
              <LayoutDashboardIcon size={18} />
              Dashboard
            </Link>
          )}
        </Container>
      </CardContent>
    </Card>
  )
}

export default Header
