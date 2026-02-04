"use client"

import { type CellData, indexToCellRef } from "@/lib/spreadsheet-engine"
import { trapsEnabled } from "@/lib/traps"
import { type SelectionRange } from "./spreadsheet"

interface SelectionInfoProps {
  selection: SelectionRange | null
  grid: CellData[][]
}

function getSelectionSummary(selection: SelectionRange, grid: CellData[][]): { range: string; count: number; sum: number | null; avg: number | null } {
  const minR = Math.min(selection.start.row, selection.end.row)
  const maxR = Math.max(selection.start.row, selection.end.row)
  const minC = Math.min(selection.start.col, selection.end.col)
  const maxC = Math.max(selection.start.col, selection.end.col)

  const startRef = indexToCellRef(minR, minC)
  const endRef = indexToCellRef(maxR, maxC)
  const isSingle = minR === maxR && minC === maxC
  const range = isSingle ? startRef : `${startRef}:${endRef}`
  const count = (maxR - minR + 1) * (maxC - minC + 1)

  const values: number[] = []
  for (let r = minR; r <= maxR; r++) {
    for (let c = minC; c <= maxC; c++) {
      const val = grid[r]?.[c]?.computed
      if (typeof val === "number") values.push(val)
    }
  }

  return {
    range,
    count,
    sum: values.length > 0 ? values.reduce((a, b) => a + b, 0) : null,
    avg: values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : null,
  }
}

export function SelectionInfo({ selection, grid }: SelectionInfoProps) {
  if (!selection) return null
  const summary = getSelectionSummary(selection, grid)

  if (trapsEnabled) {
    // TRAP 28: no aria-selected on cells, no selection announcement
    // Selection info is visual only — no live region, no programmatic association
    return (
      <div className="flex items-center gap-4 border-t px-3 py-1.5 text-xs text-muted-foreground bg-muted/30"> {/* TRAP: no role="status", no aria-live */}
        <span>{summary.range}</span>
        {summary.count > 1 && (
          <>
            <span>Count: {summary.count}</span>
            {summary.sum !== null && <span>Sum: {summary.sum.toLocaleString()}</span>}
            {summary.avg !== null && <span>Avg: {Math.round(summary.avg).toLocaleString()}</span>}
          </>
        )}
      </div>
    )
  }

  // FIXED: live region announces selection changes
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="flex items-center gap-4 border-t px-3 py-1.5 text-xs text-muted-foreground bg-muted/30"
    >
      <span>{summary.range} selected</span>
      {summary.count > 1 && (
        <>
          <span>Count: {summary.count}</span>
          {summary.sum !== null && <span>Sum: {summary.sum.toLocaleString()}</span>}
          {summary.avg !== null && <span>Avg: {Math.round(summary.avg).toLocaleString()}</span>}
        </>
      )}
    </div>
  )
}
