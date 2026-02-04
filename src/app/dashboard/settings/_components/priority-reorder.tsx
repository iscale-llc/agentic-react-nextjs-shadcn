"use client"

import { useState, useRef } from "react"
import { trapsEnabled } from "@/lib/traps"
import { GripVertical, ArrowUp, ArrowDown } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const initialItems = ["Critical alerts", "Security events", "User signups", "API errors", "Billing updates"]

export function PriorityReorder() {
  const [items, setItems] = useState(initialItems)
  const dragIndex = useRef<number | null>(null)

  function moveItem(from: number, to: number) {
    if (to < 0 || to >= items.length) return
    const next = [...items]
    const [removed] = next.splice(from, 1)
    next.splice(to, 0, removed)
    setItems(next)
  }

  if (trapsEnabled) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Priority Order</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-1">
            {items.map((item, i) => (
              // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
              <li
                key={item}
                onMouseDown={() => { dragIndex.current = i }} // TRAP: mouse-only drag
                onMouseUp={() => {
                  if (dragIndex.current !== null && dragIndex.current !== i) {
                    moveItem(dragIndex.current, i)
                  }
                  dragIndex.current = null
                }}
                className="flex items-center gap-2 px-3 py-2 border rounded-md text-sm cursor-grab active:cursor-grabbing hover:bg-accent"
              >
                <GripVertical className="h-4 w-4 text-muted-foreground" />
                <span>{i + 1}. {item}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Priority Order</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-1" aria-label="Notification priorities, reorderable">
          {items.map((item, i) => (
            <li key={item} className="flex items-center gap-2 px-3 py-2 border rounded-md text-sm">
              <GripVertical className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span className="flex-1">{i + 1}. {item}</span>
              <button
                aria-label={`Move ${item} up`}
                onClick={() => moveItem(i, i - 1)}
                disabled={i === 0}
                className="p-1 rounded hover:bg-accent disabled:opacity-30"
              >
                <ArrowUp className="h-3 w-3" />
              </button>
              <button
                aria-label={`Move ${item} down`}
                onClick={() => moveItem(i, i + 1)}
                disabled={i === items.length - 1}
                className="p-1 rounded hover:bg-accent disabled:opacity-30"
              >
                <ArrowDown className="h-3 w-3" />
              </button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
