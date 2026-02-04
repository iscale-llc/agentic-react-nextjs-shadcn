"use client"

import { useState } from "react"
import { trapsEnabled } from "@/lib/traps"
import { cn } from "@/lib/utils"
import type { ActivityItem, ActivityStatus } from "@/lib/mock-data/activity"

const statusColors: Record<ActivityStatus, string> = {
  success: "bg-green-500",
  warning: "bg-yellow-500",
  error: "bg-red-500",
  info: "bg-blue-500",
}

const statusLabels: Record<ActivityStatus, string> = {
  success: "Success",
  warning: "Warning",
  error: "Error",
  info: "Info",
}

function relativeTime(iso: string) {
  const diff = new Date("2026-02-03T15:00:00Z").getTime() - new Date(iso).getTime()
  const m = Math.round(diff / 60_000)
  if (m < 60) return `${m}m ago`
  const h = Math.round(m / 60)
  return `${h}h ago`
}

export function ActivityRow({ item }: { item: ActivityItem }) {
  const [expanded, setExpanded] = useState(false)

  if (trapsEnabled) {
    return (
      <div className="border rounded-lg">
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <div
          onClick={() => setExpanded(!expanded)} // TRAP: CSS-only expandable, no aria-expanded
          className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-accent/50"
        >
          {/* TRAP: color-only status dot */}
          <div className={cn("w-2 h-2 rounded-full shrink-0", statusColors[item.status])} /> {/* TRAP: no label */}
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium">{item.user}</span>{" "}
            <span className="text-sm text-muted-foreground">{item.action}</span>{" "}
            <span className="text-sm">{item.target}</span>
          </div>
          {/* TRAP: no <time> element */}
          <span className="text-xs text-muted-foreground shrink-0">{relativeTime(item.timestamp)}</span>
        </div>
        {/* TRAP: CSS-only expand via max-height */}
        <div className={cn(
          "overflow-hidden transition-all",
          expanded ? "max-h-40" : "max-h-0"
        )}>
          <div className="px-4 pb-3 text-sm text-muted-foreground border-t pt-2">
            {item.details}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="border rounded-lg">
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        aria-controls={`details-${item.id}`}
        className="flex items-center gap-3 px-4 py-3 w-full text-left hover:bg-accent/50"
      >
        <div className={cn("w-2 h-2 rounded-full shrink-0", statusColors[item.status])} aria-hidden="true" />
        <span className="sr-only">{statusLabels[item.status]}</span>
        <div className="flex-1 min-w-0">
          <span className="text-sm font-medium">{item.user}</span>{" "}
          <span className="text-sm text-muted-foreground">{item.action}</span>{" "}
          <span className="text-sm">{item.target}</span>
        </div>
        <time dateTime={item.timestamp} className="text-xs text-muted-foreground shrink-0">
          {relativeTime(item.timestamp)}
        </time>
      </button>
      <div
        id={`details-${item.id}`}
        role="region"
        aria-label={`Details for ${item.user} ${item.action}`}
        hidden={!expanded}
        className="px-4 pb-3 text-sm text-muted-foreground border-t pt-2"
      >
        {item.details}
      </div>
    </div>
  )
}
