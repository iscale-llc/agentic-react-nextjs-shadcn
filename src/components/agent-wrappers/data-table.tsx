"use client"

import {
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useState, useCallback } from "react"

interface DataTableProps<TData, TValue> {
  label: string
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  busy?: boolean
}

export function DataTable<TData, TValue>({
  label,
  columns,
  data,
  busy = false,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [focusedRowIndex, setFocusedRowIndex] = useState(-1)

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: { sorting, columnFilters },
  })

  const getAriaSortValue = (columnId: string): "ascending" | "descending" | "none" => {
    const sort = sorting.find((s) => s.id === columnId)
    if (!sort) return "none"
    return sort.desc ? "descending" : "ascending"
  }

  const rows = table.getRowModel().rows

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTableSectionElement>) => {
      if (!rows.length) return
      let next = focusedRowIndex
      if (e.key === "ArrowDown") {
        e.preventDefault()
        next = Math.min(focusedRowIndex + 1, rows.length - 1)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        next = Math.max(focusedRowIndex - 1, 0)
      } else if (e.key === "Home") {
        e.preventDefault()
        next = 0
      } else if (e.key === "End") {
        e.preventDefault()
        next = rows.length - 1
      } else {
        return
      }
      setFocusedRowIndex(next)
      const tbody = e.currentTarget
      const row = tbody.querySelectorAll("tr")[next] as HTMLElement | null
      row?.focus()
    },
    [focusedRowIndex, rows.length]
  )

  return (
    <div className="rounded-md border">
      <Table aria-label={label} aria-busy={busy}>
        <caption className="sr-only">
          {label}, {data.length} results
        </caption>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const canSort = header.column.getCanSort()
                return (
                  <TableHead
                    key={header.id}
                    aria-sort={canSort ? getAriaSortValue(header.id) : undefined}
                    className={canSort ? "cursor-pointer select-none" : ""}
                    onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody aria-live="polite" onKeyDown={handleKeyDown}>
          {rows.length ? (
            rows.map((row, index) => (
              <TableRow
                key={row.id}
                tabIndex={index === focusedRowIndex ? 0 : -1}
                aria-selected={index === focusedRowIndex}
                onFocus={() => setFocusedRowIndex(index)}
                className="focus:outline-none focus:ring-2 focus:ring-ring focus:ring-inset"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                <p role="status">No {label.toLowerCase()} found. Try adjusting your filters.</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}
