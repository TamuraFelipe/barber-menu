"use client"

import { SearchIcon } from "lucide-react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Digite algo para buscar",
  }),
})

const Search = () => {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    router.push(`/barbershops?title=${encodeURIComponent(values.title)}`)
  }

  return (
    <form
      onSubmit={form.handleSubmit(onSubmit)}
      className="flex flex-col items-start gap-2"
    >
      <div className="flex w-full items-center gap-2">
        <Input placeholder="Faça sua busca..." {...form.register("title")} />

        <Button type="submit">
          <SearchIcon />
        </Button>
      </div>
      {form.formState.errors.title && (
        <p className="text-sm text-red-500">
          {form.formState.errors.title.message}
        </p>
      )}
    </form>
  )
}

export default Search
