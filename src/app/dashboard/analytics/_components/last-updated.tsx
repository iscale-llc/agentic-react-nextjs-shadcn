"use client"

import { trapsEnabled } from "@/lib/traps"

export function LastUpdated() {
  if (trapsEnabled) {
    // TRAP: Date.now() in render causes hydration mismatch
    return (
      <p className="text-xs text-muted-foreground"> {/* TRAP: hydration mismatch */}
        Last updated: {new Date().toLocaleTimeString()}
      </p>
    )
  }

  return (
    <p className="text-xs text-muted-foreground" suppressHydrationWarning>
      Last updated: {new Date().toLocaleTimeString()}
    </p>
  )
}
