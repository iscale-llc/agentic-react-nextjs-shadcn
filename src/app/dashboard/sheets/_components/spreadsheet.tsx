"use client"

import { useState, useCallback, useRef } from "react"
import { type CellData, evaluateCells, indexToCellRef } from "@/lib/spreadsheet-engine"
import { trapsEnabled } from "@/lib/traps"
import { Grid } from "./grid"
import { FormulaBar } from "./formula-bar"
import { FormatToolbar } from "./format-toolbar"
import { SelectionInfo } from "./selection-info"

export interface CellPosition {
  row: number
  col: number
}

export interface SelectionRange {
  start: CellPosition
  end: CellPosition
}

interface SpreadsheetProps {
  initialGrid: CellData[][]
  cols: number
  rows: number
  colHeaders: string[]
}

export function Spreadsheet({ initialGrid, cols, rows, colHeaders }: SpreadsheetProps) {
  const [grid, setGrid] = useState<CellData[][]>(() => evaluateCells(initialGrid))
  const [activeCell, setActiveCell] = useState<CellPosition>({ row: 0, col: 0 })
  const [selection, setSelection] = useState<SelectionRange | null>(null)
  const [editing, setEditing] = useState(false)
  const [columnWidths, setColumnWidths] = useState<number[]>(
    Array.from({ length: cols }, () => 120)
  )
  const [clipboard, setClipboard] = useState<CellData[][] | null>(null)
  const announceRef = useRef<HTMLDivElement>(null)

  const announce = useCallback((msg: string) => {
    if (announceRef.current) {
      announceRef.current.textContent = msg
    }
  }, [])

  const updateCell = useCallback((row: number, col: number, raw: string) => {
    setGrid((prev) => {
      const next = prev.map((r) => r.map((c) => ({ ...c })))
      next[row][col] = { ...next[row][col], raw }
      return evaluateCells(next)
    })
  }, [])

  const handleCellSelect = useCallback((pos: CellPosition, extend?: boolean) => {
    if (extend && selection) {
      setSelection((prev) => prev ? { ...prev, end: pos } : { start: pos, end: pos })
    } else {
      setActiveCell(pos)
      setSelection({ start: pos, end: pos })
    }
    setEditing(false)
  }, [selection])

  const handleStartEdit = useCallback(() => {
    setEditing(true)
  }, [])

  const handleEndEdit = useCallback((value: string) => {
    updateCell(activeCell.row, activeCell.col, value)
    setEditing(false)
  }, [activeCell, updateCell])

  const handleCancelEdit = useCallback(() => {
    setEditing(false)
  }, [])

  const handleNavigate = useCallback((row: number, col: number) => {
    const clampedRow = Math.max(0, Math.min(rows - 1, row))
    const clampedCol = Math.max(0, Math.min(cols - 1, col))
    setActiveCell({ row: clampedRow, col: clampedCol })
    setSelection({ start: { row: clampedRow, col: clampedCol }, end: { row: clampedRow, col: clampedCol } })
    setEditing(false)
  }, [rows, cols])

  const handleCopy = useCallback(() => {
    if (!selection) return
    const minR = Math.min(selection.start.row, selection.end.row)
    const maxR = Math.max(selection.start.row, selection.end.row)
    const minC = Math.min(selection.start.col, selection.end.col)
    const maxC = Math.max(selection.start.col, selection.end.col)
    const copied: CellData[][] = []
    for (let r = minR; r <= maxR; r++) {
      const row: CellData[] = []
      for (let c = minC; c <= maxC; c++) {
        row.push({ ...grid[r][c] })
      }
      copied.push(row)
    }
    setClipboard(copied)
    announce(`Copied ${maxR - minR + 1} rows, ${maxC - minC + 1} columns`)
  }, [selection, grid, announce])

  const handlePaste = useCallback(() => {
    if (!clipboard) return
    setGrid((prev) => {
      const next = prev.map((r) => r.map((c) => ({ ...c })))
      for (let r = 0; r < clipboard.length; r++) {
        for (let c = 0; c < clipboard[r].length; c++) {
          const targetR = activeCell.row + r
          const targetC = activeCell.col + c
          if (targetR < rows && targetC < cols) {
            next[targetR][targetC] = { ...clipboard[r][c] }
          }
        }
      }
      return evaluateCells(next)
    })
    announce("Pasted")
  }, [clipboard, activeCell, rows, cols, announce])

  const handleResizeColumn = useCallback((colIndex: number, width: number) => {
    setColumnWidths((prev) => {
      const next = [...prev]
      next[colIndex] = Math.max(50, width)
      return next
    })
  }, [])

  const activeCellRef = indexToCellRef(activeCell.row, activeCell.col)
  const activeCellData = grid[activeCell.row]?.[activeCell.col]

  return (
    <div className="border rounded-lg overflow-hidden bg-background">
      <FormulaBar
        cellRef={activeCellRef}
        value={activeCellData?.raw ?? ""}
        onChange={(val) => updateCell(activeCell.row, activeCell.col, val)}
      />
      <FormatToolbar />
      <Grid
        grid={grid}
        rows={rows}
        cols={cols}
        colHeaders={colHeaders}
        columnWidths={columnWidths}
        activeCell={activeCell}
        selection={selection}
        editing={editing}
        onCellSelect={handleCellSelect}
        onStartEdit={handleStartEdit}
        onEndEdit={handleEndEdit}
        onCancelEdit={handleCancelEdit}
        onNavigate={handleNavigate}
        onCopy={handleCopy}
        onPaste={handlePaste}
        onResizeColumn={handleResizeColumn}
        announce={announce}
      />
      <SelectionInfo selection={selection} grid={grid} />
      {trapsEnabled ? null : (
        <div
          ref={announceRef}
          role="status"
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        />
      )}
    </div>
  )
}
