import { Suspense } from "react"
import { AnalyticsTabs } from "./_components/analytics-tabs"
import { RevenueChart } from "./_components/revenue-chart"
import { MetricCards } from "./_components/metric-cards"
import { DateRangePicker } from "./_components/date-range-picker"
import { ExportButton } from "./_components/export-button"
import { LastUpdated } from "./_components/last-updated"
import { AnalyticsActions } from "./_components/analytics-actions"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
          <LastUpdated />
        </div>
        <div className="flex items-center gap-3">
          <DateRangePicker />
          <AnalyticsActions />
          <ExportButton />
        </div>
      </div>

      <Suspense fallback={<div role="status" aria-label="Loading analytics"><span className="sr-only">Loading…</span></div>}>
        <AnalyticsTabs>
          <div className="space-y-6">
            <MetricCards />
            <RevenueChart />
          </div>
        </AnalyticsTabs>
      </Suspense>
    </div>
  )
}
