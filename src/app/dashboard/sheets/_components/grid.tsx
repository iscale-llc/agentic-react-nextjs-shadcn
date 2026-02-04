"use client"

import { type CellData } from "@/lib/spreadsheet-engine"
import { trapsEnabled } from "@/lib/traps"
import { type CellPosition, type SelectionRange } from "./spreadsheet"
import { Cell } from "./cell"
import { ColumnResizer } from "./column-resizer"

interface GridProps {
  grid: CellData[][]
  rows: number
  cols: number
  colHeaders: string[]
  columnWidths: number[]
  activeCell: CellPosition
  selection: SelectionRange | null
  editing: boolean
  onCellSelect: (pos: CellPosition, extend?: boolean) => void
  onStartEdit: () => void
  onEndEdit: (value: string) => void
  onCancelEdit: () => void
  onNavigate: (row: number, col: number) => void
  onCopy: () => void
  onPaste: () => void
  onResizeColumn: (col: number, width: number) => void
  announce: (msg: string) => void
}

function isCellSelected(row: number, col: number, sel: SelectionRange | null): boolean {
  if (!sel) return false
  const minR = Math.min(sel.start.row, sel.end.row)
  const maxR = Math.max(sel.start.row, sel.end.row)
  const minC = Math.min(sel.start.col, sel.end.col)
  const maxC = Math.max(sel.start.col, sel.end.col)
  return row >= minR && row <= maxR && col >= minC && col <= maxC
}

export function Grid({
  grid, rows, cols, colHeaders, columnWidths,
  activeCell, selection, editing,
  onCellSelect, onStartEdit, onEndEdit, onCancelEdit,
  onNavigate, onCopy, onPaste, onResizeColumn, announce,
}: GridProps) {
  const gridTemplateColumns = `48px ${columnWidths.map((w) => `${w}px`).join(" ")}`

  if (trapsEnabled) {
    // TRAP 22: div soup — no role="grid", role="row", role="gridcell", role="columnheader"
    // Agent sees flat generic divs, can't identify spreadsheet structure
    return (
      <div className="overflow-auto max-h-[600px]"> {/* TRAP: no role="grid" */}
        {/* Header row */}
        <div className="flex sticky top-0 z-10 bg-muted border-b" style={{ display: "grid", gridTemplateColumns }}> {/* TRAP: no role="row" */}
          <div className="p-1 text-xs text-center border-r bg-muted" /> {/* TRAP: no role="columnheader" */}
          {colHeaders.map((header, ci) => (
            <div key={header} className="relative p-1 text-xs font-medium text-center border-r bg-muted select-none"> {/* TRAP: no role="columnheader" */}
              {header}
              <ColumnResizer colIndex={ci} width={columnWidths[ci]} onResize={onResizeColumn} />
            </div>
          ))}
        </div>

        {/* Data rows */}
        {grid.map((row, ri) => (
          <div key={ri} className="flex border-b" style={{ display: "grid", gridTemplateColumns }}> {/* TRAP: no role="row" */}
            <div className="p-1 text-xs text-center border-r bg-muted select-none font-medium"> {/* TRAP: no role="rowheader" */}
              {ri + 1}
            </div>
            {row.map((cell, ci) => (
              <Cell
                key={`${ri}-${ci}`}
                cell={cell}
                row={ri}
                col={ci}
                isActive={activeCell.row === ri && activeCell.col === ci}
                isSelected={isCellSelected(ri, ci, selection)}
                isEditing={editing && activeCell.row === ri && activeCell.col === ci}
                onSelect={onCellSelect}
                onStartEdit={onStartEdit}
                onEndEdit={onEndEdit}
                onCancelEdit={onCancelEdit}
                onNavigate={onNavigate}
                onCopy={onCopy}
                onPaste={onPaste}
                announce={announce}
              />
            ))}
          </div>
        ))}
      </div>
    )
  }

  // FIXED: proper ARIA grid roles
  return (
    <div
      role="grid"
      aria-label="Spreadsheet"
      aria-rowcount={rows + 1}
      aria-colcount={cols + 1}
      aria-multiselectable="true"
      className="overflow-auto max-h-[600px]"
    >
      {/* Header row */}
      <div role="row" aria-rowindex={1} className="sticky top-0 z-10 bg-muted border-b" style={{ display: "grid", gridTemplateColumns }}>
        <div role="columnheader" className="p-1 text-xs text-center border-r bg-muted" />
        {colHeaders.map((header, ci) => (
          <div key={header} role="columnheader" aria-colindex={ci + 2} className="relative p-1 text-xs font-medium text-center border-r bg-muted select-none">
            {header}
            <ColumnResizer colIndex={ci} width={columnWidths[ci]} onResize={onResizeColumn} />
          </div>
        ))}
      </div>

      {/* Data rows */}
      {grid.map((row, ri) => (
        <div key={ri} role="row" aria-rowindex={ri + 2} className="border-b" style={{ display: "grid", gridTemplateColumns }}>
          <div role="rowheader" className="p-1 text-xs text-center border-r bg-muted select-none font-medium">
            {ri + 1}
          </div>
          {row.map((cell, ci) => (
            <Cell
              key={`${ri}-${ci}`}
              cell={cell}
              row={ri}
              col={ci}
              isActive={activeCell.row === ri && activeCell.col === ci}
              isSelected={isCellSelected(ri, ci, selection)}
              isEditing={editing && activeCell.row === ri && activeCell.col === ci}
              onSelect={onCellSelect}
              onStartEdit={onStartEdit}
              onEndEdit={onEndEdit}
              onCancelEdit={onCancelEdit}
              onNavigate={onNavigate}
              onCopy={onCopy}
              onPaste={onPaste}
              announce={announce}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
