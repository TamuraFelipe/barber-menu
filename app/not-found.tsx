import Link from "next/link"
import { ScissorsIcon } from "lucide-react"

import { buttonVariants } from "./_components/ui/button"

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="bg-primary/10 mb-6 rounded-full p-5">
        <ScissorsIcon className="text-primary h-10 w-10" />
      </div>

      <h1 className="mb-2 text-3xl font-bold">404</h1>

      <h2 className="mb-3 text-xl font-semibold">Página não encontrada!</h2>

      <p className="text-muted-foreground mb-8 max-w-sm text-sm">
        A barbearia e/ou serviço que você está procurando não existe ou pode ter
        sido removidos.
      </p>

      <Link href="/" className={`${buttonVariants({ size: "lg" })}`}>
        Voltar para o início
      </Link>
    </div>
  )
}

export default NotFound
