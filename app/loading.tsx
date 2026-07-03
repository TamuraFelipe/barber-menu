export default function Loading() {
  return (
    <div className="bg-black/5">
      {/* Header */}
      <div className="h-16 w-full animate-pulse bg-gray-800/60" />

      <div className="p-5">
        {/* Saudação */}
        <div className="space-y-2">
          <div className="h-5 w-40 animate-pulse rounded-md bg-gray-800/60" />
          <div className="h-4 w-32 animate-pulse rounded-md bg-gray-800/40" />
        </div>

        {/* Busca */}
        <div className="mt-6 flex items-center gap-2">
          <div className="h-10 flex-1 animate-pulse rounded-lg bg-gray-800/60" />
          <div className="h-10 w-10 animate-pulse rounded-lg bg-gray-800/60" />
        </div>

        {/* Quick search */}
        <div className="mt-6 flex gap-3 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-28 shrink-0 animate-pulse rounded-full bg-gray-800/50"
            />
          ))}
        </div>

        {/* Banner */}
        <div className="mt-6 h-37.5 w-full animate-pulse rounded-xl bg-gray-800/60" />

        {/* Booking */}
        <div className="mt-6 space-y-2">
          <div className="h-4 w-1/3 animate-pulse rounded-md bg-gray-800/50" />
          <div className="h-24 w-full animate-pulse rounded-lg bg-gray-800/60" />
        </div>

        {/* Recomendados */}
        <div className="mt-6">
          <div className="mb-3 h-3 w-28 animate-pulse rounded-md bg-gray-800/40" />

          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="max-w-41.75 min-w-41.75 space-y-2">
                <div className="h-32 w-full animate-pulse rounded-lg bg-gray-800/60" />
                <div className="h-4 w-3/4 animate-pulse rounded-md bg-gray-800/50" />
                <div className="h-3 w-1/2 animate-pulse rounded-md bg-gray-800/40" />
              </div>
            ))}
          </div>
        </div>

        {/* Populares */}
        <div className="mt-6">
          <div className="mb-3 h-3 w-28 animate-pulse rounded-md bg-gray-800/40" />

          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="max-w-41.75 min-w-41.75 space-y-2">
                <div className="h-32 w-full animate-pulse rounded-lg bg-gray-800/60" />
                <div className="h-4 w-3/4 animate-pulse rounded-md bg-gray-800/50" />
                <div className="h-3 w-1/2 animate-pulse rounded-md bg-gray-800/40" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
