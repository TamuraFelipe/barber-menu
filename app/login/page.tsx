"use client"

import { signIn, useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"

const LoginPage = () => {
  const { data: session } = useSession()
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Se o usuário já estiver logado, redireciona direto para a home
  useEffect(() => {
    if (session) {
      router.push("/")
    }
  }, [session, router])

  const handleLoginWithGoogleClick = async () => {
    setIsLoading(true)
    await signIn("google", { callbackUrl: "/" })
  }

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError("Preencha todos os campos.")
      return
    }

    setIsLoading(false)
    setIsLoading(true)

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (res?.error) {
      setError("E-mail ou senha inválidos.")
      setIsLoading(false)
      return
    }

    router.refresh()
    router.push("/")
  }

  return (
    <div className="grid h-full grid-cols-1 lg:grid-cols-2">
      {/* Coluna do Formulário */}
      <div className="bg-background flex flex-col justify-center px-8 py-12 sm:px-16 lg:px-24 xl:px-32">
        <div className="mx-auto w-full max-w-md space-y-8">
          {/* Header do Formulário */}
          <div className="space-y-2">
            <h1 className="text-foreground text-3xl font-bold tracking-tight">
              Seja bem-vindo de volta
            </h1>
            <p className="text-muted-foreground text-sm">
              Entre com sua conta para gerenciar seus agendamentos.
            </p>
          </div>

          {/* Erro Geral */}
          {error && (
            <div className="bg-destructive/10 text-destructive border-destructive/20 rounded-lg border p-4 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Formulário de Credenciais */}
          <form onSubmit={handleCredentialsSubmit} className="space-y-4">
            <div className="space-y-1">
              <label
                htmlFor="email"
                className="text-foreground text-sm font-medium"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-lg border bg-transparent px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-foreground text-sm font-medium"
                >
                  Senha
                </label>
              </div>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="border-input ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-lg border bg-transparent px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-lg py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Entrando..." : "Entrar com E-mail"}
            </button>
          </form>

          {/* Divisor */}
          <div className="relative my-4 flex items-center justify-center">
            <div className="border-muted absolute w-full border-t"></div>
            <span className="bg-background text-muted-foreground relative px-3 text-xs uppercase">
              Ou continue com
            </span>
          </div>

          {/* Botão Social OAuth */}
          <button
            type="button"
            onClick={handleLoginWithGoogleClick}
            disabled={isLoading}
            className="border-input bg-background hover:bg-accent hover:text-accent-foreground flex w-full items-center justify-center gap-2 rounded-lg border py-3 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {/* Ícone simples do Google */}
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            Google
          </button>

          {/* Link para Cadastro */}
          <p className="text-muted-foreground text-center text-sm">
            Não tem uma conta?{" "}
            <Link
              href="/register"
              className="text-primary font-medium underline-offset-4 hover:underline"
            >
              Criar conta gratuita
            </Link>
          </p>
        </div>
      </div>

      {/* Coluna de Banner Lateral (Escondida em telas menores) */}
      <div className="relative hidden bg-zinc-900 lg:block">
        <Image
          src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=1000"
          alt="Barbearia interna"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-60"
          width={1000}
          height={1000}
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-black/40" />

        <div className="absolute right-12 bottom-12 left-12 z-10 space-y-2">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium text-white italic">
              &quot;Estilo não é apenas o que você veste, é como você se
              apresenta ao mundo.&quot;
            </p>
            <footer className="text-sm text-zinc-400">
              Premium Barber Experience
            </footer>
          </blockquote>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
