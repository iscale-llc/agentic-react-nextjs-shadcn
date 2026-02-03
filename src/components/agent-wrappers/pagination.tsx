"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

type PaginationProps = {
  total: number
  limit: number
  offset: number
  onPageChange: (offset: number) => void
}

export function Pagination({ total, limit, offset, onPageChange }: PaginationProps) {
  const currentPage = Math.floor(offset / limit) + 1
  const totalPages = Math.ceil(total / limit)

  if (totalPages <= 1) return null

  return (
    <nav aria-label="Pagination" className="flex items-center justify-between px-2 py-4">
      <p className="text-sm text-muted-foreground">
        {offset + 1}–{Math.min(offset + limit, total)} of {total}
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(0, offset - limit))}
          disabled={offset === 0}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i}
            variant={i + 1 === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => onPageChange(i * limit)}
            aria-label={`Page ${i + 1} of ${totalPages}`}
            aria-current={i + 1 === currentPage ? "page" : undefined}
          >
            {i + 1}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min((totalPages - 1) * limit, offset + limit))}
          disabled={offset + limit >= total}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  )
}
