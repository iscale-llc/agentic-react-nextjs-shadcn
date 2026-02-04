export default function SettingsLoading() {
  return (
    <div role="status" aria-label="Loading settings">
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-36 bg-muted rounded" />
        <div className="h-48 bg-muted rounded-xl" />
        <div className="h-32 bg-muted rounded-xl" />
        <div className="h-24 bg-muted rounded-xl" />
      </div>
      <span className="sr-only">Loading settings…</span>
    </div>
  )
}
