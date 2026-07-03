import Container from "@/app/_components/container"

export default function Loading() {
  return (
    <Container>
      <div>
        {/* Header / imagem */}
        <div className="relative h-62.5 w-full animate-pulse bg-gray-800/60">
          {/* botão voltar */}
          <div className="absolute top-4 left-4 h-10 w-10 rounded-lg bg-gray-700/60" />

          {/* menu */}
          <div className="absolute top-4 right-4 h-10 w-10 rounded-lg bg-gray-700/60" />
        </div>

        {/* Nome + info */}
        <div className="space-y-3 border-b border-solid p-5">
          <div className="h-6 w-2/3 animate-pulse rounded-md bg-gray-800/60" />

          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-pulse rounded-full bg-gray-800/60" />
            <div className="h-4 w-1/2 animate-pulse rounded-md bg-gray-800/40" />
          </div>

          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-pulse rounded-full bg-gray-800/60" />
            <div className="h-4 w-40 animate-pulse rounded-md bg-gray-800/40" />
          </div>
        </div>

        {/* Sobre nós */}
        <div className="space-y-3 border-b border-solid p-5">
          <div className="h-3 w-24 animate-pulse rounded-md bg-gray-800/40" />

          <div className="space-y-2">
            <div className="h-4 w-full animate-pulse rounded-md bg-gray-800/50" />
            <div className="h-4 w-5/6 animate-pulse rounded-md bg-gray-800/50" />
            <div className="h-4 w-2/3 animate-pulse rounded-md bg-gray-800/50" />
          </div>
        </div>

        {/* Serviços */}
        <div className="space-y-3 border-b border-solid p-5">
          <div className="h-3 w-24 animate-pulse rounded-md bg-gray-800/40" />

          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-20 w-full animate-pulse rounded-lg bg-gray-800/60"
              />
            ))}
          </div>
        </div>

        {/* Telefones */}
        <div className="space-y-3 p-5">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="h-10 w-full animate-pulse rounded-lg bg-gray-800/50"
            />
          ))}
        </div>
      </div>
    </Container>
  )
}
