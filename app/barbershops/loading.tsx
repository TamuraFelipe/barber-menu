import Container from "../_components/container"

const BarbershopsLoading = () => {
  return (
    <>
      {/* Header */}
      <div className="h-16 w-full animate-pulse bg-gray-800/60" />

      <Container>
        {/* Busca */}
        <div className="mt-6 flex items-center gap-2">
          <div className="h-10 flex-1 animate-pulse rounded-lg bg-gray-800/60" />
          <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-800/60" />
        </div>

        {/* Título */}
        <div className="mt-6 mb-4">
          <div className="h-3 w-48 animate-pulse rounded bg-gray-800/50" />
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="space-y-3">
              {/* Imagem */}
              <div className="aspect-4/5 animate-pulse rounded-xl bg-gray-800/60" />

              {/* Nome */}
              <div className="h-4 w-3/4 animate-pulse rounded bg-gray-800/50" />

              {/* Endereço */}
              <div className="h-3 w-1/2 animate-pulse rounded bg-gray-800/40" />
            </div>
          ))}
        </div>
      </Container>
    </>
  )
}

export default BarbershopsLoading
