"use client"

import { trapsEnabled } from "@/lib/traps"
import { metricCards } from "@/lib/mock-data/analytics"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function MetricCards() {
  if (trapsEnabled) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metricCards.map((metric) => (
          <Card key={metric.label} className="group relative">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metric.shortValue}</div>
              <p className="text-xs text-muted-foreground mt-1">{metric.change} from last month</p>
              {/* TRAP: hover-only tooltip for precise value */}
              <span className="absolute bottom-2 right-2 text-xs bg-popover border rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                {metric.fullValue}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricCards.map((metric) => {
        const descId = `metric-desc-${metric.label.replace(/\s+/g, "-").toLowerCase()}`
        return (
          <Card key={metric.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {metric.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold" aria-describedby={descId}>
                {metric.shortValue}
              </div>
              <span id={descId} className="sr-only">Exact value: {metric.fullValue}</span>
              <p className="text-xs text-muted-foreground mt-1">{metric.change} from last month</p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
