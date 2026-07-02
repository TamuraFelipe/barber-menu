import { Card, CardContent } from "@/app/_components/ui/card"
import Image from "next/image"
import { Button } from "./ui/button"
import { MenuIcon } from "lucide-react"

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
        <Button size="lg" variant="outline">
          <MenuIcon />
        </Button>
      </CardContent>
    </Card>
  )
}

export default Header
