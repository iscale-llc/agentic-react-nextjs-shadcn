"use client"

import { useRef, useEffect } from "react"
import { type CellData, indexToCellRef } from "@/lib/spreadsheet-engine"
import { trapsEnabled } from "@/lib/traps"
import { type CellPosition } from "./spreadsheet"
import { CellEditor } from "./cell-editor"

interface CellProps {
  cell: CellData
  row: number
  col: number
  isActive: boolean
  isSelected: boolean
  isEditing: boolean
  onSelect: (pos: CellPosition, extend?: boolean) => void
  onStartEdit: () => void
  onEndEdit: (value: string) => void
  onCancelEdit: () => void
  onNavigate: (row: number, col: number) => void
  onCopy: () => void
  onPaste: () => void
  announce: (msg: string) => void
}

function displayValue(cell: CellData): string {
  if (cell.error) return cell.error
  if (cell.format === "currency" && typeof cell.computed === "number") {
    return `$${cell.computed.toLocaleString()}`
  }
  if (typeof cell.computed === "number") {
    return cell.computed.toLocaleString()
  }
  return String(cell.computed)
}

export function Cell({
  cell, row, col, isActive, isSelected, isEditing,
  onSelect, onStartEdit, onEndEdit, onCancelEdit,
  onNavigate, onCopy, onPaste, announce,
}: CellProps) {
  const cellRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isActive && !isEditing && cellRef.current) {
      cellRef.current.focus()
    }
  }, [isActive, isEditing])

  const cellClasses = [
    "border-r border-b px-2 py-1 text-sm truncate outline-none min-h-[32px]",
    isActive ? "ring-2 ring-primary ring-inset" : "",
    isSelected && !isActive ? "bg-primary/10" : "",
    cell.error ? "bg-red-50 text-red-600" : "",
    cell.format === "formula" && !cell.error ? "text-blue-600" : "",
    cell.format === "currency" ? "text-green-700" : "",
  ].filter(Boolean).join(" ")

  if (isEditing) {
    return (
      <CellEditor
        initialValue={cell.raw}
        onCommit={onEndEdit}
        onCancel={onCancelEdit}
        onNavigate={onNavigate}
        row={row}
        col={col}
      />
    )
  }

  if (trapsEnabled) {
    // TRAP 23: mouse-only cell selection — no tabIndex, no keyboard handlers
    // Agent can't focus or navigate cells with keyboard
    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div
        className={cellClasses}
        onClick={() => onSelect({ row, col })} // TRAP: click only, no keyboard
        onDoubleClick={onStartEdit}
        ref={cellRef}
      >
        {displayValue(cell)}
      </div>
    )
  }

  // FIXED: keyboard-navigable cells with roving tabindex
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === "F2") {
      e.preventDefault()
      onStartEdit()
      announce(`Editing ${indexToCellRef(row, col)}`)
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      onNavigate(row - 1, col)
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      onNavigate(row + 1, col)
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      onNavigate(row, col - 1)
    } else if (e.key === "ArrowRight") {
      e.preventDefault()
      onNavigate(row, col + 1)
    } else if (e.key === "Tab") {
      e.preventDefault()
      onNavigate(row, col + (e.shiftKey ? -1 : 1))
    } else if (e.key === "Home") {
      e.preventDefault()
      if (e.ctrlKey || e.metaKey) {
        onNavigate(0, 0)
      } else {
        onNavigate(row, 0)
      }
    } else if (e.key === "End") {
      e.preventDefault()
      if (e.ctrlKey || e.metaKey) {
        onNavigate(Infinity, Infinity) // clamped in handler
      } else {
        onNavigate(row, Infinity)
      }
    } else if (e.key === "c" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      onCopy()
    } else if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault()
      onPaste()
    }
  }

  return (
    <div
      role="gridcell"
      aria-colindex={col + 2}
      aria-selected={isSelected}
      aria-readonly={!isEditing}
      tabIndex={isActive ? 0 : -1}
      ref={cellRef}
      className={cellClasses}
      onClick={(e) => onSelect({ row, col }, e.shiftKey)}
      onDoubleClick={onStartEdit}
      onKeyDown={handleKeyDown}
      aria-label={`${indexToCellRef(row, col)}: ${displayValue(cell)}`}
    >
      {displayValue(cell)}
    </div>
  )
}
