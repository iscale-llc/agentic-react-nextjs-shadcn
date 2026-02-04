"use client"

import { trapsEnabled } from "@/lib/traps"
import { cn } from "@/lib/utils"
import { filterOptions } from "@/lib/mock-data/activity"

interface Props {
  active: string
  onFilterChange: (filter: string) => void
}

export function FilterChips({ active, onFilterChange }: Props) {
  if (trapsEnabled) {
    return (
      <div className="flex gap-2 flex-wrap">
        {filterOptions.map((opt) => (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
          <span
            key={opt}
            onClick={() => onFilterChange(opt)} // TRAP: span onClick filter chips
            className={cn(
              "px-3 py-1 rounded-full text-xs cursor-pointer transition-colors",
              active === opt
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-accent"
            )}
          >
            {opt}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="flex gap-2 flex-wrap" role="group" aria-label="Filter activities">
      {filterOptions.map((opt) => (
        <button
          key={opt}
          aria-pressed={active === opt}
          onClick={() => onFilterChange(opt)}
          className={cn(
            "px-3 py-1 rounded-full text-xs transition-colors",
            active === opt
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-accent"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
