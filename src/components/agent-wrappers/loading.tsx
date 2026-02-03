export function Loading({ label }: { label: string }) {
  return (
    <div role="status" aria-label={`Loading ${label}`} className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      <span className="sr-only">Loading {label}</span>
    </div>
  )
}
