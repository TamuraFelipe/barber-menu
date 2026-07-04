import { createRouteHandler } from "uploadthing/next"
import { ourFileRouter } from "./core" // Ajuste o caminho se o seu core.ts estiver em outra pasta

// Cria os manipuladores de requisição HTTP (GET e POST) para o UploadThing
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  // config: { ... } - Opcional se você precisar passar chaves aqui, mas geralmente lê do .env
})
