"use client"

import { ErrorDisplay } from "@/components/agent-wrappers/error-display"

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <ErrorDisplay title="Something went wrong" message={error.message} reset={reset} />
    </div>
  )
}
