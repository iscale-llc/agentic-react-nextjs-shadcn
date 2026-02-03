"use client"

import { useState, useTransition } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import type { User } from "@/db/schema"
import { DataTable } from "@/components/agent-wrappers/data-table"
import { Pagination } from "@/components/agent-wrappers/pagination"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Trash2, ArrowUpDown } from "lucide-react"
import { deleteUser } from "@/lib/actions/users"
import { useRouter, useSearchParams } from "next/navigation"
import { EditUserForm } from "./edit-user-form"
import { toast } from "sonner"

function SortButton({ children, column }: { children: React.ReactNode; column: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSort = () => {
    const params = new URLSearchParams(searchParams.toString())
    const currentSort = params.get("sort")
    const currentOrder = params.get("order")
    if (currentSort === column && currentOrder === "asc") {
      params.set("order", "desc")
    } else {
      params.set("order", "asc")
    }
    params.set("sort", column)
    router.push(`?${params.toString()}`)
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleSort} className="-ml-3 h-8">
      {children}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  )
}

function DeleteUserButton({ user, onMutating }: { user: User; onMutating: (busy: boolean) => void }) {
  const handleDelete = async () => {
    onMutating(true)
    const formData = new FormData()
    formData.append("id", user.id)
    const result = await deleteUser(formData)
    onMutating(false)
    if (result?.error) {
      toast.error(result.error)
    } else {
      toast.success("User deleted")
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          aria-label={`Delete ${user.name}`}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete user</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete {user.name} ({user.email}). This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

type UsersTableProps = {
  users: User[]
  pagination: { total: number; limit: number; offset: number; hasMore: boolean }
}

export function UsersTable({ users, pagination }: UsersTableProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [busy, setBusy] = useState(false)
  const [isPending, startTransition] = useTransition()

  const isBusy = busy || isPending

  const handlePageChange = (offset: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("offset", String(offset))
    startTransition(() => {
      router.push(`?${params.toString()}`)
    })
  }

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: () => <SortButton column="name">Name</SortButton>,
      enableSorting: true,
    },
    {
      accessorKey: "email",
      header: () => <SortButton column="email">Email</SortButton>,
      enableSorting: true,
    },
    {
      accessorKey: "role",
      header: () => <SortButton column="role">Role</SortButton>,
      cell: ({ row }) => <Badge variant="outline">{row.getValue("role")}</Badge>,
      enableSorting: true,
    },
    {
      accessorKey: "status",
      header: () => <SortButton column="status">Status</SortButton>,
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge variant={status === "active" ? "default" : "secondary"}>
            {status}
          </Badge>
        )
      },
      enableSorting: true,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const user = row.original
        return (
          <div className="flex items-center gap-2">
            <EditUserForm user={user} />
            <DeleteUserButton user={user} onMutating={setBusy} />
          </div>
        )
      },
    },
  ]

  return (
    <div>
      <p role="status" aria-live="polite" className="text-sm text-muted-foreground mb-2">
        {pagination.total === 0
          ? "No users found"
          : `Showing ${pagination.offset + 1}–${Math.min(pagination.offset + pagination.limit, pagination.total)} of ${pagination.total} users`}
      </p>
      <DataTable label="Users" columns={columns} data={users} busy={isBusy} />
      <Pagination
        total={pagination.total}
        limit={pagination.limit}
        offset={pagination.offset}
        onPageChange={handlePageChange}
      />
    </div>
  )
}
