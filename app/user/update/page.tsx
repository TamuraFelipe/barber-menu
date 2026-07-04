"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeftIcon, SaveIcon } from "lucide-react"
import { Avatar, AvatarImage } from "../../_components/ui/avatar"
import { generateUploadButton } from "@uploadthing/react"

// Ajuste o caminho do import para o seu core.ts da API do UploadThing
import type { ourFileRouter } from "@/app/api/uploadthing/core"
import { Button } from "@/app/_components/ui/button"

type OurFileRouter = typeof ourFileRouter
const ProfileUploadButton = generateUploadButton<OurFileRouter>()

const UserUpdatePage = () => {
  const { data: session, update, status } = useSession()
  const router = useRouter()

  // 1. Inicializamos os estados vazios e vamos alimentá-los somente se a sessão estiver pronta
  const [name, setName] = useState("")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // 2. Substituímos a sincronização do useEffect por uma atribuição única controlada por 'isInitialized'
  if (status === "authenticated" && session?.user && !isInitialized) {
    setName(session.user.name || "")
    setAvatarUrl(session.user.image || null)
    setIsInitialized(true)
  }

  // TRAVA DE SEGURANÇA VISUAL: Verifica se o avatar é o fornecido pelo Google
  const isGoogleUser = session?.user?.image?.includes("googleusercontent.com")

  const handleUpdateSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!name) {
      setError("O nome não pode ficar em branco.")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/user/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, image: avatarUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Erro ao atualizar o perfil.")
      }

      setSuccess("Perfil updated com sucesso!")

      await update({
        name: name,
        image: avatarUrl,
      })
      setName(name)
      setAvatarUrl(avatarUrl)
      router.refresh()
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError("Erro de conexão com o servidor.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Se a sessão ainda estiver carregando, mostra um estado neutro
  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Carregando...
      </div>
    )
  }

  // Se o usuário não estiver logado, bloqueia o acesso
  if (!session?.user) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
        <p className="text-muted-foreground">
          Você precisa estar logado para acessar esta página.
        </p>
        <Link href="/">
          <Button variant="default">Ir para o Login</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-background flex flex-col items-center justify-center px-4 py-12">
      <div className="bg-card w-full max-w-100 rounded-2xl border border-solid p-6 shadow-sm">
        {/* Botão Voltar */}
        <div className="mb-4">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-all"
          >
            <ArrowLeftIcon size={16} /> Voltar para o Início
          </Link>
        </div>

        {/* Cabeçalho */}
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <h1 className="text-2xl font-bold tracking-tight">
            Editar meu Perfil
          </h1>
          <p className="text-muted-foreground text-sm">
            Mantenha as suas informações atualizadas
          </p>
        </div>

        {isGoogleUser ? (
          <div className="bg-muted/50 rounded-xl border border-solid p-4 text-center">
            <Avatar className="border-primary mx-auto mb-3 h-20 w-20 border-2">
              <AvatarImage
                src={session.user.image || "/avatar-placeholder.png"}
                className="object-cover"
              />
            </Avatar>
            <p className="mb-1 text-sm font-semibold">{session.user.name}</p>
            <p className="text-muted-foreground mb-4 text-xs">
              {session.user.email}
            </p>
            <p className="rounded-md bg-amber-500/10 p-3 text-xs font-medium text-amber-500">
              Sua conta está vinculada ao Google. Alterações de nome e avatar
              devem ser realizadas direto no painel da sua conta Google.
            </p>
          </div>
        ) : (
          <form onSubmit={handleUpdateSubmit} className="flex flex-col gap-4">
            {/* Foto de Perfil + Upload */}
            <div className="border-muted/50 mb-2 flex flex-col items-center gap-3 border-b border-solid py-2">
              <Avatar className="border-primary h-20 w-20 border-2">
                <AvatarImage
                  src={avatarUrl || "/avatar-placeholder.png"}
                  className="object-cover"
                />
              </Avatar>

              <ProfileUploadButton
                endpoint="avatarUploader"
                onClientUploadComplete={(res) => {
                  if (res && res.length > 0) {
                    setAvatarUrl(res[0].ufsUrl)
                  }
                }}
                onUploadError={(err: Error) => {
                  setError(`Erro no upload: ${err.message}`)
                }}
                content={{
                  button({ ready, isUploading }) {
                    if (isUploading) return "Enviando..."
                    if (ready) return "Alterar Foto"
                    return "Carregando..."
                  },
                  allowedContent: "Imagens até 2MB",
                }}
                appearance={{
                  button:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs font-bold px-3 py-2 h-auto rounded-md border border-solid border-input transition-all duration-200 cursor-pointer ut-uploading:bg-primary/50 ut-uploading:cursor-not-allowed",
                  allowedContent: "text-[10px] text-muted-foreground mt-1",
                }}
              />
            </div>

            {/* Campo: Nome */}
            <div className="flex flex-col gap-1">
              <label htmlFor="name" className="text-sm font-semibold">
                Nome Completo
              </label>
              <input
                type="text"
                name="name"
                id="name"
                placeholder="Seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            {/* Campo: Email */}
            <div className="flex flex-col gap-1 opacity-70">
              <label htmlFor="email" className="text-sm font-semibold">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={session.user.email || ""}
                disabled
                className="bg-muted border-input text-muted-foreground flex h-10 w-full cursor-not-allowed rounded-md border px-3 py-2 text-sm outline-none"
              />
              <span className="text-muted-foreground text-[10px]">
                O e-mail não pode ser alterado por motivos de segurança.
              </span>
            </div>

            {error && (
              <p className="text-destructive bg-destructive/10 dynamic-fade rounded-md p-2 text-center text-xs font-medium">
                {error}
              </p>
            )}

            {success && (
              <p className="dynamic-fade rounded-md bg-emerald-500/10 p-2 text-center text-xs font-medium text-emerald-500">
                {success}
              </p>
            )}

            <Button
              type="submit"
              variant="default"
              className="mt-2 w-full gap-2 font-bold"
              disabled={isLoading}
            >
              <SaveIcon size={16} />
              {isLoading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}

export default UserUpdatePage
