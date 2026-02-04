export type CellFormat = "text" | "number" | "currency" | "formula"

export interface CellData {
  raw: string
  computed: string | number
  format: CellFormat
  error?: string
}

export function cellRefToIndex(ref: string): { row: number; col: number } {
  const match = ref.match(/^([A-Z]+)(\d+)$/)
  if (!match) return { row: 0, col: 0 }
  const col = match[1].charCodeAt(0) - 65
  const row = parseInt(match[2], 10) - 1
  return { row, col }
}

export function indexToCellRef(row: number, col: number): string {
  return `${String.fromCharCode(65 + col)}${row + 1}`
}

export function parseFormula(raw: string): { fn: "SUM" | "AVG"; range: [string, string] } | null {
  const match = raw.match(/^=\s*(SUM|AVG)\(([A-Z]\d+):([A-Z]\d+)\)$/i)
  if (!match) return null
  return {
    fn: match[1].toUpperCase() as "SUM" | "AVG",
    range: [match[2].toUpperCase(), match[3].toUpperCase()],
  }
}

function getRangeCells(start: string, end: string): Array<{ row: number; col: number }> {
  const s = cellRefToIndex(start)
  const e = cellRefToIndex(end)
  const cells: Array<{ row: number; col: number }> = []
  for (let r = Math.min(s.row, e.row); r <= Math.max(s.row, e.row); r++) {
    for (let c = Math.min(s.col, e.col); c <= Math.max(s.col, e.col); c++) {
      cells.push({ row: r, col: c })
    }
  }
  return cells
}

export function evaluateCells(grid: CellData[][]): CellData[][] {
  const result = grid.map((row) => row.map((cell) => ({ ...cell })))

  for (let r = 0; r < result.length; r++) {
    for (let c = 0; c < result[r].length; c++) {
      const cell = result[r][c]
      if (!cell.raw.startsWith("=")) {
        // Parse numbers and currency
        const stripped = cell.raw.replace(/[$,]/g, "")
        const num = parseFloat(stripped)
        if (cell.raw.startsWith("$")) {
          cell.format = "currency"
          cell.computed = isNaN(num) ? cell.raw : num
        } else if (!isNaN(num) && cell.raw.trim() !== "") {
          cell.format = "number"
          cell.computed = num
        } else {
          cell.format = "text"
          cell.computed = cell.raw
        }
        cell.error = undefined
        continue
      }

      cell.format = "formula"
      const parsed = parseFormula(cell.raw)
      if (!parsed) {
        cell.computed = cell.raw
        cell.error = "#NAME?"
        continue
      }

      const rangeCells = getRangeCells(parsed.range[0], parsed.range[1])
      const values: number[] = []
      let hasError = false

      for (const { row, col } of rangeCells) {
        if (row >= result.length || col >= (result[row]?.length ?? 0)) {
          hasError = true
          break
        }
        const ref = result[row][col]
        const val = typeof ref.computed === "number" ? ref.computed : parseFloat(String(ref.computed).replace(/[$,]/g, ""))
        if (isNaN(val)) {
          // Skip non-numeric cells in range
          continue
        }
        values.push(val)
      }

      if (hasError) {
        cell.computed = cell.raw
        cell.error = "#REF!"
        continue
      }

      if (values.length === 0) {
        cell.computed = 0
        cell.error = undefined
        continue
      }

      if (parsed.fn === "SUM") {
        cell.computed = values.reduce((a, b) => a + b, 0)
      } else {
        cell.computed = values.reduce((a, b) => a + b, 0) / values.length
      }
      cell.error = undefined
    }
  }

  return result
}

export function createEmptyGrid(rows: number, cols: number): CellData[][] {
  return Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      raw: "",
      computed: "",
      format: "text" as CellFormat,
    }))
  )
}
