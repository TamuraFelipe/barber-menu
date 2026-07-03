import { Card, CardContent } from "@/app/_components/ui/card"
import Image from "next/image"
import { Button } from "./ui/button"
import { MenuIcon } from "lucide-react"
import { Sheet, SheetTrigger } from "./ui/sheet"
import SidebarSheet from "./sidebar-sheet"
import Container from "./container"
import Link from "next/link"

const Header = () => {
  return (
    <Card className="rounded-none p-0">
      <CardContent className="px-0">
        <Container className="flex items-center justify-between py-5">
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
        </Container>
      </CardContent>
    </Card>
  )
}

export default Header
