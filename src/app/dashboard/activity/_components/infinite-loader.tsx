"use client"

import { useEffect, useRef } from "react"
import { trapsEnabled } from "@/lib/traps"
import { Button } from "@/components/ui/button"

interface Props {
  hasMore: boolean
  onLoadMore: () => void
}

export function InfiniteLoader({ hasMore, onLoadMore }: Props) {
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!trapsEnabled || !hasMore) return
    const el = sentinelRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onLoadMore()
      },
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [hasMore, onLoadMore])

  if (!hasMore) return null

  if (trapsEnabled) {
    // TRAP: infinite scroll only, no load-more button
    return (
      <div ref={sentinelRef} className="h-10 flex items-center justify-center"> {/* TRAP: no button fallback */}
        <span className="text-xs text-muted-foreground">Loading more…</span>
      </div>
    )
  }

  return (
    <div className="flex justify-center py-4">
      <Button variant="outline" size="sm" onClick={onLoadMore}>
        Load more
      </Button>
    </div>
  )
}
