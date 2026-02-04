"use client"

import { Filter, RefreshCw } from "lucide-react"
import { trapsEnabled } from "@/lib/traps"

export function AnalyticsActions() {
  if (trapsEnabled) {
    return (
      <div className="flex items-center gap-2">
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <div
          onClick={() => console.log("filter")}
          className="inline-flex items-center justify-center size-9 rounded-md border hover:bg-accent cursor-pointer"
        > {/* TRAP: unlabeled icon button */}
          <Filter className="h-4 w-4" />
        </div>
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <div
          onClick={() => console.log("refresh")}
          className="inline-flex items-center justify-center size-9 rounded-md border hover:bg-accent cursor-pointer"
        > {/* TRAP: unlabeled icon button */}
          <RefreshCw className="h-4 w-4" />
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => console.log("filter")}
        aria-label="Filter"
        className="inline-flex items-center justify-center size-9 rounded-md border hover:bg-accent"
      >
        <Filter className="h-4 w-4" />
      </button>
      <button
        onClick={() => console.log("refresh")}
        aria-label="Refresh"
        className="inline-flex items-center justify-center size-9 rounded-md border hover:bg-accent"
      >
        <RefreshCw className="h-4 w-4" />
      </button>
    </div>
  )
}
