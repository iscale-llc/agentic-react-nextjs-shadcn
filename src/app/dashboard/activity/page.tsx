import { activityItems } from "@/lib/mock-data/activity"
import { ActivityTimeline } from "./_components/activity-timeline"
import { FlashNotification } from "./_components/flash-notification"

export default function ActivityPage() {
  const initialItems = activityItems.slice(0, 5)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Activity Log</h1>

      <FlashNotification />
      <ActivityTimeline initialItems={initialItems} allItems={activityItems} />
    </div>
  )
}
