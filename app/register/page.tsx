"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { UserPlusIcon } from "lucide-react"
import { Button } from "../_components/ui/button"
import { signIn } from "next-auth/react"
import { Avatar, AvatarImage } from "../_components/ui/avatar"

// 1. IMPORTAÇÕES DO UPLOADTHING
import { generateUploadButton } from "@uploadthing/react"
// Importe o tipo do seu FileRouter. Ajuste este caminho de acordo com onde está seu app/api/uploadthing/core.ts
import type { OurFileRouter } from "../api/uploadthing/core"

// 2. CRIA O BOTÃO JÁ TIPADO (Isso resolve o erro do genérico de forma limpa)
const MyUploadButton = generateUploadButton<OurFileRouter>()

const Register = () => {
  const router = useRouter()

  // Estados para gerenciar os inputs e feedbacks da tela
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!name || !email || !password) {
      setError("Por favor, preencha todos os campos obrigatórios.")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, image: avatarUrl }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Ocorreu um erro ao criar a conta.")
      }

      setSuccess("Conta criada com sucesso! Autenticando...")

      const loginResult = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (loginResult?.error) {
        setError("Conta criada, mas houve um problema ao logar.")
        setIsLoading(false)
        return
      }

      setName("")
      setEmail("")
      setPassword("")
      setAvatarUrl(null)

      router.push("/")
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

  return (
    <div className="bg-background flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="bg-card w-full max-w-100 rounded-2xl border border-solid p-6 shadow-sm">
        {/* Cabeçalho da Tela */}
        <div className="mb-6 flex flex-col items-center gap-3 text-center">
          <Image
            src="/logo.png"
            width={70}
            height={4}
            alt="Logo Barber Menu"
            priority
          />
          <h1 className="text-2xl font-bold tracking-tight">Criar uma conta</h1>
          <p className="text-muted-foreground text-sm">
            Cadastre-se para gerenciar seus agendamentos
          </p>
        </div>

        {/* Formulário de Cadastro */}
        <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-4">
          {/* Seção do Avatar com MyUploadButton tipado */}
          <div className="border-muted/50 mb-2 flex flex-col items-center gap-3 border-b border-solid py-2">
            <Avatar className="border-primary h-20 w-20 border-2">
              <AvatarImage
                src={avatarUrl || "/avatar-placeholder.png"}
                className="object-cover"
              />
            </Avatar>

            {/* 3. UTILIZA O BOTÃO RECENTEMENTE CRIADO COM OS TIPOS RECONHECIDOS */}
            <MyUploadButton
              endpoint="avatarUploader"
              onClientUploadComplete={(res) => {
                if (res && res[0]) {
                  setAvatarUrl(res[0].ufsUrl)
                }
              }}
              onUploadError={(err: Error) => {
                setError(`Erro no upload: ${err.message}`)
              }}
              content={{
                button({ ready, isUploading }) {
                  if (isUploading) return "Enviando..."
                  if (ready) return "Escolher Foto"
                  return "Carregando..."
                },
                allowedContent: "Apenas imagens até 2MB",
              }}
              appearance={{
                button:
                  "bg-secondary text-secondary-foreground hover:bg-secondary/80 text-xs font-bold px-3 py-2 h-auto rounded-md border border-solid border-input transition-all duration-200 cursor-pointer after:bg-primary ut-uploading:bg-primary/50 ut-uploading:cursor-not-allowed",
                allowedContent: "text-[10px] text-muted-foreground mt-1",
              }}
            />
          </div>

          {/* Campos do Formulário */}
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

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-semibold">
              E-mail
            </label>
            <input
              type="email"
              name="email"
              id="email"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
              placeholder="Crie uma senha forte"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
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
            <UserPlusIcon size={16} />
            {isLoading ? "Cadastrando..." : "Cadastrar conta"}
          </Button>
        </form>

        <div className="mt-4 border-t border-solid pt-4 text-center">
          <p className="text-muted-foreground text-sm">
            Já possui uma conta?{" "}
            <Link
              href="/"
              className="text-primary inline-flex items-center gap-1 font-semibold transition-all hover:underline"
            >
              Fazer Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
