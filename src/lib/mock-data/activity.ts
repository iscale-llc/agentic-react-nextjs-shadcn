export type ActivityStatus = "success" | "warning" | "error" | "info"

export interface ActivityItem {
  id: string
  user: string
  action: string
  target: string
  status: ActivityStatus
  timestamp: string
  details: string
}

const now = new Date("2026-02-03T15:00:00Z")

function minutesAgo(m: number) {
  return new Date(now.getTime() - m * 60_000).toISOString()
}

export const activityItems: ActivityItem[] = [
  { id: "a1", user: "Alice Chen", action: "deployed", target: "v2.4.1 to production", status: "success", timestamp: minutesAgo(2), details: "Build #4521 completed in 3m 42s. All 847 tests passed. Bundle size: 1.2MB (no change)." },
  { id: "a2", user: "Bob Smith", action: "merged", target: "PR #312 - Fix auth redirect", status: "success", timestamp: minutesAgo(8), details: "2 files changed, +14 -7. Reviewed by Carol Davis. Fixes issue #298." },
  { id: "a3", user: "Carol Davis", action: "triggered", target: "database migration #47", status: "warning", timestamp: minutesAgo(15), details: "Migration added index on users.email. Lock acquired for 12s. 3 slow queries detected during migration." },
  { id: "a4", user: "Dave Wilson", action: "failed", target: "CI pipeline for feature/payments", status: "error", timestamp: minutesAgo(23), details: "Test suite failed: 3 failures in payments.test.ts. TypeError: Cannot read property 'amount' of undefined at line 142." },
  { id: "a5", user: "Eve Martinez", action: "updated", target: "environment variables", status: "info", timestamp: minutesAgo(31), details: "Updated STRIPE_API_KEY and WEBHOOK_SECRET in production. Triggered config reload." },
  { id: "a6", user: "Frank Lee", action: "scaled", target: "API servers 2 → 4 instances", status: "success", timestamp: minutesAgo(45), details: "Auto-scaling triggered by CPU > 80%. New instances healthy after 45s. Current load: 62%." },
  { id: "a7", user: "Grace Kim", action: "reverted", target: "v2.4.0 deployment", status: "warning", timestamp: minutesAgo(62), details: "Rollback to v2.3.9 due to increased error rate. P95 latency was 2.3s (threshold: 1s)." },
  { id: "a8", user: "Henry Park", action: "created", target: "new API key for partner integration", status: "info", timestamp: minutesAgo(78), details: "Key scoped to read-only access on /api/v2/products. Expires 2026-08-03." },
  { id: "a9", user: "Alice Chen", action: "resolved", target: "incident INC-2847", status: "success", timestamp: minutesAgo(95), details: "Root cause: connection pool exhaustion. Fix: increased max connections from 20 to 50." },
  { id: "a10", user: "Bob Smith", action: "deleted", target: "stale feature branch cleanup", status: "info", timestamp: minutesAgo(120), details: "Removed 12 branches older than 90 days. Freed 340MB of git storage." },
  { id: "a11", user: "Carol Davis", action: "approved", target: "PR #308 - Add rate limiting", status: "success", timestamp: minutesAgo(150), details: "Added 100 req/min limit per API key. Load tested at 2x capacity. No regressions." },
  { id: "a12", user: "Dave Wilson", action: "failed", target: "backup job nightly-db-snapshot", status: "error", timestamp: minutesAgo(180), details: "S3 upload timed out after 300s. Database size: 4.2GB. Retrying with multipart upload." },
]

export const filterOptions = ["All", "Success", "Warning", "Error", "Info"] as const

export function getPagedActivities(page: number, pageSize: number = 5) {
  const start = (page - 1) * pageSize
  return {
    items: activityItems.slice(start, start + pageSize),
    hasMore: start + pageSize < activityItems.length,
    total: activityItems.length,
  }
}
