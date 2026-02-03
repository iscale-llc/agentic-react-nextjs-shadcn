import { Suspense } from "react"
import { Loading } from "@/components/agent-wrappers/loading"
import { StatsCards } from "./_components/stats-cards"
import { RecentActivity } from "./_components/recent-activity"
import { Breadcrumb } from "@/components/agent-wrappers/breadcrumb"
import { getUsers } from "@/lib/queries/users"

export default async function DashboardPage() {
  const { data: users, pagination } = await getUsers({ limit: 5 })

  return (
    <div className="space-y-6">
      <Breadcrumb items={[{ label: "Dashboard" }]} />
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <Suspense fallback={<Loading label="stats" />}>
        <StatsCards totalUsers={pagination.total} />
      </Suspense>
      <Suspense fallback={<Loading label="recent activity" />}>
        <RecentActivity users={users} />
      </Suspense>
    </div>
  )
}
