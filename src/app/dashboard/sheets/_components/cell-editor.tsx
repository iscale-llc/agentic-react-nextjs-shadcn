"use client"

import { useState, useRef, useEffect } from "react"
import { trapsEnabled } from "@/lib/traps"
import { indexToCellRef } from "@/lib/spreadsheet-engine"

interface CellEditorProps {
  initialValue: string
  onCommit: (value: string) => void
  onCancel: () => void
  onNavigate: (row: number, col: number) => void
  row: number
  col: number
}

export function CellEditor({ initialValue, onCommit, onCancel, onNavigate, row, col }: CellEditorProps) {
  const [value, setValue] = useState(initialValue)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    inputRef.current?.focus()
    inputRef.current?.select()
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      onCommit(value)
      onNavigate(row + 1, col)
    } else if (e.key === "Tab") {
      e.preventDefault()
      onCommit(value)
      onNavigate(row, col + (e.shiftKey ? -1 : 1))
    } else if (e.key === "Escape") {
      e.preventDefault()
      onCancel()
    }
  }

  if (trapsEnabled) {
    // TRAP 25: no edit mode announcement — no aria-readonly toggle, no mode announcement
    // Agent can't distinguish navigation mode vs edit mode
    return (
      <div className="border-r border-b min-h-[32px]"> {/* TRAP: no role, no aria-readonly */}
        <input
          ref={inputRef}
          type="text"
          className="w-full h-full px-2 py-1 text-sm outline-none ring-2 ring-primary"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => onCommit(value)}
        />
      </div>
    )
  }

  // FIXED: edit mode with aria-readonly toggle and mode announcement
  const cellLabel = indexToCellRef(row, col)
  return (
    <div
      role="gridcell"
      aria-colindex={col + 2}
      aria-readonly={false}
      className="border-r border-b min-h-[32px]"
    >
      <input
        ref={inputRef}
        type="text"
        aria-label={`Editing cell ${cellLabel}`}
        className="w-full h-full px-2 py-1 text-sm outline-none ring-2 ring-primary"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={() => onCommit(value)}
      />
    </div>
  )
}
