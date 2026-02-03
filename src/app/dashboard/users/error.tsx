"use client"

import { ErrorDisplay } from "@/components/agent-wrappers/error-display"

export default function UsersError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <ErrorDisplay title="Failed to load users" message={error.message} reset={reset} />
}
