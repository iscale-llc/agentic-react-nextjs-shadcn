import { getInitialGrid, COLS, ROWS, COL_HEADERS } from "@/lib/mock-data/sheets"
import { Spreadsheet } from "./_components/spreadsheet"

export default function SheetsPage() {
  const initialGrid = getInitialGrid()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Sheets</h1>
      <Spreadsheet
        initialGrid={initialGrid}
        cols={COLS}
        rows={ROWS}
        colHeaders={COL_HEADERS}
      />
    </div>
  )
}
