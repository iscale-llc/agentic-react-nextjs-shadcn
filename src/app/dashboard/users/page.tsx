import { Suspense } from "react"
import { Loading } from "@/components/agent-wrappers/loading"
import { Breadcrumb } from "@/components/agent-wrappers/breadcrumb"
import { getUsers, type UsersQueryParams } from "@/lib/queries/users"
import { UsersTable } from "./_components/users-table"
import { UsersFilters } from "./_components/users-filters"
import { CreateUserDialog } from "./_components/create-user-dialog"

type SearchParams = Promise<Record<string, string | string[] | undefined>>

export default async function UsersPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const params = await searchParams
  const queryParams: UsersQueryParams = {
    search: (params.search as string) ?? null,
    role: (params.role as string) ?? null,
    status: (params.status as string) ?? null,
    sort: (params.sort as string) ?? "createdAt",
    order: (params.order as "asc" | "desc") ?? "desc",
    limit: params.limit ? Number(params.limit) : 20,
    offset: params.offset ? Number(params.offset) : 0,
  }

  const { data: users, pagination } = await getUsers(queryParams)

  return (
    <div className="space-y-6">
      <Breadcrumb
        items={[
          { label: "Dashboard", href: "/dashboard" },
          { label: "Users" },
        ]}
      />
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>
        <CreateUserDialog />
      </div>
      <UsersFilters
        search={queryParams.search ?? null}
        role={queryParams.role ?? null}
        status={queryParams.status ?? null}
      />
      <Suspense fallback={<Loading label="users" />}>
        <UsersTable
          users={users}
          pagination={pagination}
        />
      </Suspense>
    </div>
  )
}
