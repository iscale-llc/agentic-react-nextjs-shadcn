export default function AnalyticsLoading() {
  return (
    <div role="status" aria-label="Loading analytics">
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-48 bg-muted rounded" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-xl" />
          ))}
        </div>
        <div className="h-64 bg-muted rounded-xl" />
      </div>
      <span className="sr-only">Loading analytics data…</span>
    </div>
  )
}
