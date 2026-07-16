"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { ChevronLeftIcon, Loader2Icon } from "lucide-react"
import { Button } from "@/app/_components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/_components/ui/card"
import { Input } from "@/app/_components/ui/input"

export default function NewBarbershopPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  /* const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setLoading(true)

    const formData = new FormData(event.currentTarget)

    // Converte os telefones de uma string separada por vírgula para um Array
    const phonesString = formData.get("phones") as string
    const phonesArray = phonesString
      ? phonesString
          .split(",")
          .map((phone) => phone.trim())
          .filter(Boolean)
      : []

    const barbershopData = {
      name: formData.get("name") as string,
      address: formData.get("address") as string,
      imageUrl: formData.get("imageUrl") as string,
      description: formData.get("description") as string,
      phones: phonesArray,
    }

    try {
      await createBarbershop(barbershopData)
      toast.success("Barbearia cadastrada com sucesso!")
      router.push("/") // Redireciona para a home ou listagem
    } catch (error) {
      console.error(error)
      toast.error("Erro ao cadastrar a barbearia. Verifique os dados.")
    } finally {
      setLoading(false)
    }
  } */
  const handleSubmit = () => {
    console.log("submit")
  }
  return (
    <div className="container mx-auto max-w-2xl px-5 py-10">
      {/* Botão de Voltar */}
      <Button
        variant="ghost"
        className="mb-6 gap-2 p-0 text-gray-400 hover:bg-transparent hover:text-white"
        onClick={() => router.back()}
      >
        <ChevronLeftIcon size={18} />
        Voltar
      </Button>

      <Card className="border-solid">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Cadastrar Barbearia
          </CardTitle>
          <CardDescription className="text-gray-400">
            Preencha as informações para registrar seu estabelecimento na
            plataforma.
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {/* Nome */}
            <div className="space-y-2">
              <label htmlFor="name">Nome da Barbearia</label>
              <Input
                id="name"
                name="name"
                placeholder="Ex: Barbearia Clássica"
                required
              />
            </div>

            {/* Endereço */}
            <div className="space-y-2">
              <label htmlFor="address">Endereço Completo</label>
              <Input
                id="address"
                name="address"
                placeholder="Ex: Av. Paulista, 1000 - São Paulo, SP"
                required
              />
            </div>

            {/* URL da Imagem */}
            <div className="space-y-2">
              <label htmlFor="imageUrl">URL da Imagem de Capa</label>
              <Input
                id="imageUrl"
                name="imageUrl"
                placeholder="Ex: https://images.unsplash.com/photo-..."
                type="url"
                required
              />
            </div>

            {/* Telefones */}
            <div className="space-y-2">
              <label htmlFor="phones">Telefones de Contato</label>
              <Input
                id="phones"
                name="phones"
                placeholder="Ex: (11) 99999-9999, (11) 3333-3333"
              />
              <p className="text-xs text-gray-400">
                Separe os números por vírgula se houver mais de um.
              </p>
            </div>

            {/* Descrição / Sobre Nós */}
            <div className="space-y-2">
              <label htmlFor="description">Sobre a Barbearia</label>
              <textarea
                id="description"
                name="description"
                placeholder="Conte um pouco sobre a história, profissionais e diferenciais da sua barbearia..."
                className="h-32 resize-none"
              />
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-3 border-t border-solid pt-6">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} className="min-w-30">
              {loading ? (
                <>
                  <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                "Salvar"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
