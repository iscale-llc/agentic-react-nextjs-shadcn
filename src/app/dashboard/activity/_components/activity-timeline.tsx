"use client"

import { useState, useEffect } from "react"
import { trapsEnabled } from "@/lib/traps"
import { ActivityRow } from "./activity-row"
import { InfiniteLoader } from "./infinite-loader"
import { FilterChips } from "./filter-chips"
import type { ActivityItem, ActivityStatus } from "@/lib/mock-data/activity"

interface Props {
  initialItems: ActivityItem[]
  allItems: ActivityItem[]
}

export function ActivityTimeline({ initialItems, allItems }: Props) {
  const [items, setItems] = useState(initialItems)
  const [liveItems, setLiveItems] = useState<ActivityItem[]>([])
  const [filter, setFilter] = useState("All")

  // Simulate live updates every 10s
  useEffect(() => {
    const interval = setInterval(() => {
      const newItem: ActivityItem = {
        id: `live-${Date.now()}`,
        user: "System",
        action: "health-check",
        target: "all services",
        status: "success",
        timestamp: new Date().toISOString(),
        details: "All 12 services responding. Average latency: 42ms.",
      }
      setLiveItems((prev) => [newItem, ...prev])
    }, 10_000)
    return () => clearInterval(interval)
  }, [])

  function loadMore() {
    const nextBatch = allItems.slice(items.length, items.length + 5)
    setItems((prev) => [...prev, ...nextBatch])
  }

  const hasMore = items.length < allItems.length

  const allDisplayed = [...liveItems, ...items]
  const filtered = filter === "All"
    ? allDisplayed
    : allDisplayed.filter((item) => item.status === (filter.toLowerCase() as ActivityStatus))

  if (trapsEnabled) {
    // TRAP: no aria-live on live updates
    return (
      <div className="space-y-6">
        <FilterChips active={filter} onFilterChange={setFilter} />
        <div className="space-y-2"> {/* TRAP: no aria-live="polite" */}
          {filtered.map((item) => (
            <ActivityRow key={item.id} item={item} />
          ))}
          {filter === "All" && <InfiniteLoader hasMore={hasMore} onLoadMore={loadMore} />}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <FilterChips active={filter} onFilterChange={setFilter} />
      <div className="space-y-2" aria-live="polite" aria-label="Activity timeline">
        {filtered.map((item) => (
          <ActivityRow key={item.id} item={item} />
        ))}
        {filter === "All" && <InfiniteLoader hasMore={hasMore} onLoadMore={loadMore} />}
      </div>
    </div>
  )
}
