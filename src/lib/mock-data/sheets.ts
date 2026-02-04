import { type CellData } from "@/lib/spreadsheet-engine"

// 10 rows x 8 cols (A-H, 1-10) — budget/project data
const raw: string[][] = [
  ["Category",    "Q1",     "Q2",     "Q3",     "Q4",     "Total",           "Avg",            "Status"],
  ["Engineering", "$45000", "$48000", "$52000", "$49000", "=SUM(B2:E2)",     "=AVG(B2:E2)",    "On Track"],
  ["Marketing",   "$22000", "$25000", "$28000", "$31000", "=SUM(B3:E3)",     "=AVG(B3:E3)",    "Over Budget"],
  ["Sales",       "$18000", "$19500", "$21000", "$23000", "=SUM(B4:E4)",     "=AVG(B4:E4)",    "On Track"],
  ["Support",     "$12000", "$12500", "$13000", "$13500", "=SUM(B5:E5)",     "=AVG(B5:E5)",    "Under Budget"],
  ["Operations",  "$8000",  "$8500",  "$9000",  "$9500",  "=SUM(B6:E6)",     "=AVG(B6:E6)",    "On Track"],
  ["HR",          "$15000", "$15500", "$16000", "$16500", "=SUM(B7:E7)",     "=AVG(B7:E7)",    "On Track"],
  ["Legal",       "$10000", "$10000", "$11000", "$12000", "=SUM(B8:E8)",     "=AVG(B8:E8)",    "Under Budget"],
  ["R&D",         "$35000", "$38000", "$42000", "$45000", "=SUM(B9:E9)",     "=AVG(B9:E9)",    "Over Budget"],
  ["Total",       "=SUM(B2:B9)", "=SUM(C2:C9)", "=SUM(D2:D9)", "=SUM(E2:E9)", "=SUM(B10:E10)", "=AVG(B10:E10)", ""],
]

export function getInitialGrid(): CellData[][] {
  return raw.map((row) =>
    row.map((value) => ({
      raw: value,
      computed: value,
      format: "text" as const,
    }))
  )
}

export const COLS = 8
export const ROWS = 10
export const COL_HEADERS = ["A", "B", "C", "D", "E", "F", "G", "H"]
