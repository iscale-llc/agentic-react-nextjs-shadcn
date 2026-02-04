export default function ActivityLoading() {
  return (
    <div role="status" aria-label="Loading activity log">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-40 bg-muted rounded" />
        <div className="flex gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-7 w-16 bg-muted rounded-full" />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-16 bg-muted rounded-lg" />
        ))}
      </div>
      <span className="sr-only">Loading activity log…</span>
    </div>
  )
}
