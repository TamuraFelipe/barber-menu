import { SearchIcon } from "lucide-react"
import { Button } from "./_components/ui/button"
import Header from "./_components/ui/header"
import { Input } from "./_components/ui/input"
import Image from "next/image"

export default function Home() {
  return (
    <div>
      <Header />
      <div className="p-5">
        <h2 className="text-xl font-bold">Olá, Felipe</h2>
        <p>Quarta-feira, 30 de março</p>

        <div className="mt-6 flex items-center gap-2">
          <Input placeholder="Faça sua busca..." />
          <Button>
            <SearchIcon />
          </Button>
        </div>

        <div className="relative mt-6 h-37.5 w-full">
          <Image
            src="/banner-01.png"
            alt="Agende com os melhores barbeiros da cidade"
            fill
            className="rounded-xl object-cover"
          />
        </div>
      </div>
    </div>
  )
}
