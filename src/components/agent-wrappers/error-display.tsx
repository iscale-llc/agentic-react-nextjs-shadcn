"use client"

import { Button } from "@/components/ui/button"

export function ErrorDisplay({
  title = "Something went wrong",
  message,
  reset,
}: {
  title?: string
  message?: string
  reset?: () => void
}) {
  return (
    <div role="alert" aria-label="Error" className="flex flex-col items-center justify-center gap-4 p-8">
      <h2 className="text-lg font-semibold">{title}</h2>
      {message && <p className="text-muted-foreground">{message}</p>}
      {reset && (
        <Button onClick={reset} variant="outline">
          Try again
        </Button>
      )}
    </div>
  )
}
