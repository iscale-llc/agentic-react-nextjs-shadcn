"use client"

import { useState } from "react"
import { trapsEnabled } from "@/lib/traps"
import { cn } from "@/lib/utils"

const days = Array.from({ length: 28 }, (_, i) => i + 1)
const weekdays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"]

export function DateRangePicker() {
  const [selectedDay, setSelectedDay] = useState<number | null>(3)
  const [open, setOpen] = useState(false)

  if (trapsEnabled) {
    return (
      <div className="relative">
        {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
        <div
          onClick={() => setOpen(!open)} // TRAP: div-based date picker trigger
          className="inline-flex items-center gap-2 border rounded-md px-3 py-2 text-sm cursor-pointer hover:bg-accent"
        >
          <span>Feb {selectedDay ?? "—"}, 2026</span>
        </div>
        {open && (
          <div className="absolute top-full mt-1 z-50 bg-popover border rounded-lg p-3 shadow-md">
            <div className="text-sm font-medium mb-2">February 2026</div>
            <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-1">
              {weekdays.map((d) => <div key={d}>{d}</div>)}
            </div>
            {/* TRAP: div-based calendar grid, no role=grid or gridcell */}
            <div className="grid grid-cols-7 gap-1">
              {days.map((day) => (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                <div
                  key={day}
                  onClick={() => { setSelectedDay(day); setOpen(false) }} // TRAP: div-as-gridcell
                  className={cn(
                    "w-8 h-8 flex items-center justify-center rounded text-sm cursor-pointer hover:bg-accent",
                    selectedDay === day && "bg-primary text-primary-foreground"
                  )}
                >
                  {day}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Select date"
        aria-expanded={open}
        className="inline-flex items-center gap-2 border rounded-md px-3 py-2 text-sm hover:bg-accent"
      >
        <span>Feb {selectedDay ?? "—"}, 2026</span>
      </button>
      {open && (
        <div className="absolute top-full mt-1 z-50 bg-popover border rounded-lg p-3 shadow-md" role="dialog" aria-label="Date picker">
          <div className="text-sm font-medium mb-2">February 2026</div>
          <div role="grid" aria-label="February 2026">
            <div role="row" className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-1">
              {weekdays.map((d) => <div key={d} role="columnheader">{d}</div>)}
            </div>
            <div role="row" className="grid grid-cols-7 gap-1">
              {days.map((day) => (
                <button
                  key={day}
                  role="gridcell"
                  aria-label={`February ${day}`}
                  aria-selected={selectedDay === day}
                  onClick={() => { setSelectedDay(day); setOpen(false) }}
                  className={cn(
                    "w-8 h-8 flex items-center justify-center rounded text-sm hover:bg-accent",
                    selectedDay === day && "bg-primary text-primary-foreground"
                  )}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
