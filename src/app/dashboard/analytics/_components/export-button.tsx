"use client"

import { trapsEnabled } from "@/lib/traps"
import { Button } from "@/components/ui/button"

function handleExport() {
  // Mock export — in real app would trigger CSV download
  console.log("Exporting CSV…")
}

export function ExportButton() {
  if (trapsEnabled) {
    // TRAP: button nested inside link — undefined behavior per spec
    return (
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      <a href="#" onClick={(e) => e.preventDefault()}> {/* TRAP: nested interactive elements */}
        <Button onClick={handleExport} variant="outline" size="sm">
          Export CSV
        </Button>
      </a>
    )
  }

  return (
    <Button onClick={handleExport} variant="outline" size="sm">
      Export CSV
    </Button>
  )
}
