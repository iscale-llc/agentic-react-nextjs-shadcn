export default function SheetsLoading() {
  return (
    <div role="status" aria-label="Loading spreadsheet">
      <div className="animate-pulse space-y-4">
        <div className="h-8 w-32 bg-muted rounded" />
        <div className="h-10 w-full bg-muted rounded" />
        <div className="grid grid-cols-8 gap-px">
          {Array.from({ length: 80 }).map((_, i) => (
            <div key={i} className="h-8 bg-muted rounded-sm" />
          ))}
        </div>
      </div>
      <span className="sr-only">Loading spreadsheet…</span>
    </div>
  )
}
