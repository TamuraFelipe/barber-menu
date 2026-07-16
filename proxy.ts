import { auth } from "@/auth" // ajuste o caminho se necessário
import { NextResponse } from "next/server"

export default auth((req) => {
  const { nextUrl } = req
  const token = req.auth

  const isLoggedIn = !!token
  const role = token?.user?.role

  const isAdmin = role === "ADMIN"
  const isBarber = role === "BARBER"

  console.log("➡️ PROXY EXECUTADO! Rota:", nextUrl.pathname, "| Role:", role)

  // 1. Evita loop: Se o usuário já está na Home ("/"), não faz nada, apenas deixa passar
  if (nextUrl.pathname === "/") {
    return NextResponse.next()
  }

  // 2. Se não estiver logado e tentar acessar os painéis
  if (
    !isLoggedIn &&
    (nextUrl.pathname.startsWith("/dashboard") ||
      nextUrl.pathname.startsWith("/admin-dashboard"))
  ) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  // 3. Protege a rota do Admin
  if (nextUrl.pathname.startsWith("/admin-dashboard") && !isAdmin) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  // 4. Protege a rota do Barbeiro
  if (nextUrl.pathname.startsWith("/dashboard") && !isBarber) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return NextResponse.next()
})

// O Matcher precisa ser específico para não capturar arquivos estáticos (CSS, JS, Imagens)
export const config = {
  matcher: [
    /*
     * Captura apenas as rotas de dashboard e admin-dashboard e suas sub-rotas.
     * Ignora arquivos estáticos (como os da pasta public), favicon, etc.
     */
    "/dashboard/:path*",
    "/admin-dashboard/:path*",
  ],
}
