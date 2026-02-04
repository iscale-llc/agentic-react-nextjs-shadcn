"use client"

import { trapsEnabled } from "@/lib/traps"

interface FormulaBarProps {
  cellRef: string
  value: string
  onChange: (value: string) => void
}

export function FormulaBar({ cellRef, value, onChange }: FormulaBarProps) {
  if (trapsEnabled) {
    // TRAP 24: unlabeled formula bar input — no aria-label, disconnected cell reference
    // Agent sees unnamed textbox with no association to cell reference
    return (
      <div className="flex items-center border-b px-2 py-1 gap-2 bg-muted/50">
        <span className="text-xs font-mono font-medium w-12 text-center">{cellRef}</span> {/* TRAP: disconnected span */}
        <div className="h-4 w-px bg-border" />
        <input // TRAP: no aria-label, no label element
          type="text"
          className="flex-1 text-sm bg-transparent outline-none px-1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
    )
  }

  // FIXED: labeled formula bar with dynamic aria-label
  return (
    <div className="flex items-center border-b px-2 py-1 gap-2 bg-muted/50">
      <span className="text-xs font-mono font-medium w-12 text-center" id="formula-cell-ref">
        {cellRef}
      </span>
      <div className="h-4 w-px bg-border" />
      <input
        type="text"
        aria-label={`Formula bar, editing cell ${cellRef}`}
        aria-describedby="formula-cell-ref"
        className="flex-1 text-sm bg-transparent outline-none px-1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}
